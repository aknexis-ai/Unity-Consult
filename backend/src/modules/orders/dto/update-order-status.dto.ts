import { IsOptional, IsString } from "class-validator";

export class UpdateOrderStatusDto {
  @IsOptional()
  @IsString()
  stage?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  owner?: string;
}
