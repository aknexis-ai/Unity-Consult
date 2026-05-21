import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { TeamMember, TeamMemberDocument } from "./schemas/team-member.schema";

@Injectable()
export class TeamService {
  constructor(@InjectModel(TeamMember.name) private readonly teamModel: Model<TeamMemberDocument>) {}

  create(input: CreateTeamMemberDto) {
    return this.teamModel.create({
      ...input,
      email: input.email.toLowerCase(),
      permissions: input.permissions ?? [],
    });
  }

  findAll() {
    return this.teamModel.find().sort({ createdAt: -1 }).exec();
  }
}
