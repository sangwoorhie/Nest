import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './entities/refreshToken.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  // 1. 회원가입
  async signup(
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
  ) {
    if (password !== confirmPassword)
      throw new BadRequestException(
        '비밀번호와 확인 비밀번호가 일치하지 않습니다.',
      );

    // 동일이메일 존재유무 확인
    const user = await this.userService.findUserByEmail(email);
    if (user) throw new BadRequestException('이미 존재하는 이메일입니다.');
    const saltOrRounds = 10;

    // 비밀번호 해싱후 저장
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const newUser = await this.userService.signup(email, hashedPassword, name);

    // 액세스, 리프레시 토큰 발급 후 저장,반환
    const accessToken = this.generateAccessToken(newUser.id);
    const refreshToken = this.generateRefreshToken(newUser.id);
    await this.createRefreshTokenUsingUser(newUser.id, refreshToken);

    return { id: newUser.id, accessToken, refreshToken };
  }

  // 2. 로그인
  async signin(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user)
      throw new UnauthorizedException('해당 회원이 존재하지 않습니다.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('잘못된 비밀번호입니다.');

    const refreshToken = await this.generateRefreshToken(user.id);
    await this.createRefreshTokenUsingUser(user.id, refreshToken);

    return {
      accessToken: this.generateAccessToken(user.id),
      refreshToken,
    };
  }

  // 엑세스토큰 발급
  private generateAccessToken(userid: string) {
    const payload = { sub: userid, tokenType: 'access' };
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  // 리프레시토큰 발급
  private generateRefreshToken(userid: string) {
    const payload = { sub: userid, tokenType: 'refresh' };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  // 리프레시토큰 영속성 유지 (리프래시토큰 있으면 갱신, 없으면 새로운 엔티티 생성 저장)
  private async createRefreshTokenUsingUser(
    userId: string,
    refreshToken: string,
  ) {
    let refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      user: { id: userId },
    });

    // if 이미 리프레시토큰을 발급받은 경우 / else 그렇지 않은경우
    if (refreshTokenEntity) {
      refreshTokenEntity.token = refreshToken;
    } else {
      refreshTokenEntity = this.refreshTokenRepository.create({
        user: { id: userId },
        token: refreshToken,
      });
      await this.refreshTokenRepository.save(refreshTokenEntity);
    }
  }

  // 3. 로그인 시 리프레시토큰 발급 (로그인을 대신해서 클라이언트에서 전달하는 refreshToken으로 진행하는 API)
  async refresh(token: string, userId: string) {
    const refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      token,
    });
    if (refreshTokenEntity) throw new BadRequestException();
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);
    // 리프레시토큰 영속성 유지
    refreshTokenEntity.token = refreshToken;
    await this.refreshTokenRepository.save(refreshTokenEntity);
    return { accessToken, refreshToken };
  }
}
