import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Invoice, InvoiceDocument, InvoiceStatus } from "../invoices/schemas/invoice.schema";
import { Lead, LeadDocument, LeadStage } from "../leads/schemas/lead.schema";
import { Order, OrderDocument } from "../orders/schemas/order.schema";
import { Project, ProjectDocument } from "../projects/schemas/project.schema";
import { RealtimeGateway } from "../realtime/realtime.gateway";
import { CreateBookingDto } from "./dto/create-booking.dto";

function buildInvoiceNumber() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(10000 + Math.random() * 90000);

  return `UC-${year}-${suffix}`;
}

function buildDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<LeadDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<InvoiceDocument>,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async create(input: CreateBookingDto) {
    const email = input.contactEmail.toLowerCase();
    const amount = input.amount ?? 0;
    const intakeSummary = JSON.stringify({
      price: input.priceLabel,
      deliveryNotes: input.deliveryNotes,
      requestedFields: input.requestedFields ?? {},
    });

    const lead = await this.leadModel.create({
      name: input.companyName,
      email,
      phone: input.contactPhone,
      company: input.companyName,
      service: input.serviceName,
      stage: LeadStage.Proposal,
      source: "Booking wizard",
      budget: input.priceLabel,
    });

    const order = await this.orderModel.create({
      clientName: input.companyName,
      serviceId: input.serviceSlug,
      serviceName: input.serviceName,
      leadId: lead.id,
      amount,
      currency: "INR",
      stage: "pending_payment",
      status: "pending_payment",
      paymentStatus: "pending",
      notes: `${input.projectBrief}\n\n${intakeSummary}`,
    });

    const project = await this.projectModel.create({
      orderId: order.id,
      name: `${input.serviceName} for ${input.companyName}`,
      clientName: input.companyName,
      clientEmail: email,
      serviceName: input.serviceName,
      status: "pending_payment",
      milestone: "Payment pending",
      progress: 0,
      dueDate: null,
      deliverables: [],
      milestones: ["Booking submitted", "Invoice generated", "Payment pending"],
      files: [],
    });

    const invoice = await this.invoiceModel.create({
      orderId: order.id,
      invoiceNumber: buildInvoiceNumber(),
      clientName: input.companyName,
      clientEmail: email,
      serviceName: input.serviceName,
      amount,
      amountPaid: 0,
      status: InvoiceStatus.Draft,
      dueDate: buildDueDate(),
    });

    this.realtimeGateway.emitLeadStageChanged({
      id: lead.id,
      stage: lead.stage,
      service: lead.service,
    });
    this.realtimeGateway.emitOrderUpdated({
      id: order.id,
      status: order.status,
      stage: order.stage,
      invoiceId: invoice.id,
      projectId: project.id,
    });

    return {
      lead,
      order,
      project,
      invoice,
      nextAction: "payment",
    };
  }
}
