import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PaymentDocument = HydratedDocument<Payment>;

export enum PaymentStatus {
  Created = "created",
  Captured = "captured",
  Failed = "failed",
  Refunded = "refunded",
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Payment {
  @Prop({ required: true, trim: true })
  invoiceId!: string;

  @Prop({ required: true, trim: true })
  provider!: string;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true, trim: true })
  currency!: string;

  @Prop({ required: true, trim: true })
  orderId!: string;

  @Prop({ type: String, trim: true, default: null })
  providerPaymentId?: string | null;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.Created })
  status!: PaymentStatus;

  @Prop({ type: String, trim: true, default: null })
  receipt?: string | null;

  @Prop({ type: String, trim: true, default: null })
  failureReason?: string | null;

  @Prop({ type: String, trim: true, default: null })
  refundId?: string | null;

  @Prop({ type: String, trim: true, default: null })
  refundReason?: string | null;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
