import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { Invoice, InvoiceDocument, InvoiceStatus } from "./schemas/invoice.schema";

@Injectable()
export class InvoicesService {
  constructor(@InjectModel(Invoice.name) private readonly invoiceModel: Model<InvoiceDocument>) {}

  create(input: CreateInvoiceDto) {
    return this.invoiceModel.create({
      ...input,
      clientEmail: input.clientEmail.toLowerCase(),
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    });
  }

  findAll() {
    return this.invoiceModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const invoice = await this.invoiceModel.findById(id).exec();

    if (!invoice) {
      throw new NotFoundException("Invoice not found.");
    }

    return invoice;
  }

  async markPaid(id: string, amountPaid: number) {
    const invoice = await this.invoiceModel.findById(id).exec();

    if (!invoice) {
      throw new NotFoundException("Invoice not found.");
    }

    invoice.amountPaid += amountPaid;
    invoice.status = invoice.amountPaid >= invoice.amount ? InvoiceStatus.Paid : InvoiceStatus.PartiallyPaid;
    invoice.paidAt = invoice.status === InvoiceStatus.Paid ? new Date() : invoice.paidAt;

    return invoice.save();
  }

  async attachPaymentReferences(id: string, providerOrderId: string, providerPaymentId?: string | null) {
    const invoice = await this.invoiceModel
      .findByIdAndUpdate(
        id,
        {
          providerOrderId,
          providerPaymentId: providerPaymentId ?? null,
        },
        { returnDocument: "after" },
      )
      .exec();

    if (!invoice) {
      throw new NotFoundException("Invoice not found.");
    }

    return invoice;
  }
}
