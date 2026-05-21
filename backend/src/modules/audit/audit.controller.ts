import { Controller, Get, Query, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { AuditService } from "./audit.service";

@Controller("audit")
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(UserRole.Admin)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(@Query("limit") limit?: string) {
    return this.auditService.findAll(limit ? Number(limit) : 100);
  }
}
