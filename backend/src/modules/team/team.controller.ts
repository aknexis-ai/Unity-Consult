import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { TeamService } from "./team.service";

@Controller("team")
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(UserRole.Admin, UserRole.Staff, UserRole.Hr)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Body() body: CreateTeamMemberDto) {
    return this.teamService.create(body);
  }

  @Get()
  findAll() {
    return this.teamService.findAll();
  }
}
