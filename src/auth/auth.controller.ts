import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { SigninResDto, SignupResDto } from './dto/res.dto';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';

@ApiTags('Auth')
@ApiExtraModels(SignupResDto, SigninResDto)
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
}
