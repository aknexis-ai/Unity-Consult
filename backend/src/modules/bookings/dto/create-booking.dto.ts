import { IsEmail, IsIn, IsNumber, IsObject, IsOptional, IsString, Min } from "class-validator";

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

  @IsOptional()
  @IsIn(["full_payment", "advance_payment", "milestone_billing", "recurring_billing"])
  paymentMode?: "full_payment" | "advance_payment" | "milestone_billing" | "recurring_billing";

  @IsString()
  projectBrief!: string;

  @IsString()
  deliveryNotes!: string;

  @IsOptional()
  @IsObject()
  requestedFields?: Record<string, string>;
}
