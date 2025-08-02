import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

import swaggerInitFunction from './swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  /*INestApplication is a generic type that can be used to create a Nest application but we are using NestExpressApplication
  which is a specific implementation of INestApplication that uses Express.js as the underlying web framework.
  */
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  //Initializing  the Swagger
  swaggerInitFunction(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
