import { IsBoolean, IsIn, IsOptional } from "class-validator";

export class UpdateMySettingsDto {
  @IsOptional()
  @IsBoolean()
  notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  billingAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  weeklyDigest?: boolean;

  @IsOptional()
  @IsIn(["en-IN", "en-US"])
  locale?: string;

  @IsOptional()
  @IsIn(["Asia/Kolkata", "UTC"])
  timezone?: string;
}
