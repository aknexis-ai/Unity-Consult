import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  Admin = "admin",
  Client = "client",
  Staff = "staff",
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email!: string;

  @Prop({ type: String, trim: true, default: null })
  phone?: string | null;

  @Prop({ type: String, trim: true, default: null })
  company?: string | null;

  @Prop({ type: String, trim: true, default: null })
  title?: string | null;

  @Prop({ type: String, trim: true, default: null })
  avatarUrl?: string | null;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ enum: UserRole, default: UserRole.Client })
  role!: UserRole;

  @Prop({ type: String, default: null })
  hashedRefreshToken?: string | null;

  @Prop({ default: false })
  emailVerified!: boolean;

  @Prop({ type: String, default: null })
  emailVerificationOtpHash?: string | null;

  @Prop({ type: Date, default: null })
  emailVerificationOtpExpiresAt?: Date | null;

  @Prop({ type: String, default: null })
  passwordResetTokenHash?: string | null;

  @Prop({ type: Date, default: null })
  passwordResetTokenExpiresAt?: Date | null;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date | null;

  createdAt!: Date;

  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
