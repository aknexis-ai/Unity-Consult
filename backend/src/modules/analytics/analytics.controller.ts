import { Controller, Get, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
@UseGuards(JwtAccessGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("admin")
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Finance, UserRole.CrmOps, UserRole.Operations)
  getAdminMetrics() {
    return this.analyticsService.getAdminMetrics();
  }

  @Get("portal")
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Finance, UserRole.CrmOps, UserRole.Operations, UserRole.Client)
  getPortalMetrics() {
    return this.analyticsService.getPortalMetrics();
  }
}
