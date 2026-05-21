import { IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

import { InvoiceStatus } from "../schemas/invoice.schema";

export class CreateInvoiceDto {
  @IsOptional()
  @IsString()
  orderId?: string;

  @IsString()
  invoiceNumber!: string;

  @IsString()
  clientName!: string;

  @IsEmail()
  clientEmail!: string;

  @IsString()
  serviceName!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPaid?: number;

  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
