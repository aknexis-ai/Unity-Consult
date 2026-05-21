import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateServiceCatalogDto {
  @IsString()
  slug!: string;

  @IsString()
  name!: string;

  @IsString()
  category!: string;

  @IsString()
  short!: string;

  @IsString()
  description!: string;

  @IsString()
  priceFrom!: string;

  @IsString()
  delivery!: string;

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
