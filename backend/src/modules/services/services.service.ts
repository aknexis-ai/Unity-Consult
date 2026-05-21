import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateServiceCatalogDto } from "./dto/create-service-catalog.dto";
import { UpdateServiceCatalogDto } from "./dto/update-service-catalog.dto";
import { ServiceCatalog, ServiceCatalogDocument } from "./schemas/service-catalog.schema";

@Injectable()
export class ServicesService {
  constructor(@InjectModel(ServiceCatalog.name) private readonly serviceModel: Model<ServiceCatalogDocument>) {}

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

    return this.serviceModel.create({
      ...input,
      slug: input.slug.toLowerCase(),
      status: input.status ?? "active",
    });
  }

  async update(slug: string, input: UpdateServiceCatalogDto) {
    const service = await this.serviceModel.findOneAndUpdate({ slug }, input, { returnDocument: "after" }).exec();

    if (!service) {
      throw new NotFoundException("Service not found.");
    }

    return service;
  }

  async remove(slug: string) {
    const service = await this.serviceModel.findOneAndDelete({ slug }).exec();

    if (!service) {
      throw new NotFoundException("Service not found.");
    }

    return { success: true };
  }
}
