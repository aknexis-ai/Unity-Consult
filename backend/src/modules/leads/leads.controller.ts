import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { createLeadSchema } from "./dto/lead.zod";
import { UpdateLeadStageDto } from "./dto/update-lead-stage.dto";
import { LeadsService } from "./leads.service";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";

@Controller("leads")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createLeadSchema)) body: CreateLeadDto) {
    return this.leadsService.create(body);
  }

  @Get()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.CrmOps, UserRole.Operations)
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.CrmOps, UserRole.Operations)
  findOne(@Param("id") id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(":id/stage")
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.CrmOps, UserRole.Operations)
  updateStage(
    @Param("id") id: string,
    @Body() body: UpdateLeadStageDto,
    @CurrentUser("sub") updatedBy: string,
  ) {
    void updatedBy;
    return this.leadsService.updateStage(id, body);
  }
}
