import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

// Jest를 활용한 UserService 단위테스트 : npm run test
class MockRepository {
  // 1. 유저 1명 확인(이메일로 유저찾기)
  async findOneBy(query) {
    const user: User = new User();
    user.email = query.email;
    return user;
  }

  // 2. 유저 목록확인
  async find(options) {
    const mockUsers = [
      // 테스트 더미데이터
      { id: '1', email: 'user1@example.com', name: 'User 1' },
      { id: '2', email: 'user2@example.com', name: 'User 2' },
      { id: '3', email: 'user3@example.com', name: 'User 3' },
      { id: '4', email: 'user1@example.com', name: 'User 4' },
      { id: '5', email: 'user2@example.com', name: 'User 5' },
      { id: '6', email: 'user3@example.com', name: 'User 6' },
      { id: '7', email: 'user1@example.com', name: 'User 7' },
      { id: '8', email: 'user2@example.com', name: 'User 8' },
      { id: '9', email: 'user3@example.com', name: 'User 9' },
      { id: '10', email: 'user3@example.com', name: 'User 10' },
    ];
    const { skip, take } = options;
    const paginatedUsers = mockUsers.slice(skip, skip + take);
    return paginatedUsers;
  }
}

describe('User', () => {
  let userService: UserService;
  let mockRepository: MockRepository;

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
    mockRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  // 1. 이메일로 유저 찾기 테스트코드
  it('should', async () => {
    const email = 'nest@naver.com';
    const result = await userService.findUserByEmail(email);
    expect(result.email).toBe(email);
  });

  // 2. 유저목록 반환 테스트코드
  it('should find all users', async () => {
    const page = 1;
    const size = 2; // 페이지당 사이즈를 2로 설정
    const result = await userService.findAll(page, size);

    // 페이지당 사이즈에 맞게 결과를 받아오는지 확인
    expect(result).toHaveLength(size);

    // 예상되는 첫 번째 유저를 가져오는지 확인
    expect(result[0]).toEqual({
      id: '1',
      email: 'user1@example.com',
      name: 'User 1',
    });
  });
});
