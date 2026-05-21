import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRole } from "./schemas/user.schema";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtAccessGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.Admin, UserRole.Staff)
  findAll() {
    return this.usersService.findAll();
  }

  @Get("me")
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Client)
  me(@CurrentUser("sub") userId: string) {
    return this.usersService.findPublicById(userId);
  }

  @Get(":id")
  @Roles(UserRole.Admin, UserRole.Staff)
  findOne(@Param("id") id: string) {
    return this.usersService.findPublicById(id);
  }

  @Post()
  @Roles(UserRole.Admin)
  create(@Body() body: CreateUserDto) {
    return this.usersService.createFromAdmin(body);
  }

  @Patch("me")
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Client)
  updateMe(@CurrentUser("sub") userId: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(userId, body, false);
  }

  @Patch(":id")
  @Roles(UserRole.Admin)
  update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body, true);
  }
}
