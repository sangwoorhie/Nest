import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { RefreshResDto, SigninResDto, SignupResDto } from './dto/res.dto';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { User, UserAfterAuth } from 'src/common/decorator/user.decorator';

@ApiTags('Auth')
@ApiExtraModels(SignupResDto, SigninResDto, RefreshResDto)
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 회원가입
  @Public()
  @ApiPostResponse(SignupResDto)
  @ApiOperation({ summary: '회원가입' })
  @Post('signup')
  async signup(
    @Body() { email, password, confirmPassword, name }: SignupReqDto,
  ): Promise<SignupResDto> {
    const { id } = await this.authService.signup(
      email,
      password,
      confirmPassword,
      name,
    );
    return { id };
  }

  // 로그인
  @Public()
  @ApiPostResponse(SigninResDto)
  @ApiOperation({ summary: '로그인' })
  @Post('signin')
  async signin(
    @Body() { email, password }: SigninReqDto,
  ): Promise<SigninResDto> {
    return this.authService.signin(email, password);
  }

  // 로그인 시 리프레시토큰 발급 (로그인을 대신해서 클라이언트에서 전달하는 refreshToken으로 진행하는 API)
  // 클라이언트에서, Access토큰이 만료되었을 때 자동 호출
  @Public()
  @ApiPostResponse(RefreshResDto)
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(
    @Headers('authorization') authorization,
    @User() user: UserAfterAuth,
  ) {
    const token = /Bearer\s(.+)/.exec(authorization)[1]; //Bearer 토큰 추출
    const { accessToken, refreshToken } = await this.authService.refresh(
      token,
      user.id,
    );
    return { accessToken, refreshToken };
  }
}
