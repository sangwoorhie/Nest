import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import * as basicAuth from 'express-basic-auth';
import { SentryInterceptor } from './common/interceptor/sentry.interceptor';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  // Winston 로거 : 'prod' 환경이 아닌 경우 로그 레벨을 'debug'로 설정하고, 'prod' 환경에서는 'info'로 설정
  // 로그에 타임스탬프, 'NestJS'형태 로그 출력
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike('NestJS', { prettyPrint: true }),
          ),
        }),
      ],
    }),
  });

  const configService = app.get(ConfigService);
  const stage = configService.get('NODE_ENV');
  app.setGlobalPrefix('api/v1');

  // Swagger : http://localhost:3000/docs
  // 스웨거가 로컬 or 개발(dev)환경이라는 전제 하에만 작동, 프로덕션 환경에서는 노출X
  const SWAGGER_ENVS = ['local', 'development']; // ex) run start:dev : NODE_ENV=development
  if (SWAGGER_ENVS.includes(stage)) {
    app.use(
      ['/docs', '/docs-json'], // 접근경로
      basicAuth({
        challenge: true,
        users: {
          [configService.get('swagger.user')]:
            configService.get('swagger.password'), // 환경변수 유저인증
        },
      }),
    );
    const config = new DocumentBuilder()
      .setTitle('NestJS project')
      .setDescription('NestJS project API description')
      .setVersion('0.1')
      .addBearerAuth() //jwt인증
      .build();

    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      }, // 새로고침시 마다 인증이 사라지지않고, 유지되도록함 (AccessToken을 다시 헤더로 전달)
    };
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, customOptions);
  }

  // ValidationPipe 전역 적용
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // class-transformer 적용
    }),
  );

  // Sentry SDK 초기화
  Sentry.init({ dsn: configService.get('sentry.dsn') });

  // 페이지네이션을 위한 TransformInterceptor 전역 적용
  // 에러발생시 슬랙알람을 위한 SentryInterceptor 전역 적용
  app.useGlobalInterceptors(
    new SentryInterceptor(),
    new TransformInterceptor(),
  );

  const PORT = 3000;
  await app.listen(PORT);
  Logger.log(`NODE_ENV: ${configService.get('NODE_ENV')}`);
  Logger.log(`listening on port ${PORT}`);
}
bootstrap();

// nest g res name
