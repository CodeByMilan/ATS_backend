import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HelperModule } from '../helper/helper.module';
import { UserRepositoryModule } from '../user/repositories/user.repository.module';
import { AuthenticationUserController } from './controllers/authentication.user.controller';
import { AuthenticationUserService } from './services/authentication.user.service';

@Module({
  controllers: [AuthenticationUserController],
  providers: [AuthenticationUserService],
  imports: [HelperModule, UserRepositoryModule, JwtModule],
})
export class AuthenticationModule {}
