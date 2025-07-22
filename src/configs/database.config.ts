import { registerAs } from '@nestjs/config';
import { IDatabaseConfig } from './config-interface';

export default registerAs('database', (): IDatabaseConfig => {
  return {
    type: process.env.DATABASE_TYPE as IDatabaseConfig['type'],
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE == 'true',
  };
});
