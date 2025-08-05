import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/module/authentication/authentication.module';
import { AuthenticationUserController } from 'src/module/authentication/controllers/authentication.user.controller';

@Module({
  imports: [],
  controllers: [],
})
export class UserRouterModule {}
