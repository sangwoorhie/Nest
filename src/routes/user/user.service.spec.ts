import { IsEmail } from 'class-validator';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

// Jest를 활용한 UserService 단위테스트 : npm run test
class MockRepository {
  async findOneBy(query) {
    const user: User = new User();
    user.email = query.email;
    return user;
  }
}

describe('User', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: MockRepository,
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
  });

  // 이메일로 유저 찾기 테스트코드
  it('should', async () => {
    const email = 'nest@naver.com';
    const result = await userService.findUserByEmail(email);
    expect(result.email).toBe(email);
  });
});
