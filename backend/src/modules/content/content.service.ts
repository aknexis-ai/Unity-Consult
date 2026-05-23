import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { DocumentCategory } from "../documents/schemas/document.schema";
import { DocumentsService } from "../documents/documents.service";
import { CreateContentItemDto } from "./dto/create-content-item.dto";
import { UpdateContentItemDto } from "./dto/update-content-item.dto";
import { ContentItem, ContentItemDocument } from "./schemas/content-item.schema";

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(ContentItem.name) private readonly contentModel: Model<ContentItemDocument>,
    private readonly documentsService: DocumentsService,
  ) {}

  async create(input: CreateContentItemDto) {
    let imageId: string | undefined;
    let imageUrl: string | undefined;

    if (input.imageData) {
      const doc = await this.documentsService.upload({
        name: input.imageName ?? "content-image",
        ownerName: "system",
        category: DocumentCategory.Other,
        mimeType: input.imageMimeType ?? "image/png",
        data: input.imageData,
      });
      imageId = doc.gridFsId?.toString();
      imageUrl = `/api/v1/media/${imageId}`;
    }

    return this.contentModel.create({
      title: input.title,
      type: input.type,
      status: input.status,
      summary: input.summary,
      imageId: imageId ?? input.imageId ?? null,
      imageUrl: imageUrl ?? input.imageUrl ?? null,
    });
  }

  findAll() {
    return this.contentModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const item = await this.contentModel.findById(id).exec();

    if (!item) {
      throw new NotFoundException("Content item not found.");
    }

    return item;
  }

  async update(id: string, input: UpdateContentItemDto) {
    const updateData: Record<string, unknown> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.type !== undefined) updateData.type = input.type;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.summary !== undefined) updateData.summary = input.summary;

    if (input.imageId !== undefined) updateData.imageId = input.imageId;
    if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;

    if (input.imageData) {
      const doc = await this.documentsService.upload({
        name: input.imageName ?? "content-image",
        ownerName: "system",
        category: DocumentCategory.Other,
        mimeType: input.imageMimeType ?? "image/png",
        data: input.imageData,
      });
      const fsId = doc.gridFsId?.toString();
      updateData.imageId = fsId;
      updateData.imageUrl = `/api/v1/media/${fsId}`;
    }

    const item = await this.contentModel.findByIdAndUpdate(id, updateData, { returnDocument: "after" }).exec();

    if (!item) {
      throw new NotFoundException("Content item not found.");
    }

    return item;
  }

  async remove(id: string) {
    const item = await this.contentModel.findByIdAndDelete(id).exec();

    if (!item) {
      throw new NotFoundException("Content item not found.");
    }

    return { success: true };
  }
}
