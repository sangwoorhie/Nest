import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

// 회원정보 수정 요청 DTO
export class EditUserReqDto {
  @ApiProperty({ required: true })
  confirmPassword: string;

  @ApiProperty({ required: true })
  @IsEmail()
  newPassword: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;
}

// 회원 탈퇴 요청 DTO
export class DeleteUserReqDto {
  @ApiProperty({ required: true })
  confirmPassword: string;
}
