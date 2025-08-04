import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 123456 })
  @IsNumber()
  otp: number;

  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  @IsEmail()
  email: string;
}
