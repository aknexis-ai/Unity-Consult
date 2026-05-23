import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { DocumentsModule } from "../documents/documents.module";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";
import { ContentItem, ContentItemSchema } from "./schemas/content-item.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: ContentItem.name, schema: ContentItemSchema }]), DocumentsModule],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService, MongooseModule],
})
export class ContentModule {}
