import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Video } from 'src/routes/video/entities/video.entity';

// 스케줄러에 따른 이메일 전송
@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(videos: Video[]) {
    const data = videos.map(({ id, title, downloadCount }) => {
      return `<tr><td>${id}</td><td>${title}</td><td>${downloadCount}</td> </tr>`;
    });
    await this.mailerService.sendMail({
      from: 'a26484638@gmail.com',
      to: 'customer@gmail.com',
      subject: 'NestJS Project Video',
      html: `
        <table style="border: 1px solid black; width: 60%; margin: auto; text-align: center;">
        <tr><th>id</th><th>title</th><th>download count</th></tr>
        ${data}
        </table>
        `,
    });
  }
}
