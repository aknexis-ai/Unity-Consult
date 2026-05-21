import { IsEnum } from "class-validator";

import { TicketStatus } from "../schemas/ticket.schema";

export class UpdateTicketStatusDto {
  @IsEnum(TicketStatus)
  status!: TicketStatus;
}
