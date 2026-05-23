import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { IsEmail, IsString } from "class-validator";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { NotificationsService } from "./notifications.service";

class SendEmailDto {
  @IsEmail()
  to!: string;

  @IsString()
  subject!: string;

  @IsString()
  html!: string;
}

class SendWhatsappDto {
  @IsString()
  to!: string;

  @IsString()
  body!: string;
}

@Controller("notifications")
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(UserRole.Admin, UserRole.Staff, UserRole.Support, UserRole.CrmOps, UserRole.Operations)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post("email")
  sendEmail(@Body() body: SendEmailDto) {
    return this.notificationsService.sendEmail(body);
  }

  @Post("whatsapp")
  sendWhatsapp(@Body() body: SendWhatsappDto) {
    return this.notificationsService.sendWhatsapp(body);
  }
}
