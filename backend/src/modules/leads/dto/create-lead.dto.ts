import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from "class-validator";

import { LeadStage } from "../schemas/lead.schema";

export class CreateLeadDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsString()
  service!: string;

  @IsOptional()
  @IsEnum(LeadStage)
  stage?: LeadStage;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  budget?: string;
}
