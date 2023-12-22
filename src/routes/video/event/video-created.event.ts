import { IEvent } from '@nestjs/cqrs';

// 비디오 생성시 로그 출력 용 이벤트
export class VideoCreatedEvent implements IEvent {
  constructor(readonly id: string) {}
}
