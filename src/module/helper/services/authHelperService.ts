import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthSessionStatusEnum } from 'src/common/redis-om/authSession.schema';
import { AuthSessionHelperService } from './authSessionHelperService';

@Injectable()
export class AuthHelperService {
  constructor(
    private readonly authSessionHelperService: AuthSessionHelperService,
  ) {}
  async verifyOtp(email: string, otp: number, method: AuthSessionStatusEnum) {
    const sessionKey = await this.authSessionHelperService._generateKey(
      email
    );
    const findSession = await this.authSessionHelperService.findOne({
      email,
      sessionKey,
      method,
    });

    if (!findSession) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (findSession.otp === otp) {
      await this.authSessionHelperService.update(findSession, {
        isOtpVerified: true,
      });
      return true;
    }
    throw new BadRequestException('Invalid or expired OTP');
  }
}
