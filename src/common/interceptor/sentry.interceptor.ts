import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { Request as ExpressRequest } from 'express';
import * as Sentry from '@sentry/node';
import { IncomingWebhook } from '@slack/webhook';

// Sentry사용, 에러발생시 Slack 웹훅으로 슬랙 알람
@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const http = context.switchToHttp();
    const request = http.getRequest<ExpressRequest>();
    const { url } = request;
    return next.handle().pipe(
      catchError((error) => {
        Sentry.captureException(error); // Sentry에 에러 기록
        const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK);
        webhook.send({
          attachments: [
            {
              text: 'NestJs Video 프로젝트 에러 발생',
              fields: [
                {
                  title: `Error Message: ${error.response?.message} || ${error.message}`,
                  value: `URL : ${url}\n${error.stack}`,
                  short: false,
                },
              ],
              ts: Math.floor(new Date().getTime() / 1000).toString(),
            },
          ],
        });
        throw error;
      }),
    );
  }
}
