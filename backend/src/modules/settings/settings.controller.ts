import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { UpdateMySettingsDto } from "./dto/update-my-settings.dto";
import { SettingsService } from "./settings.service";

@Controller("settings")
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(UserRole.Admin, UserRole.Staff, UserRole.Finance, UserRole.Support, UserRole.Seo, UserRole.Design, UserRole.Content, UserRole.Hr, UserRole.Operations, UserRole.CrmOps, UserRole.Client)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get("me")
  getMySettings(@CurrentUser("sub") userId: string) {
    return this.settingsService.getMySettings(userId);
  }

  @Patch("me")
  updateMySettings(@CurrentUser("sub") userId: string, @Body() body: UpdateMySettingsDto) {
    return this.settingsService.updateMySettings(userId, body);
  }
}
