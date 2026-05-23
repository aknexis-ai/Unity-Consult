import { IsEnum, IsOptional, IsString } from "class-validator";

import { OrderLifecycleStatus } from "../schemas/order.schema";

export class UpdateOrderStatusDto {
  @IsOptional()
  @IsString()
  stage?: string;

  @IsOptional()
  @IsEnum(OrderLifecycleStatus)
  status?: OrderLifecycleStatus;

  @IsOptional()
  @IsString()
  owner?: string;
}
