import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model, Types } from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";

import { CreateDocumentDto } from "./dto/create-document.dto";
import { UploadDocumentDto } from "./dto/upload-document.dto";
import { DocumentRecord, DocumentRecordDocument } from "./schemas/document.schema";

@Injectable()
export class DocumentsService {
  private bucket: GridFSBucket | null = null;

  constructor(
    @InjectModel(DocumentRecord.name) private readonly documentModel: Model<DocumentRecordDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    this.ensureBucket();
  }

  private ensureBucket() {
    if (this.connection.db) {
      this.bucket = new GridFSBucket(this.connection.db, {
        bucketName: "documents",
      });
    }
  }

  private getBucket(): GridFSBucket {
    if (!this.bucket) {
      this.ensureBucket();
    }

    if (!this.bucket) {
      throw new BadRequestException("Database connection is not available for file storage.");
    }

    return this.bucket;
  }

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

    const bucket = this.getBucket();

    // Upload file to GridFS
    const gridFsId = await new Promise<ObjectId>((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(input.name, {
        metadata: {
          contentType: input.mimeType || "application/octet-stream",
          ownerName: input.ownerName,
          category: input.category || "other",
        },
      });

      const readable = Readable.from(buffer);

      readable
        .pipe(uploadStream)
        .on("error", (error) => reject(new BadRequestException(`GridFS upload failed: ${error.message}`)))
        .on("finish", () => resolve(uploadStream.id));
    });

    // Create the document record with the GridFS file ID
    const document = await this.documentModel.create({
      name: input.name,
      ownerName: input.ownerName,
      category: input.category,
      mimeType: input.mimeType,
      description: input.description,
      fileUrl: `/api/v1/documents/${gridFsId}/download`,
      gridFsId: new Types.ObjectId(gridFsId.toString()),
      uploadedAt: new Date(),
    });

    return document;
  }

  findAll() {
    return this.documentModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid document ID.");
    }

    const document = await this.documentModel.findById(id).exec();

    if (!document) {
      throw new NotFoundException("Document not found.");
    }

    return document;
  }

  async createDownloadStream(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid document ID.");
    }

    // First try looking up by MongoDB document _id
    let document = await this.documentModel.findById(id).exec();

    if (!document) {
      // Fallback: try looking up by GridFS file ID in the fileUrl
      document = await this.documentModel.findOne({ fileUrl: `/api/v1/documents/${id}/download` }).exec();
    }

    if (!document) {
      throw new NotFoundException("Document not found.");
    }

    // Determine the GridFS ID to stream from
    const fsId = document.gridFsId
      ? new ObjectId(document.gridFsId.toString())
      : ObjectId.isValid(id)
        ? new ObjectId(id)
        : null;

    if (!fsId) {
      throw new NotFoundException("Document storage reference not found.");
    }

    const bucket = this.getBucket();
    const stream = bucket.openDownloadStream(fsId);

    return {
      document,
      stream,
    };
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid document ID.");
    }

    const document = await this.findOne(id);

    // Remove from GridFS if gridFsId exists
    if (document.gridFsId) {
      const bucket = this.getBucket();
      try {
        await bucket.delete(new ObjectId(document.gridFsId.toString()));
      } catch {
        // GridFS file might not exist — that's okay, remove the record anyway
      }
    }

    await this.documentModel.findByIdAndDelete(id).exec();

    return { deleted: true };
  }
}
