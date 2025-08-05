import { faker } from '@faker-js/faker/.';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { USER_TYPE } from 'src/module/user/interface/user.interface';

export class RegisterDto {
  @ApiProperty({
    required: true,
    example: 'admin@gmail.com',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    example: 'helloWorld',
  })
  @IsString()
  password: string;

  @IsOptional()
  type?: USER_TYPE;
}
