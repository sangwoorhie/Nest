import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { IsEmail, IsString } from 'class-validator';

// 유저 찾기 응답 DTO
export class FindUserResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  role: string;

  @ApiProperty({ required: true })
  createdAt: string;

  static toDto({ id, email, role, createdAt }: User) {
    return {
      id,
      email,
      role: role.toString(),
      createdAt: createdAt.toISOString(),
    };
  }
}

// 회원정보 수정 응답 DTO
export class EditUserResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  static toDto({ id, email, name, updatedAt }: User) {
    return {
      id,
      email,
      name,
      updatedAt: updatedAt.toISOString(),
    };
  }
}

// 회원 탈퇴 응답 DTO
export class DeleteUserResDto {
  constructor(id: string) {
    this.id = id;
  }

  @ApiProperty({ required: true })
  id: string;
}
