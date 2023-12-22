import { ApiProperty } from '@nestjs/swagger';
import { Video } from '../entities/video.entity';

// 비디오 생성 응답 DTO
export class CreateVideoResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  title: string;

  static toDto({ id, title }: Video) {
    return { id, title };
  }
}

// 비디오를 업로드한 유저정보 응답 DTO
export class FindVideoUserDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  email: string;
}

// 비디오 찾기 응답 DTO
export class FindVideoResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: true })
  user: FindVideoUserDto;

  static toDto({ id, title, user: { id: userId, email } }: Video) {
    return { id, title, user: { id: userId, email } };
  }
}
