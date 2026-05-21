import { IsEmail, IsNumber, IsObject, IsOptional, IsString, Min } from "class-validator";

export class CreateBookingDto {
  @IsString()
  companyName!: string;

  @IsEmail()
  contactEmail!: string;

  @IsString()
  contactPhone!: string;

  @IsString()
  serviceSlug!: string;

  @IsString()
  serviceName!: string;

  @IsString()
  priceLabel!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsString()
  projectBrief!: string;

  @IsString()
  deliveryNotes!: string;

  @IsOptional()
  @IsObject()
  requestedFields?: Record<string, string>;
}
