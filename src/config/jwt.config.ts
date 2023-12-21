import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

// JWT SECRET키 환경변수 설정
export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
}));
