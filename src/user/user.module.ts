import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, Logger],
})
export class UserModule {}
