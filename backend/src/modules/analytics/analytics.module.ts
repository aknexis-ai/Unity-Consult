import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";
import { DocumentRecord, DocumentRecordSchema } from "../documents/schemas/document.schema";
import { Invoice, InvoiceSchema } from "../invoices/schemas/invoice.schema";
import { Lead, LeadSchema } from "../leads/schemas/lead.schema";
import { Order, OrderSchema } from "../orders/schemas/order.schema";
import { Payment, PaymentSchema } from "../payments/schemas/payment.schema";
import { Project, ProjectSchema } from "../projects/schemas/project.schema";
import { Ticket, TicketSchema } from "../tickets/schemas/ticket.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: DocumentRecord.name, schema: DocumentRecordSchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
