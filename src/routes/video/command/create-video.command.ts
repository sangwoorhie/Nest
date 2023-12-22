import { ICommand } from '@nestjs/cqrs';

// CQRS 패턴에서 명령(Command) 객체를 정의하는 데 사용
export class CreateVideoCommand implements ICommand {
  constructor(
    readonly userId: string, // 비디오 생성 사용자 ID
    readonly title: string, // 비디오 제목
    readonly mimetype: string, // 비디오의 MIME 타입 (video/mp4, video/avi 등)
    readonly extension: string, // 비디오 파일의 확장자
    readonly buffer: Buffer, // 비디오 데이터를 담고 있는 버퍼(Buffer) 객체
  ) {}
}
