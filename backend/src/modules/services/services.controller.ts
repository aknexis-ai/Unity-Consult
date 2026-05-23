import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { CreateServiceCatalogDto } from "./dto/create-service-catalog.dto";
import { UpdateServiceCatalogDto } from "./dto/update-service-catalog.dto";
import { ServicesService } from "./services.service";

@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.servicesService.findOne(slug);
  }

  @Post()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Content, UserRole.Seo, UserRole.Design, UserRole.CrmOps)
  create(@Body() body: CreateServiceCatalogDto) {
    return this.servicesService.create(body);
  }

  @Patch(":slug")
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Content, UserRole.Seo, UserRole.Design, UserRole.CrmOps)
  update(@Param("slug") slug: string, @Body() body: UpdateServiceCatalogDto) {
    return this.servicesService.update(slug, body);
  }

  @Delete(":slug")
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Content, UserRole.Design)
  remove(@Param("slug") slug: string) {
    return this.servicesService.remove(slug);
  }
}
