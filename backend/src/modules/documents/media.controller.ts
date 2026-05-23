import { Controller, Get, Param, Res } from "@nestjs/common";
import { FastifyReply } from "fastify";

import { DocumentsService } from "./documents.service";

@Controller()
export class MediaController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get("media/:gridFsId")
  async serveFile(@Param("gridFsId") gridFsId: string, @Res() response: FastifyReply) {
    const result = await this.documentsService.createDownloadStream(gridFsId);
    const mimeType = result.document.mimeType ?? "application/octet-stream";

    response.header("Content-Type", mimeType);
    response.header("Cache-Control", "public, max-age=31536000, immutable");
    return response.send(result.stream);
  }
}

