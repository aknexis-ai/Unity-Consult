import { IsEnum } from "class-validator";

import { LeadStage } from "../schemas/lead.schema";

export class UpdateLeadStageDto {
  @IsEnum(LeadStage)
  stage!: LeadStage;
}
