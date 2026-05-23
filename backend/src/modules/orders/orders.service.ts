import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { AuditService } from "../audit/audit.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { Order, OrderDocument, OrderLifecycleStatus } from "./schemas/order.schema";

const allowedTransitions: Record<OrderLifecycleStatus, OrderLifecycleStatus[]> = {
  [OrderLifecycleStatus.Inquiry]: [OrderLifecycleStatus.QuoteSent, OrderLifecycleStatus.Cancelled],
  [OrderLifecycleStatus.QuoteSent]: [OrderLifecycleStatus.BookingConfirmed, OrderLifecycleStatus.Cancelled],
  [OrderLifecycleStatus.BookingConfirmed]: [OrderLifecycleStatus.AdvancePaid, OrderLifecycleStatus.InProgress, OrderLifecycleStatus.Cancelled],
  [OrderLifecycleStatus.AdvancePaid]: [OrderLifecycleStatus.InProgress, OrderLifecycleStatus.Cancelled],
  [OrderLifecycleStatus.InProgress]: [OrderLifecycleStatus.UnderReview, OrderLifecycleStatus.Cancelled],
  [OrderLifecycleStatus.UnderReview]: [OrderLifecycleStatus.RevisionRequested, OrderLifecycleStatus.Completed],
  [OrderLifecycleStatus.RevisionRequested]: [OrderLifecycleStatus.InProgress, OrderLifecycleStatus.UnderReview],
  [OrderLifecycleStatus.Completed]: [OrderLifecycleStatus.Archived],
  [OrderLifecycleStatus.Cancelled]: [OrderLifecycleStatus.Archived],
  [OrderLifecycleStatus.Archived]: [],
};

function withAllowedTransitions(order: OrderDocument) {
  const status = order.status as OrderLifecycleStatus;

  return {
    ...order.toObject(),
    allowed_next_statuses: allowedTransitions[status] ?? [],
  };
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly realtimeGateway: RealtimeGateway,
    private readonly auditService: AuditService,
  ) {}

  async create(input: CreateOrderDto) {
    const order = await this.orderModel.create({
      ...input,
      status: input.status ?? OrderLifecycleStatus.Inquiry,
      stage: input.stage ?? OrderLifecycleStatus.Inquiry,
    });

    return withAllowedTransitions(order);
  }

  findAll() {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id).exec();

    if (!order) {
      throw new NotFoundException("Order not found.");
    }

    return withAllowedTransitions(order);
  }

  async updateStatus(id: string, input: UpdateOrderStatusDto, actor?: { actorId?: string; actorRole?: string }) {
    const current = await this.orderModel.findById(id).exec();

    if (!current) {
      throw new NotFoundException("Order not found.");
    }

    const nextStatus = input.status;
    const currentStatus = current.status as OrderLifecycleStatus;

    if (nextStatus && !allowedTransitions[currentStatus]?.includes(nextStatus)) {
      throw new BadRequestException(`Invalid order status transition: ${currentStatus} -> ${nextStatus}.`);
    }

    const order = await this.orderModel
      .findByIdAndUpdate(
        id,
        {
          ...input,
          stage: input.stage ?? nextStatus ?? current.stage,
        },
        { returnDocument: "after" },
      )
      .exec();

    if (!order) {
      throw new NotFoundException("Order not found.");
    }

    if (nextStatus && nextStatus !== currentStatus) {
      await this.auditService.record({
        action: "order.status_transition",
        entityType: "order",
        entityId: order.id,
        actorId: actor?.actorId,
        actorRole: actor?.actorRole,
        metadata: {
          from: currentStatus,
          to: nextStatus,
          allowedNext: allowedTransitions[nextStatus],
        },
      });
    }

    this.realtimeGateway.emitOrderUpdated({
      id: order.id,
      status: order.status,
      stage: order.stage,
      serviceName: order.serviceName,
      allowed_next_statuses: allowedTransitions[order.status as OrderLifecycleStatus] ?? [],
    });

    return withAllowedTransitions(order);
  }
}
