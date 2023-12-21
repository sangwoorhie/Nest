import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

// 페이지네이션 요청 DTO
export class PageReqDto {
  @ApiPropertyOptional({ description: '페이지. Default = 1' })
  @Transform(({ value }) => Number(value)) // param의 value를 숫자열화
  @IsInt() // 정수
  page?: number = 1;

  @ApiPropertyOptional({ description: '페이지당 데이터 갯수. min:0, max: 50' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  size?: number = 50;
}
