import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsPassword } from '../../../config/validators/password.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsPassword)
  password: string;
}
