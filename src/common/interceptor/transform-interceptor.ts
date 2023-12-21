import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';

// 페이지네이션 인터셉터 : 데이터가 배열인 경우 페이지네이션을 위한 구조로 변형, 응답을 클라이언트에게 전달하기 전에 가공하는 용도
@Injectable()
export class TransformInterceptor<T, R> implements NestInterceptor<T, R> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<R> | Promise<Observable<R>> {
    return next.handle().pipe(
      map((data) => {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();

        if (Array.isArray(data)) {
          return {
            items: data,
            page: Number(request.query['page'] || 1),
            size: Number(request.query['size'] || 20),
          };
        } else {
          return data;
        }
      }),
    );
  }
}
