import { IsArray, IsDateString, IsEmail, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateProjectDto {
  @IsOptional()
  @IsString()
  orderId?: string;

  @IsString()
  name!: string;

  @IsString()
  clientName!: string;

  @IsEmail()
  clientEmail!: string;

  @IsString()
  serviceName!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  milestone?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  deliverables?: string[];

  @IsOptional()
  @IsArray()
  milestones?: string[];

  @IsOptional()
  @IsArray()
  files?: string[];
}
