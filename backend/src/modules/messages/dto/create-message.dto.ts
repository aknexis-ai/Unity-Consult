import { IsOptional, IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  fromName!: string;

  @IsOptional()
  @IsString()
  toName?: string;

  @IsOptional()
  @IsString()
  toUserId?: string;

  @IsString()
  role!: string;

  @IsOptional()
  @IsString()
  channel?: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  projectId?: string;
}
