import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

// Postgres 환경변수 설정
export default registerAs('postgres', () => ({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5434,
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
}));
