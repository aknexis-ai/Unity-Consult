import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { RealtimeGateway } from "../realtime/realtime.gateway";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { Order, OrderDocument } from "./schemas/order.schema";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  create(input: CreateOrderDto) {
    return this.orderModel.create(input);
  }

  findAll() {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id).exec();

    if (!order) {
      throw new NotFoundException("Order not found.");
    }

    return order;
  }

  async updateStatus(id: string, input: UpdateOrderStatusDto) {
    const order = await this.orderModel.findByIdAndUpdate(id, input, { returnDocument: "after" }).exec();

    if (!order) {
      throw new NotFoundException("Order not found.");
    }

    this.realtimeGateway.emitOrderUpdated({
      id: order.id,
      status: order.status,
      stage: order.stage,
      serviceName: order.serviceName,
    });

    return order;
  }
}
