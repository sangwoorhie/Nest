import {
  NestMiddleware,
  Logger,
  Injectable,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// 해당 요청에 대한 메서드, URL, 상태 코드, 사용자 에이전트 정보, IP 주소 로그 출력
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}
  //   private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl: url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.log(
        `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });
  }
}
