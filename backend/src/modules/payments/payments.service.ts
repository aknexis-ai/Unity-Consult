import crypto from "crypto";
import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import Razorpay from "razorpay";

import { appConfig } from "../../config/app.config";
import { AuditService } from "../audit/audit.service";
import { InvoicesService } from "../invoices/invoices.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";
import { CreatePaymentOrderDto } from "./dto/create-payment-order.dto";
import { PaymentWebhookDto } from "./dto/payment-webhook.dto";
import { RefundPaymentDto } from "./dto/refund-payment.dto";
import { VerifyPaymentDto } from "./dto/verify-payment.dto";
import { Payment, PaymentDocument, PaymentStatus } from "./schemas/payment.schema";

@Injectable()
export class PaymentsService {
  private readonly razorpayClient: Razorpay | null;

  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    private readonly auditService: AuditService,
    private readonly invoicesService: InvoicesService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {
    this.razorpayClient =
      appConfig.razorpayKeyId && appConfig.razorpayKeySecret
        ? new Razorpay({
            key_id: appConfig.razorpayKeyId,
            key_secret: appConfig.razorpayKeySecret,
          })
        : null;
  }

  async createOrder(input: CreatePaymentOrderDto) {
    if (!this.razorpayClient) {
      throw new ServiceUnavailableException(
        "Razorpay keys are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env.",
      );
    }

    const invoice = await this.invoicesService.findOne(input.invoiceId);
    const currency = input.currency ?? "INR";
    const receipt = input.receipt ?? `receipt_${invoice.id}_${Date.now()}`;

    const providerOrder = await this.razorpayClient.orders.create({
      amount: Math.round(input.amount * 100),
      currency,
      receipt,
      notes: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
      },
    });

    const payment = await this.paymentModel.create({
      invoiceId: invoice.id,
      provider: "razorpay",
      amount: input.amount,
      currency,
      orderId: providerOrder.id,
      receipt,
      status: PaymentStatus.Created,
    });

    await this.invoicesService.attachPaymentReferences(invoice.id, providerOrder.id, null);

    this.realtimeGateway.emitPaymentUpdated({
      id: payment.id,
      status: payment.status,
      invoiceId: payment.invoiceId,
      amount: payment.amount,
    });

