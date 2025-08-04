import { Module } from '@nestjs/common';
import { AuthenticationUserController } from './controllers/authentication.user.controller';
import { AuthenticationUserService } from './services/authentication.user.service';
import { HelperModule } from '../helper/helper.module';

@Module({
  controllers: [AuthenticationUserController],
  providers: [AuthenticationUserService],
  imports:[HelperModule]
})
export class AuthenticationModule {}
