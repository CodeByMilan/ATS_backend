import { Global, Module } from '@nestjs/common';
import { RedisModule } from 'src/common/redis/redis.module';
import { AuthHelperService } from './services/authHelperService';
import { AuthSessionHelperService } from './services/authSessionHelperService';
import { HelperNumberService } from './services/numberHelperService';

@Global()
@Module({
  imports: [RedisModule],
  providers: [HelperNumberService, AuthSessionHelperService, AuthHelperService],
  exports: [AuthSessionHelperService, AuthHelperService],
})
export class HelperModule {}
