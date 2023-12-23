import { EventBus } from '@nestjs/cqrs';
import { Video } from '../entities/video.entity';
import { CreateVideoHandler } from './create-video.handler';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { User } from 'src/routes/user/entities/user.entity';
import { CreateVideoCommand } from '../command/create-video.command';

// 테스트코드 npm run test
class QueryRunner {
  manager: Manager;
  constructor(manager: Manager) {
    this.manager = manager;
  }
  async startTransaction() {
    return;
  }
  async commitTransaction() {
    return;
  }
  async rollbackTransaction() {
    return;
  }
  async release() {
    return;
  }
}

// Manager: 쿼리러너의 필드중 하나로써, DB와의 상호 작용을 시뮬레이션하고 CreateVideoHandler 유닛 테스트를 위한 환경을 설정하는 역할
class Manager {
  async findOneBy(user: User, where: { id: string }) {
    return;
  }
  async create(
    video: Video,
    options: { title: string; mimetype: string; user: User },
  ) {
    return video;
  }
  async save(video: Video) {
    return video;
  }
}

// Jest를 활용, CreateVideoHandler 모듈 유닛테스트
describe('CreateVideoHandler', () => {
  let createVideoHandler: CreateVideoHandler;
  let eventBus: jest.Mocked<EventBus>; // createEvenBus에서 사용하는 eventBus를 Mock객체로 활용

  const videoId = '3c947f7c-b67a-4890-bd7c-e84a712492d0';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      // CreateVideoHandler가 의존하는 의존성 DataSource, EventBus를 useValue를 활용하여 의존성 주입
      providers: [
        CreateVideoHandler,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest
              .fn()
              .mockReturnValue(new QueryRunner(new Manager())), // Mocking할 수 있도록 위에서 임시로 선언한 클래스
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(), // publish함수 mocking.
          },
        },
      ],
    }).compile();

    // 해당 모듈 컴파일 후, CreateVideoHandler와 EventBus를 조회함
    (createVideoHandler = module.get(CreateVideoHandler)),
      (eventBus = module.get(EventBus));
  });

  // execute에 대한 테스트코드
  describe('execute', () => {
    it('should execute CreateVideoHandler', async () => {
      // Given 어떤 조건이 주어지고

      // When 로직을 전개했을 때
      await createVideoHandler.execute(
        new CreateVideoCommand(
          videoId,
          'test',
          'video/mp4',
          'mp4',
          Buffer.from(''),
        ),
      );

      // then 결과로 어떤 테스트를 하게되는지
      expect(eventBus.publish).toHaveBeenCalledTimes(1); // EventBus가 실제로 한번 호출했는지에 대해서 확인함.
    });
  });
});
