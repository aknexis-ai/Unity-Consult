import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreatePaymentOrderDto {
  @IsString()
  invoiceId!: string;

  @IsNumber()
  @Min(1)
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  receipt?: string;
}
