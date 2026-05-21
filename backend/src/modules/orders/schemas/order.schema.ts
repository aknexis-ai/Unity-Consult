import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Order {
  @Prop({ type: String, trim: true, default: null })
  clientId?: string | null;

  @Prop({ required: true, trim: true })
  clientName!: string;

  @Prop({ type: String, trim: true, default: null })
  serviceId?: string | null;

  @Prop({ required: true, trim: true })
  serviceName!: string;

  @Prop({ type: String, trim: true, default: null })
  leadId?: string | null;

  @Prop({ type: Number, min: 0, default: 0 })
  amount!: number;

  @Prop({ trim: true, default: "INR" })
  currency!: string;

  @Prop({ trim: true, default: "discovery" })
  stage!: string;

  @Prop({ type: String, trim: true, default: null })
  owner?: string | null;

  @Prop({ trim: true, default: "active" })
  status!: string;

  @Prop({ type: String, trim: true, default: "pending" })
  paymentStatus!: string;

  @Prop({ type: String, trim: true, default: null })
  notes?: string | null;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
