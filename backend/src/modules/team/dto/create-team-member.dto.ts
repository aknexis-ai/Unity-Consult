import { IsArray, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateTeamMemberDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  role!: string;

  @IsString()
  focus!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  permissions?: string[];
}
