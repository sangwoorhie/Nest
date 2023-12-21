import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';

// 회원가입 요청 DTO
export class SignupReqDto {
  @ApiProperty({
    required: true,
    description: '이메일',
    example: 'nestjs@naver.com',
  })
  @IsEmail()
  @MaxLength(30)
  @Matches(
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
    {
      message: '이메일 형식이 올바르지 않습니다.',
    },
  )
  email: string;

  @ApiProperty({
    required: true,
    description: '비밀번호',
    example: 'Password123@',
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,20}$/, {
    message:
      '비밀번호는 최소 6자 이상의 영문 대소문자 및 숫자와 특수문자를 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({
    required: true,
    description: '확인 비밀번호',
    example: 'Password123@',
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,20}$/, {
    message:
      '비밀번호는 최소 6자 이상의 영문 대소문자 및 숫자와 특수문자를 포함해야 합니다.',
  })
  confirmPassword: string;

  @ApiProperty({ required: true, description: '이름', example: 'Jake' })
  @IsString()
  name: string;
}

// 로그인 요청 DTO
export class SigninReqDto {
  @ApiProperty({ required: true, example: 'nestjs@naver.com' })
  @IsEmail()
  @MaxLength(30)
  email: string;

  @ApiProperty({ required: true, example: 'Password123@' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,20}$/)
  password: string;
}