    return {
      payment,
      providerOrder,
      providerMode: "live",
    };
  }

  async verifyPayment(input: VerifyPaymentDto) {
    if (!appConfig.razorpayKeySecret) {
      throw new ServiceUnavailableException("RAZORPAY_KEY_SECRET is missing. Add it to backend/.env.");
    }

    const expectedSignature = crypto
      .createHmac("sha256", appConfig.razorpayKeySecret)
      .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== input.razorpaySignature) {
      throw new UnauthorizedException("Razorpay payment signature is invalid.");
    }

    const payment = await this.paymentModel
      .findOneAndUpdate(
        { orderId: input.razorpayOrderId },
        {
          providerPaymentId: input.razorpayPaymentId,
          status: PaymentStatus.Captured,
        },
        { returnDocument: "after" },
      )
      .exec();

    if (!payment) {
      throw new NotFoundException("Payment not found for Razorpay order.");
    }

    await this.invoicesService.attachPaymentReferences(payment.invoiceId, input.razorpayOrderId, input.razorpayPaymentId);
    await this.invoicesService.markPaid(payment.invoiceId, payment.amount);
    this.realtimeGateway.emitPaymentUpdated({ id: payment.id, status: payment.status });

    return payment;
  }

  async handleWebhook(input: PaymentWebhookDto, signature?: string, rawBody?: string) {
    if (!appConfig.razorpayWebhookSecret) {
      throw new ServiceUnavailableException("RAZORPAY_WEBHOOK_SECRET is missing. Add it to backend/.env.");
    }

    if (!signature) {
      throw new UnauthorizedException("Razorpay webhook signature is missing.");
    }

    this.verifyWebhookSignature(input, signature, rawBody);

    const entity = (
      input.payload?.payment as { entity?: Record<string, unknown> } | undefined
    )?.entity;
    const providerPaymentId = typeof entity?.id === "string" ? entity.id : null;
    const providerOrderId = String(entity?.order_id ?? "");

    if (input.event === "payment.captured" && providerPaymentId) {
      const payment = await this.paymentModel
        .findOneAndUpdate(
          { orderId: providerOrderId },
          {
            providerPaymentId,
            status: PaymentStatus.Captured,
            failureReason: null,
          },
          { returnDocument: "after" },
        )
        .exec();

      if (payment) {
        await this.invoicesService.attachPaymentReferences(
          payment.invoiceId,
          providerOrderId,
          providerPaymentId,
        );
        await this.invoicesService.markPaid(payment.invoiceId, payment.amount);
        this.realtimeGateway.emitPaymentUpdated({
          id: payment.id,
          status: payment.status,
          providerPaymentId: payment.providerPaymentId,
        });
      }
    }

    if (input.event === "payment.failed" && providerOrderId) {
      const errorDescription = (
        entity?.error_description ??
        entity?.error_reason ??
        entity?.error_code ??
        "Payment failed"
      ).toString();
      const payment = await this.paymentModel
        .findOneAndUpdate(
          { orderId: providerOrderId },
          {
            providerPaymentId,
            status: PaymentStatus.Failed,
            failureReason: errorDescription,
          },
          { returnDocument: "after" },
        )
        .exec();

      if (payment) {
        this.realtimeGateway.emitPaymentUpdated({
          id: payment.id,
          status: payment.status,
          providerPaymentId: payment.providerPaymentId,
          reason: payment.failureReason,
        });
      }
    }

    return {
      received: true,
      event: input.event,
    };
  }

  async refund(paymentId: string, input: RefundPaymentDto, actor?: { actorId?: string; actorRole?: string }) {
    if (!this.razorpayClient) {
      throw new ServiceUnavailableException(
        "Razorpay keys are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env.",
      );
    }

    const payment = await this.paymentModel.findById(paymentId).exec();

    if (!payment) {
      throw new NotFoundException("Payment not found.");
    }

    if (!payment.providerPaymentId) {
      throw new BadRequestException("Captured Razorpay payment id is required before refunding.");
    }

    const refundPayload: Record<string, unknown> = {
      notes: {
        reason: input.reason ?? "Admin refund",
        paymentId: payment.id,
      },
    };

    if (input.amount) {
      refundPayload.amount = Math.round(input.amount * 100);
    }

    const refund = (await this.razorpayClient.payments.refund(
      payment.providerPaymentId,
      refundPayload,
    )) as { id?: string };

    payment.status = PaymentStatus.Refunded;
    payment.refundId = refund.id ?? null;
    payment.refundReason = input.reason ?? null;
    await payment.save();
    await this.auditService.record({
      action: "payment.refund",
      entityType: "payment",
      entityId: payment.id,
      actorId: actor?.actorId,
      actorRole: actor?.actorRole,
      metadata: {
        invoiceId: payment.invoiceId,
        amount: input.amount ?? payment.amount,
        reason: input.reason ?? null,
        providerPaymentId: payment.providerPaymentId,
        refundId: payment.refundId,
      },
    });

    this.realtimeGateway.emitPaymentUpdated({
      id: payment.id,
      status: payment.status,
      refundId: payment.refundId,
      reason: input.reason ?? null,
    });

    return {
      payment,
      refund,
      refundMode: "live",
    };
  }

  findAll() {
    return this.paymentModel.find().sort({ createdAt: -1 }).exec();
  }

  private verifyWebhookSignature(input: PaymentWebhookDto, signature: string, rawBody?: string) {
    const body = rawBody ?? JSON.stringify(input);
    const expectedSignature = crypto.createHmac("sha256", appConfig.razorpayWebhookSecret).update(body).digest("hex");

    if (expectedSignature !== signature) {
      throw new UnauthorizedException("Razorpay webhook signature is invalid.");
    }
  }
}
