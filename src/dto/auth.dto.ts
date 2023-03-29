import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength:6,
    minLowercase:0,
    minNumbers:0,
    minSymbols:0,
    minUppercase:0
  })
  password: string;
}

export class SigninDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword({
    minLength:6,
    minLowercase:0,
    minNumbers:0,
    minSymbols:0,
    minUppercase:0
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

