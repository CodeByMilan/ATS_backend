import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENUM_APP_ENVIRONMENT } from './common/constant/app.constant';

//note the type of the app should be same as the type of the app in the main.ts file
export default async function swaggerInitFunction(app: NestExpressApplication) {
  const configService = app.get(ConfigService);
  const env: string = configService.get<string>(
    'APP_ENVIRONMENT',
    ENUM_APP_ENVIRONMENT.DEVELOPMENT,
  );

  if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
    // for admin
    const adminDocumentBuild = new DocumentBuilder()
      .setTitle('ATS Admin API')
      .setDescription('Rest APIs for ATS  admin')
      .setVersion('1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .build();

    const adminDocument = SwaggerModule.createDocument(
      app,
      adminDocumentBuild,
      {
        deepScanRoutes: true,
      },
    );

    SwaggerModule.setup('/ats/admin-docs', app, adminDocument, {
      explorer: true,
      customSiteTitle: 'ATS Admin Docs',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
    });
    // for user
    const userDocumentBuild = new DocumentBuilder()
      .setTitle('ATS User API')
      .setDescription('APIs for ATS User')
      .setVersion('1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .build();

    const userDocument = SwaggerModule.createDocument(app, userDocumentBuild, {
      deepScanRoutes: true,
    });

    SwaggerModule.setup('ats/user-docs', app, userDocument, {
      explorer: true,
      customSiteTitle: 'ATS user',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
    });
  }
}
