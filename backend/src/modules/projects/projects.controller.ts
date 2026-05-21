import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectsService } from "./projects.service";

@Controller("projects")
@UseGuards(JwtAccessGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.Admin, UserRole.Staff)
  create(@Body() body: CreateProjectDto) {
    return this.projectsService.create(body);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Client)
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Client)
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(":id")
  @Roles(UserRole.Admin, UserRole.Staff)
  update(@Param("id") id: string, @Body() body: UpdateProjectDto) {
    return this.projectsService.update(id, body);
  }
}
