import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { USER_TYPE } from 'src/module/user/interface/user.interface';
import { RegisterDto } from '../dto/registerDto';
import { VerifyOtpDto } from '../dto/verifyDto';
import { AuthenticationUserService } from '../services/authentication.user.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthenticationUserController {
  constructor(
    private readonly authenticationUserService: AuthenticationUserService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const existingUser: boolean =
      await this.authenticationUserService.checkUserExistOrNot(
        registerDto.email,
      );
    if (existingUser) {
      throw new HttpException('user already exist', HttpStatus.CONFLICT);
    }
    const newUser = await this.authenticationUserService.register({
      ...registerDto,
      type: USER_TYPE.USER,
    } as RegisterDto);
    return newUser;
  }

  async verifyOtp(@Body() data: VerifyOtpDto) {
    const accessToken =
      await this.authenticationUserService.verifyUserOtp(data);
    return { data: accessToken };
  }
}
