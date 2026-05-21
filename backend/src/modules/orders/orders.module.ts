import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { RealtimeModule } from "../realtime/realtime.module";
import { Order, OrderSchema } from "./schemas/order.schema";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), RealtimeModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [MongooseModule, OrdersService],
})
export class OrdersModule {}
