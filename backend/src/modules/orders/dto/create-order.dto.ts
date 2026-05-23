import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

import { OrderLifecycleStatus } from "../schemas/order.schema";

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
  @IsEnum(OrderLifecycleStatus)
  status?: OrderLifecycleStatus;

  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
