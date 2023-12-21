import { UserService } from 'src/user/user.service';
import {
  ExecutionContext,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';
import { ROLES_KEY } from 'src/common/decorator/role.decorator';
import { UserRole } from 'src/user/enum/user.enum';

// Guard단에서는 인증(Authentication), 인가(Authorization)을 주로 처리
//  JWT 토큰을 사용하여 인증 처리, isPublic일 경우 인증과정 없이 접근가능
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UserService,
    @Inject(Logger) private logger: LoggerService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // refreshAPI를 요청했을 때만 refreshToken 로직활용
    const http = context.switchToHttp();
    const { url, headers } = http.getRequest<Request>();
    const token = /Bearer\s(.+)/.exec(headers['authorization'])[1]; //Bearer 잘라내고, refreshToken만 추출출
    const decodedToken = this.jwtService.decode(token);

    // 호출한 API url이 @refresh가 아니고, 디코딩토큰값이 리프래시토큰일때
    // 즉 호출 url이 @refresh이어야 하는데 아닌상태로 리프래시토큰이 잘못 발급해서 헤더에 전달할 때
    if (
      url !== '/api/auth/refresh' &&
      decodedToken['tokenType'] === 'refresh'
    ) {
      const error = new UnauthorizedException('accessToken이 필요합니다.');
      this.logger.error(error.message, error.stack);
      throw error;
    }

    // 메타데이터로 읽어온 유저권한 (관리자만 가능하도록 권한부여)
    // @Roles 데코레이터가 쓰인 경우에만 작동.
    const requiresRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiresRoles) {
      const userId = decodedToken['sub']; // 해당 user가 어떤 role을 갖고있는지 조회
      return this.userService.checkUserIsAdmin(userId);
    }

    return super.canActivate(context);
  }
}
