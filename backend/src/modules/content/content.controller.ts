import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { ContentService } from "./content.service";
import { CreateContentItemDto } from "./dto/create-content-item.dto";
import { UpdateContentItemDto } from "./dto/update-content-item.dto";

@Controller("content")
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(UserRole.Admin, UserRole.Staff)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  create(@Body() body: CreateContentItemDto) {
    return this.contentService.create(body);
  }

  @Get()
  findAll() {
    return this.contentService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.contentService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateContentItemDto) {
    return this.contentService.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.contentService.remove(id);
  }
}
