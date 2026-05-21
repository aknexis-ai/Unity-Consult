import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { InvoicesModule } from "../invoices/invoices.module";
import { AuditModule } from "../audit/audit.module";
import { RealtimeModule } from "../realtime/realtime.module";
import { Payment, PaymentSchema } from "./schemas/payment.schema";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    AuditModule,
    InvoicesModule,
    RealtimeModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService, MongooseModule],
})
export class PaymentsModule {}
