import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateMessageDto } from "./dto/create-message.dto";
import { Message, MessageDocument } from "./schemas/message.schema";

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>) {}

  create(input: CreateMessageDto) {
    return this.messageModel.create(input);
  }

  findAll() {
    return this.messageModel.find().sort({ createdAt: -1 }).exec();
  }

  findByProject(projectId: string) {
    return this.messageModel.find({ projectId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const message = await this.messageModel.findById(id).exec();
    if (!message) throw new NotFoundException("Message not found.");
    return message;
  }
}
