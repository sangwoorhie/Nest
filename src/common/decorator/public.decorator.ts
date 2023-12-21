import { SetMetadata } from '@nestjs/common';

// 메타데이터로 인증 없이 접근할 수 있는 엔드포인트 지정
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
