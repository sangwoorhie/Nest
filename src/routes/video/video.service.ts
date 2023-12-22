import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, ReadStream } from 'node:fs';
import { stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DataSource, Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class VideoService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // 비디오 ID로 찾기
  async findOne(id: string) {
    const video = await this.videoRepository.findOne({
      relations: ['user'],
      where: { id },
    });
    if (!video) throw new NotFoundException('비디오가 존재하지 않습니다.');
    return video;
  }

  // 비디오 다운로드
  async download(
    id: string,
  ): Promise<{ stream: ReadStream; mimetype: string; size: number }> {
    const video = await this.videoRepository.findOneBy({ id });
    if (!video) throw new NotFoundException('비디오가 존재하지 않습니다.');

    await this.videoRepository.update(
      { id },
      { downloadCount: () => 'downloadcount + 1' }, // 비디오 다운로드 카운드 증가
    );

    const { mimetype } = video;
    const extension = mimetype.split('/')[1]; // 비디오 확장자
    const videoPath = join(
      // 비디오 저장위치 경로
      process.cwd(),
      'video-storage',
      `${id}.${extension}`,
    );
    const { size } = await stat(videoPath);
    const stream = createReadStream(videoPath); // 파일 읽기
    return { stream, mimetype, size };
  }

  // async create(
  //   userId: string,
  //   title: string,
  //   mimetype: string,
  //   extension: string,
  //   buffer: Buffer,
  // ): Promise<Video> {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.startTransaction();
  //   try {
  //     const user = await this.userRepository.findOneBy({ id: userId });
  //     const video = await this.videoRepository.save(
  //       this.videoRepository.create({ title, mimetype, user }),
  //     );
  //     await this.uploadVideo(video.id, extension, buffer);
  //     await queryRunner.commitTransaction();
  //     return video;
  //   } catch (err) {
  //     console.error(err);
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async findAll(page: number, size: number) {
  //   const videos = await this.videoRepository.find({
  //     relations: ['user'],
  //     skip: (page - 1) * size,
  //     take: size,
  //   });
  //   return videos;
  // }
}
