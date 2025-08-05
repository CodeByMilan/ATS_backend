import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  return {
    app_env: process.env.APP_ENV,
  };
});
