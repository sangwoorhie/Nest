import { registerAs } from '@nestjs/config';

// SWAGGER 기본 보안 적용
export default registerAs('swagger', async () => {
  return {
    user: process.env.SWAGGER_USER,
    password: process.env.SWAGGER_PASSWORD,
  };
});
