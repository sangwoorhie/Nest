import { ApiProperty } from '@nestjs/swagger';

// 페이지네이션 응답 DTO
export class PageResDto<TData> {
  @ApiProperty({ required: true })
  page: number;

  @ApiProperty({ required: true })
  size: number;

  items: TData[]; // 리스트 형태의 핵심데이터
}
