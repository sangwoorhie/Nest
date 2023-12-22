import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindVideosQuery } from '../query/find.videos.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from '../entities/video.entity';
import { Repository } from 'typeorm';

// 조회된 비디오들을 페이지네이션(페이지와 사이즈에 맞게 조정)해서 비디오 목록 반환 핸들러
@Injectable()
@QueryHandler(FindVideosQuery)
export class FindVideosQueryHandler implements IQueryHandler<FindVideosQuery> {
  constructor(
    @InjectRepository(Video) private videoRepository: Repository<Video>,
  ) {}

  async execute({ page, size }: FindVideosQuery): Promise<any> {
    const videos = await this.videoRepository.find({
      relations: ['user'],
      skip: (page - 1) * size,
      take: size,
    });
    return videos;
  }
}
