import { registerAs } from '@nestjs/config';
import { seconds } from 'src/module/helper/constants/helper.function.constant';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    accessToken: {
      secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY,
      expirationTime: seconds(
        process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED || '14d',
      ),
      //these are optional as these are used only for the extra layer of security while using jwt
      notBeforeExpirationTime: seconds('0'),
      encryptKey: process.env.AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY,
      encryptIv: process.env.AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV,
    },
  }),
);
