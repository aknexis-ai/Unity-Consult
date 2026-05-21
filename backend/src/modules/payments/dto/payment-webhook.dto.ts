import { IsObject, IsOptional, IsString } from "class-validator";

export class PaymentWebhookDto {
  @IsString()
  event!: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
