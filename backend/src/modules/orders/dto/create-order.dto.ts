import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  clientId?: string;

  @IsString()
  clientName!: string;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsString()
  serviceName!: string;

  @IsOptional()
  @IsString()
  leadId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  stage?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
