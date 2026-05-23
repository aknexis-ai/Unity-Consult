import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(5)
  phone!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  // role is restricted from public registration — admins set roles via the admin panel
}
