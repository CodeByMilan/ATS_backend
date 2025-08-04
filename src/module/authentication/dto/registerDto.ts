import { IsEmail, IsOptional, IsString } from 'class-validator';
import { USER_TYPE } from 'src/module/user/interface/user.interface';

export class RegisterDto {
  @IsEmail()
  @IsString()
  email: string;
  
  @IsString()
  password: string;

  @IsOptional()
  type?: USER_TYPE;
}
