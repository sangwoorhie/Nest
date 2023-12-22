import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

// Brutal Force 공격 예방하기 위한 프록시가드
// API 엔드포인트에 대한 요청을 추적하고 클라이언트 IP 주소를 기반으로 요청 제한을 적용
@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.ips.length ? req.ips[0] : req.ip;
  }
}
