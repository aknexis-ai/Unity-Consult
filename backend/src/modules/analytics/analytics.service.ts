import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { DocumentRecord, DocumentRecordDocument } from "../documents/schemas/document.schema";
import { Invoice, InvoiceDocument, InvoiceStatus } from "../invoices/schemas/invoice.schema";
import { Lead, LeadDocument } from "../leads/schemas/lead.schema";
import { Order, OrderDocument } from "../orders/schemas/order.schema";
import { Payment, PaymentDocument, PaymentStatus } from "../payments/schemas/payment.schema";
import { Project, ProjectDocument } from "../projects/schemas/project.schema";
import { Ticket, TicketDocument, TicketStatus } from "../tickets/schemas/ticket.schema";

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<LeadDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(DocumentRecord.name) private readonly documentModel: Model<DocumentRecordDocument>,
    @InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>,
  ) {}

  async getAdminMetrics() {
    const [leadCount, openTicketCount, totalRevenueAgg, capturedPayments, activeProjects] = await Promise.all([
      this.leadModel.countDocuments().exec(),
      this.ticketModel.countDocuments({ status: { $ne: TicketStatus.Resolved } }).exec(),
      this.invoiceModel.aggregate<{ total: number }>([{ $group: { _id: null, total: { $sum: "$amountPaid" } } }]).exec(),
      this.paymentModel.countDocuments({ status: PaymentStatus.Captured }).exec(),
      this.projectModel.countDocuments({ status: { $nin: ["completed", "archived"] } }).exec(),
    ]);

    return [
      { label: "Active leads", value: String(leadCount), detail: "Captured through live CRM endpoints" },
      { label: "Open tickets", value: String(openTicketCount), detail: "Unresolved support queue items" },
      { label: "Revenue", value: `₹${Math.round(totalRevenueAgg[0]?.total ?? 0).toLocaleString("en-IN")}`, detail: `${capturedPayments} captured payments` },
      { label: "Projects", value: String(activeProjects), detail: "Active project delivery records" },
    ];
  }

  async getPortalMetrics() {
    const [projectCount, documentCount, outstandingInvoices, openTickets] = await Promise.all([
      this.projectModel.countDocuments().exec(),
      this.documentModel.countDocuments().exec(),
      this.invoiceModel.countDocuments({ status: { $ne: InvoiceStatus.Paid } }).exec(),
      this.ticketModel.countDocuments({ status: { $ne: TicketStatus.Resolved } }).exec(),
    ]);

    return [
      { label: "Projects", value: String(projectCount), detail: "Projects visible in the client portal" },
      { label: "Documents", value: String(documentCount), detail: "Files synced to the document hub" },
      { label: "Invoices", value: String(outstandingInvoices), detail: "Invoices needing client attention" },
      { label: "Support", value: String(openTickets), detail: "Open support threads" },
    ];
  }
}
