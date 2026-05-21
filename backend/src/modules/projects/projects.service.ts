import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { RealtimeGateway } from "../realtime/realtime.gateway";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Project, ProjectDocument } from "./schemas/project.schema";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  create(input: CreateProjectDto) {
    return this.projectModel.create({
      ...input,
      clientEmail: input.clientEmail.toLowerCase(),
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    });
  }

  findAll() {
    return this.projectModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const project = await this.projectModel.findById(id).exec();
    if (!project) throw new NotFoundException("Project not found.");
    return project;
  }

  async update(id: string, input: UpdateProjectDto) {
    const project = await this.projectModel
      .findByIdAndUpdate(
        id,
        {
          ...input,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        },
        { returnDocument: "after" },
      )
      .exec();
    if (!project) throw new NotFoundException("Project not found.");
    this.realtimeGateway.emitOrderUpdated({ id: project.id, status: project.status, milestone: project.milestone });
    return project;
  }
}
