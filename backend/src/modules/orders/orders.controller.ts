import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
@UseGuards(JwtAccessGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.CrmOps, UserRole.Operations)
  create(@Body() body: CreateOrderDto) {
    return this.ordersService.create(body);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.CrmOps, UserRole.Operations, UserRole.Finance, UserRole.Client)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.CrmOps, UserRole.Operations, UserRole.Finance, UserRole.Client)
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(":id/status")
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.CrmOps, UserRole.Operations)
  updateStatus(
    @Param("id") id: string,
    @Body() body: UpdateOrderStatusDto,
    @CurrentUser("sub") actorId: string,
    @CurrentUser("role") actorRole: string,
  ) {
    return this.ordersService.updateStatus(id, body, { actorId, actorRole });
  }
}
