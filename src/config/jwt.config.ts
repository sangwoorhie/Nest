import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
}));
