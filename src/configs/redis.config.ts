import { registerAs } from '@nestjs/config';
import { IRedisConfig } from './config-interface';

export default registerAs('redis', (): IRedisConfig => {
  return {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  };
});
