import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateServiceCatalogDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  short?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  priceFrom?: string;

  @IsOptional()
  @IsString()
  delivery?: string;

  @IsOptional()
  @IsArray()
  outcomes?: string[];

  @IsOptional()
  @IsArray()
  workflow?: string[];

  @IsOptional()
  @IsArray()
  bookingFields?: string[];

  @IsOptional()
  @IsArray()
  related?: string[];

  @IsOptional()
  @IsString()
  status?: string;
}
