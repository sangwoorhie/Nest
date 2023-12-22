import { ApiProperty } from '@nestjs/swagger';

// 회원가입 응답 DTO
export class SignupResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}

// 로그인 응답 DTO
export class SigninResDto {
  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}

// 리프레시토큰 응답 DTO
export class RefreshResDto {
  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}

// 로그아웃 응답 DTO
export class LogoutResDto {
  constructor(id: string) {
    this.id = id;
  }
  @ApiProperty({ required: true })
  id: string;
}
