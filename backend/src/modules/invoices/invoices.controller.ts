import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { InvoicesService } from "./invoices.service";

@Controller("invoices")
@UseGuards(JwtAccessGuard, RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Roles(UserRole.Admin, UserRole.Staff)
  create(@Body() body: CreateInvoiceDto) {
    return this.invoicesService.create(body);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Client)
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Client)
  findOne(@Param("id") id: string) {
    return this.invoicesService.findOne(id);
  }
}
