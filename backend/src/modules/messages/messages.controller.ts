import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessagesService } from "./messages.service";

@Controller("messages")
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(UserRole.Admin, UserRole.Staff, UserRole.Support, UserRole.CrmOps, UserRole.Operations, UserRole.Client)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() body: CreateMessageDto) {
    return this.messagesService.create(body);
  }

  @Get()
  findAll(@Query("projectId") projectId?: string) {
    if (projectId) {
      return this.messagesService.findByProject(projectId);
    }

    return this.messagesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.messagesService.findOne(id);
  }
}
