import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { DocumentsModule } from "../documents/documents.module";
import { ServiceCatalog, ServiceCatalogSchema } from "./schemas/service-catalog.schema";
import { ServicesController } from "./services.controller";
import { ServicesService } from "./services.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: ServiceCatalog.name, schema: ServiceCatalogSchema }]), DocumentsModule],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService, MongooseModule],
})
export class ServicesModule {}
