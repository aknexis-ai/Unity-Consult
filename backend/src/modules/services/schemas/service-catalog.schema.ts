import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ServiceCatalogDocument = HydratedDocument<ServiceCatalog>;

@Schema({ timestamps: true, versionKey: false })
export class ServiceCatalog {
  @Prop({ required: true, unique: true, trim: true })
  slug!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  category!: string;

  @Prop({ required: true, trim: true })
  short!: string;

  @Prop({ required: true, trim: true })
  description!: string;

  @Prop({ required: true, trim: true })
  priceFrom!: string;

  @Prop({ required: true, trim: true })
  delivery!: string;

  @Prop({ type: [String], default: [] })
  outcomes!: string[];

  @Prop({ type: [String], default: [] })
  workflow!: string[];

  @Prop({ type: [String], default: [] })
  bookingFields!: string[];

  @Prop({ type: [String], default: [] })
  related!: string[];

  @Prop({ trim: true, default: "active" })
  status!: string;

  @Prop({ type: String, trim: true, default: null })
  accent?: string | null;

  @Prop({ type: String, trim: true, default: null })
  proofMetric?: string | null;

  @Prop({ type: String, trim: true, default: null })
  proofLabel?: string | null;

  @Prop({ type: [Object], default: [] })
  pricingTiers!: Array<Record<string, unknown>>;

  @Prop({ type: [Object], default: [] })
  addons!: Array<Record<string, unknown>>;

  @Prop({ type: [String], default: [] })
  deliverables!: string[];

  @Prop({ type: [Object], default: [] })
  faqs!: Array<Record<string, unknown>>;

  @Prop({ type: [Object], default: [] })
  intakeSchema!: Array<Record<string, unknown>>;

  @Prop({ type: Object, default: {} })
  media!: Record<string, unknown>;

  @Prop({ type: Object, default: {} })
  seo!: Record<string, unknown>;
}

export const ServiceCatalogSchema = SchemaFactory.createForClass(ServiceCatalog);
