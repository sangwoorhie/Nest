import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ScheduleModule } from '@nestjs/schedule';
import { VideoModule } from 'src/routes/video/video.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  // Top5기록하고 있는 비디오의 정보를 스케줄러를 활용하여 주기적으로 메일로 보냄
  imports: [ScheduleModule.forRoot(), VideoModule, EmailModule],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
