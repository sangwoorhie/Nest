import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

const UserMockService = {
  findAll: () => {
    return 'find mock users';
  },
};

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService],
  controllers: [UserController],
  providers: [
    // {
    //   provide: UserService,
    //   useValue: UserMockService,
    // },
    UserService,
  ],
})
export class UserModule {}
