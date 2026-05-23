import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Invoice, InvoiceDocument, InvoiceStatus } from "../invoices/schemas/invoice.schema";
import { Lead, LeadDocument, LeadStage } from "../leads/schemas/lead.schema";
import { Order, OrderDocument } from "../orders/schemas/order.schema";
import { OrderLifecycleStatus } from "../orders/schemas/order.schema";
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

function buildDueDateOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function buildPaymentMilestones(amount: number, mode = "advance_payment") {
  if (mode === "full_payment") {
    return [{ milestone_number: 1, description: "Full project payment", amount, due_date: buildDueDateOffset(7), status: "pending", paid_at: null }];
  }

  if (mode === "milestone_billing") {
    const oneThird = Math.round(amount / 3);
    return [
      { milestone_number: 1, description: "Discovery and architecture", amount: oneThird, due_date: buildDueDateOffset(7), status: "pending", paid_at: null },
      { milestone_number: 2, description: "Build and implementation", amount: oneThird, due_date: buildDueDateOffset(21), status: "pending", paid_at: null },
      { milestone_number: 3, description: "Review, launch, and handover", amount: Math.max(amount - oneThird * 2, 0), due_date: buildDueDateOffset(35), status: "pending", paid_at: null },
    ];
  }

  if (mode === "recurring_billing") {
    return [{ milestone_number: 1, description: "First billing cycle", amount, due_date: buildDueDateOffset(7), status: "pending", paid_at: null }];
  }

  const advance = Math.round(amount * 0.5);
  return [
    { milestone_number: 1, description: "Advance payment", amount: advance, due_date: buildDueDateOffset(7), status: "pending", paid_at: null },
    { milestone_number: 2, description: "Balance payment", amount: Math.max(amount - advance, 0), due_date: buildDueDateOffset(30), status: "pending", paid_at: null },
  ];
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
    const paymentMode = input.paymentMode ?? "advance_payment";
    const paymentMilestones = buildPaymentMilestones(amount, paymentMode);
    const intakeSummary = JSON.stringify({
      price: input.priceLabel,
      paymentMode,
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
      budgetRange: input.priceLabel,
      inquiryType: "Booking request",
      serviceInterest: input.serviceName,
      message: input.projectBrief,
    });

    const order = await this.orderModel.create({
      clientName: input.companyName,
      serviceId: input.serviceSlug,
      serviceName: input.serviceName,
      leadId: lead.id,
      amount,
      currency: "INR",
      stage: OrderLifecycleStatus.Inquiry,
      status: OrderLifecycleStatus.Inquiry,
      paymentStatus: "pending",
      paymentMode,
      paymentMilestones,
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

    const invoices = await Promise.all(
      paymentMilestones.map((milestone) =>
        this.invoiceModel.create({
          orderId: order.id,
          invoiceNumber: buildInvoiceNumber(),
          clientName: input.companyName,
          clientEmail: email,
          serviceName: `${input.serviceName} - ${milestone.description}`,
          amount: milestone.amount,
          amountPaid: 0,
          status: InvoiceStatus.Draft,
          dueDate: milestone.due_date ?? buildDueDate(),
        }),
      ),
    );
    const invoice = invoices[0];

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
      invoices,
      nextAction: "payment",
    };
  }
}
