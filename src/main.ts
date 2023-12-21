import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');

  // Swagger
  // http://localhost:3000/docs
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

  // ValidationPipe 전역 적용
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // class-transformer 적용
    }),
  );

  const PORT = 3000;
  await app.listen(PORT);
  console.info(`NODE_ENV: ${configService.get('NODE_ENV')}`);
  console.info(`listening on port ${PORT}`);
}
bootstrap();

// nest g res name
