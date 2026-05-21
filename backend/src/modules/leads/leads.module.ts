import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { RealtimeModule } from "../realtime/realtime.module";
import { Lead, LeadSchema } from "./schemas/lead.schema";
import { LeadsController } from "./leads.controller";
import { LeadsService } from "./leads.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]), RealtimeModule],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [MongooseModule, LeadsService],
})
export class LeadsModule {}
