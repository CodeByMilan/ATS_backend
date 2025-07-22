import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('/')
export class AppController {
  constructor(private readonly configService: ConfigService) {}
  @Get('/')
  hello() {
    return {
      data: {
        instance: this.configService.get(
          'NODE_APP_INSTANCE',
          'Not in PM2 cluster mode',
        ),
        env: this.configService.get('APP_ENV', 'dev'),
      },
    };
  }
}
