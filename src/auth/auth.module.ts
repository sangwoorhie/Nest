import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refreshToken.entity';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => {
        return {
          global: true,
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
    TypeOrmModule.forFeature([RefreshToken]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
