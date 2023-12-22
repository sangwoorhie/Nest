import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/common/decorator/public.decorator';

// Health check,  '/health' 엔드포인트로 요청이 들어올 때 TypeORM 데이터베이스의 건강 상태를 확인하여 반환
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private database: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @Public()
  check() {
    return this.health.check([() => this.database.pingCheck('database')]);
  }
}
