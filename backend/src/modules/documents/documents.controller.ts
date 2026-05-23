import { Body, Controller, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import type { FastifyReply } from "fastify";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../users/schemas/user.schema";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UploadDocumentDto } from "./dto/upload-document.dto";
import { DocumentsService } from "./documents.service";

@Controller("documents")
@UseGuards(JwtAccessGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Operations, UserRole.CrmOps)
  create(@Body() body: CreateDocumentDto) {
    return this.documentsService.create(body);
  }

  @Post("upload")
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Operations, UserRole.CrmOps, UserRole.Client)
  upload(@Body() body: UploadDocumentDto) {
    return this.documentsService.upload(body);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Operations, UserRole.CrmOps, UserRole.Client)
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Operations, UserRole.CrmOps, UserRole.Client)
  findOne(@Param("id") id: string) {
    return this.documentsService.findOne(id);
  }

  @Get(":id/download")
  @Roles(UserRole.Admin, UserRole.Staff, UserRole.Operations, UserRole.CrmOps, UserRole.Client)
  async download(@Param("id") id: string, @Res() reply: FastifyReply) {
    const { document, stream } = await this.documentsService.createDownloadStream(id);

    reply.header("content-type", document.mimeType ?? "application/octet-stream");
    reply.header("content-disposition", `inline; filename="${document.name}"`);

    return reply.send(stream);
  }
}
