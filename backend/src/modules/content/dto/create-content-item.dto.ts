import { IsOptional, IsString } from "class-validator";

export class CreateContentItemDto {
  @IsString()
  title!: string;

  @IsString()
  type!: string;

  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  summary?: string;
}
