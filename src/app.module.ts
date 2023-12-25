import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AnalyticsModule } from './analytics/analytics.module';
import { UserModule } from './routes/user/user.module';
import { VideoModule } from './routes/video/video.module';
import { AuthModule } from './routes/auth/auth.module';
import postgresConfig from './config/postgres.config';
import jwtConfig from './config/jwt.config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import swaggerConfig from './config/swagger.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './routes/health/health.module';
import { EmailModule } from './email/email.module';
import sentryConfig from './config/sentry.config';
import emailConfig from './config/email.config';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60, // 유효시간(초단위) 제한
        limit: 10, // 해당 유효시간동안 요청횟수 제한 (60초동안 10번 제한)
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        postgresConfig,
        jwtConfig,
        swaggerConfig,
        sentryConfig,
        emailConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let obj: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get('postgres.host'),
          port: configService.get('postgres.port'),
          database: configService.get('postgres.database'),
          username: configService.get('postgres.username'),
          password: configService.get('postgres.password'),
          autoLoadEntities: true,
          ssl: {
            rejectUnauthorized: false,
          },
          synchronize: false,
        };
        // 주의! development 환경에서만 개발 편의성을 위해 활용
        if (configService.get('NODE_ENV') === 'development') {
          // console.info('Sync TypeORM');
          obj = Object.assign(obj, {
            // synchronize: true,
            logging: true,
          });
        }
        return obj;
      },
    }),
    AuthModule,
    UserModule,
    VideoModule,
    AnalyticsModule,
    HealthModule,
    EmailModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  // 최상단 루트 디렉토리인 app.module에 LoggerMiddleware 모든 라우트에 전역 적용
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

// npm run typeorm migration:generate src/migrations/Init
// npm run typeorm migration:run
