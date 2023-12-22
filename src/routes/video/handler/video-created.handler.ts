import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { VideoCreatedEvent } from '../event/video-created.event';

// 비디오생성시 로그출력 이벤트핸들러
@Injectable()
@EventsHandler(VideoCreatedEvent)
export class VideoCreatedHandler implements IEventHandler<VideoCreatedEvent> {
  handle(event: VideoCreatedEvent) {
    console.info(`비디오 ID${event.id}가 생성되었습니다.`);
  }
}
