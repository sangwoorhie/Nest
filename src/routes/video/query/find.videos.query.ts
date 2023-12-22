import { IQuery } from '@nestjs/cqrs';

// 페이징되는 videos를 리턴하는 쿼리
export class FindVideosQuery implements IQuery {
  constructor(
    readonly page: number,
    readonly size: number,
  ) {}
}
