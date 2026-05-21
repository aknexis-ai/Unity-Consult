import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

import { TicketPriority } from "../schemas/ticket.schema";

export class CreateTicketDto {
  @IsString()
  subject!: string;

  @IsString()
  message!: string;

  @IsString()
  requesterName!: string;

  @IsEmail()
  requesterEmail!: string;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;
}
