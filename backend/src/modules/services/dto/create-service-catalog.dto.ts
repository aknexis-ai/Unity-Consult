import { IsArray, IsObject, IsOptional, IsString } from "class-validator";

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

  @IsOptional()
  @IsString()
  accent?: string;

  @IsOptional()
  @IsString()
  proofMetric?: string;

  @IsOptional()
  @IsString()
  proofLabel?: string;

  @IsOptional()
  @IsArray()
  pricingTiers?: Array<Record<string, unknown>>;

  @IsOptional()
  @IsArray()
  addons?: Array<Record<string, unknown>>;

  @IsOptional()
  @IsArray()
  deliverables?: string[];

  @IsOptional()
  @IsArray()
  faqs?: Array<Record<string, unknown>>;

  @IsOptional()
  @IsArray()
  intakeSchema?: Array<Record<string, unknown>>;

  @IsOptional()
  @IsObject()
  media?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  seo?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  heroImageData?: string;

  @IsOptional()
  @IsString()
  heroImageMimeType?: string;

  @IsOptional()
  @IsString()
  heroImageName?: string;

  @IsOptional()
  @IsString()
  cardImageData?: string;

  @IsOptional()
  @IsString()
  cardImageMimeType?: string;

  @IsOptional()
  @IsString()
  cardImageName?: string;
}
