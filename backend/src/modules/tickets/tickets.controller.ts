import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { createTicketSchema } from "./dto/ticket.zod";
import { UpdateTicketStatusDto } from "./dto/update-ticket-status.dto";
import { TicketsService } from "./tickets.service";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";

@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createTicketSchema)) body: CreateTicketDto) {
    return this.ticketsService.create(body);
  }

  @Get()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Client)
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Client)
  findOne(@Param("id") id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(":id/status")
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Staff)
  updateStatus(@Param("id") id: string, @Body() body: UpdateTicketStatusDto) {
    return this.ticketsService.updateStatus(id, body);
  }
}
