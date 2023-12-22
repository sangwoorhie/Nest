import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsModule } from 'src/analytics/analytics.module';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { Video } from './entities/video.entity';
import { User } from '../user/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateVideoHandler } from './handler/create-video.handler';
import { VideoCreatedHandler } from './handler/video-created.handler';
import { FindVideosQueryHandler } from './handler/find-videos.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Video, User]), CqrsModule],
  controllers: [VideoController],
  providers: [
    VideoService,
    CreateVideoHandler,
    VideoCreatedHandler,
    FindVideosQueryHandler,
  ],
  exports: [VideoService],
})
export class VideoModule {}
