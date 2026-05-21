import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateContentItemDto } from "./dto/create-content-item.dto";
import { UpdateContentItemDto } from "./dto/update-content-item.dto";
import { ContentItem, ContentItemDocument } from "./schemas/content-item.schema";

@Injectable()
export class ContentService {
  constructor(@InjectModel(ContentItem.name) private readonly contentModel: Model<ContentItemDocument>) {}

  create(input: CreateContentItemDto) {
    return this.contentModel.create(input);
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
    const item = await this.contentModel.findByIdAndUpdate(id, input, { returnDocument: "after" }).exec();

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
