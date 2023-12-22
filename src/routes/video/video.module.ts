import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsModule } from 'src/analytics/analytics.module';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { Video } from './entities/video.entity';
import { User } from '../user/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateVideoHandler } from './create-video.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video, User]),
    AnalyticsModule,
    CqrsModule,
  ],
  controllers: [VideoController],
  providers: [VideoService, CreateVideoHandler],
})
export class VideoModule {}
