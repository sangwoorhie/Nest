import { ApiProperty } from '@nestjs/swagger';

// 회원가입 응답 DTO
export class SignupResDto {
  @ApiProperty({ required: true })
  id: string;
}

// 로그인 응답 DTO
export class SigninResDto {
  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}

export class RefreshResDto {
  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}
