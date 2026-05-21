import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { mkdir, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { basename, extname, join } from "node:path";
import { randomUUID } from "node:crypto";

import { CreateDocumentDto } from "./dto/create-document.dto";
import { UploadDocumentDto } from "./dto/upload-document.dto";
import { DocumentRecord, DocumentRecordDocument } from "./schemas/document.schema";

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentRecord.name) private readonly documentModel: Model<DocumentRecordDocument>,
  ) {}

  create(input: CreateDocumentDto) {
    return this.documentModel.create(input);
  }

  async upload(input: UploadDocumentDto) {
    const buffer = Buffer.from(input.data, "base64");

    if (!buffer.length) {
      throw new BadRequestException("Uploaded document is empty.");
    }

    const maxSizeBytes = 10 * 1024 * 1024;

    if (buffer.length > maxSizeBytes) {
      throw new BadRequestException("Uploaded document must be 10MB or smaller.");
    }

    const safeExtension = extname(input.name).replace(/[^.\w-]/g, "") || ".bin";
    const filename = `${Date.now()}-${randomUUID()}${safeExtension}`;
    const uploadDir = join(process.cwd(), "uploads", "documents");

    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), buffer);

    return this.documentModel.create({
      name: input.name,
      ownerName: input.ownerName,
      category: input.category,
      mimeType: input.mimeType,
      description: input.description,
      fileUrl: `/api/v1/documents/${filename}/download`,
      uploadedAt: new Date(),
    });
  }

  findAll() {
    return this.documentModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const document = await this.documentModel.findById(id).exec();

    if (!document) {
      throw new NotFoundException("Document not found.");
    }

    return document;
  }

  async createDownloadStream(filename: string) {
    const safeName = basename(filename);
    const document = await this.documentModel.findOne({ fileUrl: `/api/v1/documents/${safeName}/download` }).exec();

    if (!document) {
      throw new NotFoundException("Document not found.");
    }

    return {
      document,
      stream: createReadStream(join(process.cwd(), "uploads", "documents", safeName)),
    };
  }
}
