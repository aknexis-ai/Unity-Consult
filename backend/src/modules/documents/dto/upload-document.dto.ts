import { IsEnum, IsOptional, IsString, Matches, MaxLength } from "class-validator";

import { DocumentCategory } from "../schemas/document.schema";

export class UploadDocumentDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsString()
  @MaxLength(160)
  ownerName!: string;

  @IsOptional()
  @IsEnum(DocumentCategory)
  category?: DocumentCategory;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsString()
  @MaxLength(120)
  mimeType!: string;

  @IsString()
  @Matches(/^[A-Za-z0-9+/=]+$/)
  data!: string;
}
