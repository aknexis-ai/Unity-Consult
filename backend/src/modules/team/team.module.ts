import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { TeamMember, TeamMemberSchema } from "./schemas/team-member.schema";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: TeamMember.name, schema: TeamMemberSchema }])],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService, MongooseModule],
})
export class TeamModule {}
