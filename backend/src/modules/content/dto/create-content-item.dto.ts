import { IsOptional, IsString } from "class-validator";

export class CreateContentItemDto {
  @IsString()
  title!: string;

  @IsString()
  type!: string;

  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  imageId?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  imageData?: string;

  @IsOptional()
  @IsString()
  imageMimeType?: string;

  @IsOptional()
  @IsString()
  imageName?: string;
}
