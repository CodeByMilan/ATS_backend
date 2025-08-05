import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from 'src/common/common.module';
import { AppRoutingModule } from 'src/module/router/router.module';

@Module({
  imports: [CommonModule, AppRoutingModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
