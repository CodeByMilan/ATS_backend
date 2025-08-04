import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthSessionStatusEnum } from 'src/common/redis-om/authSession.schema';
import { UserRepository } from 'src/module/user/repositories/user.repository';
import { RegisterDto } from '../dto/registerDto';
import { VerifyOtpDto } from '../dto/verifyDto';
import { IEmail } from '../interfaces/emailInterface';
import { UserEntity } from 'src/module/user/entities/user.entity';
import { AuthHelperService } from 'src/module/helper/services/authHelperService';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthToken } from '../interfaces/authToken';

@Injectable()
export class AuthenticationUserService {
  private readonly accessTokenSecretKey: string;
  private readonly accessTokenExpirationTime: number;
  private readonly accessTokenNotBeforeExpirationTime: number;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly authHelperService: AuthHelperService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecretKey = this.configService.get<string>(
      'auth.accessToken.secretKey',
      '',
    );
    this.accessTokenExpirationTime = this.configService.get<number>(
      'auth.accessToken.expirationTime',
      0,
    );
    this.accessTokenNotBeforeExpirationTime = this.configService.get<number>(
      'auth.accessToken.notBeforeExpirationTime',
      0,
    );
  }
  async register(registerDto: RegisterDto) {
    try {
      let method: AuthSessionStatusEnum = AuthSessionStatusEnum.REGISTER;

      const user = await this.userRepository._create(registerDto);
      await this.sendOtpVerificationEmail({ email: registerDto.email, method });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async checkUserExistOrNot(email: string): Promise<boolean> {
    const user = await this.userRepository._findOne({
      options: {
        where: {
          email: email,
        },
      },
    });
    if (user) {
      return true;
    }
    return false;
  }

  /*
  function simply verifies the otp send to the user in the registered email before that checks if the user exists or not
  */
  async verifyUserOtp(data: VerifyOtpDto) {
    let method: AuthSessionStatusEnum = AuthSessionStatusEnum.REGISTER;

    const user: UserEntity = await this._findUser(data.email);

    if (user) {
      await this._validateUser(user);
      method = await this._checkMethodType(user);
    }

    await this.authHelperService.verifyOtp(data.email, data.otp, method);

    if (method === AuthSessionStatusEnum.LOGIN) {
      return await this.getToken(user);
    }

    await this._emailVerified(user);

    return 'Otp Verified Success';
  }

  //function simply checks if user exist or not by email and if exist return user else throws error
  async _findUser(email: string) {
    const user = await this.userRepository._findOne({
      options: {
        where: {
          email: email,
        },
      },
    });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  //function simply checks if user is active or not
  async _validateUser(user: UserEntity) {
    if (user.blockedAt) {
      throw new HttpException('User Blocked', HttpStatus.FORBIDDEN);
    }
    if (!user.isActive) {
      throw new HttpException('User Not Active', HttpStatus.FORBIDDEN);
    }
  }
  private async _checkMethodType(user: UserEntity) {
    const { password, emailVerifiedAt, passwordSetAt } = user;
    if (password && emailVerifiedAt && passwordSetAt) {
      return AuthSessionStatusEnum.LOGIN;
    } else {
      return AuthSessionStatusEnum.REGISTER;
    }
  }

  async getToken(user: UserEntity): Promise<AuthToken> {
    if (!user.isActive) {
      throw new BadRequestException('User is inactive');
    }

    const accessToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.accessTokenSecretKey,
        expiresIn: this.accessTokenExpirationTime,
        notBefore: this.accessTokenNotBeforeExpirationTime,
      },
    );
    return {
      accessToken,
      expiresInSeconds: this.accessTokenExpirationTime,
    };
  }

  private async _emailVerified(user: UserEntity) {
    user.emailVerifiedAt = new Date();
    return await this.userRepository._update(user);
  }
  //TODO
  sendOtpVerificationEmail(sendMail: IEmail) {}
}
