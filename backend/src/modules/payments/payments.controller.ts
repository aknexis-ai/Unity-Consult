import { Body, Controller, Get, Headers, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";

import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { CreatePaymentOrderDto } from "./dto/create-payment-order.dto";
import { PaymentWebhookDto } from "./dto/payment-webhook.dto";
import { RefundPaymentDto } from "./dto/refund-payment.dto";
import { VerifyPaymentDto } from "./dto/verify-payment.dto";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("create-order")
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Finance, UserRole.Client)
  createOrder(@Body() body: CreatePaymentOrderDto) {
    return this.paymentsService.createOrder(body);
  }

  @Post("verify")
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Finance, UserRole.Client)
  verifyPayment(@Body() body: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(body);
  }

  @Post("webhook")
  handleWebhook(
    @Body() body: PaymentWebhookDto,
    @Headers("x-razorpay-signature") signature: string | undefined,
    @Req() request: FastifyRequest & { rawBody?: string },
  ) {
    return this.paymentsService.handleWebhook(body, signature, request.rawBody);
  }

  @Patch(":id/refund")
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Finance)
  refund(
    @Param("id") id: string,
    @Body() body: RefundPaymentDto,
    @CurrentUser("sub") actorId: string,
    @CurrentUser("role") actorRole: string,
  ) {
    return this.paymentsService.refund(id, body, { actorId, actorRole });
  }

  @Get()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Finance)
  findAll() {
    return this.paymentsService.findAll();
  }
}
