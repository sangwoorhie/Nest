import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

// 비디오 생성 요청 DTO
export class CreateVideoReqDto {
  @ApiProperty({ required: true })
  @MinLength(2)
  @MaxLength(30)
  @IsString()
  title: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  video: any;
}

// 비디오 찾기 요청 DTO
export class FindVideoReqDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;
}
