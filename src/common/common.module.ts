import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configs from 'src/configs/index';
import { DatabaseModule } from 'src/database/database.module';
import * as Joi from 'joi';
import { ENUM_APP_ENVIRONMENT } from './constant/app.constant';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        APP_ENV: Joi.string()
          .valid(...Object.values(ENUM_APP_ENVIRONMENT))
          .default(ENUM_APP_ENVIRONMENT.DEVELOPMENT)
          .required(),
        DATABASE_TYPE: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    DatabaseModule,
  ],
})
export class CommonModule {}
