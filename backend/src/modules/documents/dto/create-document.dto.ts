import { IsEnum, IsOptional, IsString, IsUrl } from "class-validator";

import { DocumentCategory } from "../schemas/document.schema";

export class CreateDocumentDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsEnum(DocumentCategory)
  category?: DocumentCategory;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsUrl({
    require_tld: false,
  })
  fileUrl!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  ownerName!: string;
}
