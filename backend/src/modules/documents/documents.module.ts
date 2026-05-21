import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";
import { DocumentRecord, DocumentRecordSchema } from "./schemas/document.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: DocumentRecord.name, schema: DocumentRecordSchema }])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService, MongooseModule],
})
export class DocumentsModule {}
