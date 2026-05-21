import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { RealtimeGateway } from "../realtime/realtime.gateway";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { UpdateLeadStageDto } from "./dto/update-lead-stage.dto";
import { Lead, LeadDocument } from "./schemas/lead.schema";

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<LeadDocument>,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  create(input: CreateLeadDto) {
    return this.leadModel.create({
      ...input,
      email: input.email.toLowerCase(),
    });
  }

  findAll() {
    return this.leadModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const lead = await this.leadModel.findById(id).exec();

    if (!lead) {
      throw new NotFoundException("Lead not found.");
    }

    return lead;
  }

  async updateStage(id: string, input: UpdateLeadStageDto) {
    const lead = await this.leadModel.findByIdAndUpdate(id, { stage: input.stage }, { returnDocument: "after" }).exec();

    if (!lead) {
      throw new NotFoundException("Lead not found.");
    }

    this.realtimeGateway.emitLeadStageChanged({
      id: lead.id,
      stage: lead.stage,
      email: lead.email,
      service: lead.service,
    });

    return lead;
  }
}
