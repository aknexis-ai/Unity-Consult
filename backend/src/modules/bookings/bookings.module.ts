import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Invoice, InvoiceSchema } from "../invoices/schemas/invoice.schema";
import { Lead, LeadSchema } from "../leads/schemas/lead.schema";
import { Order, OrderSchema } from "../orders/schemas/order.schema";
import { Project, ProjectSchema } from "../projects/schemas/project.schema";
import { RealtimeModule } from "../realtime/realtime.module";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Invoice.name, schema: InvoiceSchema },
    ]),
    RealtimeModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
