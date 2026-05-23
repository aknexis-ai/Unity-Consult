import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { DocumentCategory } from "../documents/schemas/document.schema";
import { DocumentsService } from "../documents/documents.service";
import { CreateServiceCatalogDto } from "./dto/create-service-catalog.dto";
import { UpdateServiceCatalogDto } from "./dto/update-service-catalog.dto";
import { ServiceCatalog, ServiceCatalogDocument } from "./schemas/service-catalog.schema";

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(ServiceCatalog.name) private readonly serviceModel: Model<ServiceCatalogDocument>,
    private readonly documentsService: DocumentsService,
  ) {}

  findAll() {
    return this.serviceModel.find().sort({ category: 1, name: 1 }).exec();
  }

  async findOne(slug: string) {
    const service = await this.serviceModel.findOne({ slug }).exec();

    if (!service) {
      throw new NotFoundException("Service not found.");
    }

    return service;
  }

  async create(input: CreateServiceCatalogDto) {
    const existing = await this.serviceModel.findOne({ slug: input.slug }).exec();

    if (existing) {
      throw new ConflictException("A service with this slug already exists.");
    }

    const media: Record<string, string> = { ...(input.media as Record<string, string> ?? {}) };

    if (input.heroImageData) {
      const doc = await this.documentsService.upload({
        name: input.heroImageName ?? "service-hero",
        ownerName: "system",
        category: DocumentCategory.Other,
        mimeType: input.heroImageMimeType ?? "image/png",
        data: input.heroImageData,
      });
      const fsId = doc.gridFsId?.toString();
      media.hero = `/api/v1/media/${fsId}`;
    }

    if (input.cardImageData) {
      const doc = await this.documentsService.upload({
        name: input.cardImageName ?? "service-card",
        ownerName: "system",
        category: DocumentCategory.Other,
        mimeType: input.cardImageMimeType ?? "image/png",
        data: input.cardImageData,
      });
      const fsId = doc.gridFsId?.toString();
      media.card = `/api/v1/media/${fsId}`;
    }

    return this.serviceModel.create({
      ...input,
      slug: input.slug.toLowerCase(),
      status: input.status ?? "active",
      media: Object.keys(media).length > 0 ? media : input.media,
    });
  }

  async update(slug: string, input: UpdateServiceCatalogDto) {
    const service = await this.serviceModel.findOne({ slug }).exec();

    if (!service) {
      throw new NotFoundException("Service not found.");
    }

    const updateData: Record<string, unknown> = { ...input };
    const media: Record<string, string> = { ...((service.media ?? {}) as Record<string, string>) };

    if (input.heroImageData) {
      const doc = await this.documentsService.upload({
        name: input.heroImageName ?? "service-hero",
        ownerName: "system",
        category: DocumentCategory.Other,
        mimeType: input.heroImageMimeType ?? "image/png",
        data: input.heroImageData,
      });
      const fsId = doc.gridFsId?.toString();
      media.hero = `/api/v1/media/${fsId}`;
    }

    if (input.cardImageData) {
      const doc = await this.documentsService.upload({
        name: input.cardImageName ?? "service-card",
        ownerName: "system",
        category: DocumentCategory.Other,
        mimeType: input.cardImageMimeType ?? "image/png",
        data: input.cardImageData,
      });
      const fsId = doc.gridFsId?.toString();
      media.card = `/api/v1/media/${fsId}`;
    }

    updateData.media = media;
    delete updateData.heroImageData;
    delete updateData.heroImageMimeType;
    delete updateData.heroImageName;
    delete updateData.cardImageData;
    delete updateData.cardImageMimeType;
    delete updateData.cardImageName;

    const updated = await this.serviceModel.findOneAndUpdate({ slug }, updateData, { returnDocument: "after" }).exec();
    return updated;
  }

  async remove(slug: string) {
    const service = await this.serviceModel.findOneAndDelete({ slug }).exec();

    if (!service) {
      throw new NotFoundException("Service not found.");
    }

    return { success: true };
  }
}
