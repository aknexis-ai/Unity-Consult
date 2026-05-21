import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { RealtimeGateway } from "../realtime/realtime.gateway";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketStatusDto } from "./dto/update-ticket-status.dto";
import { Ticket, TicketDocument } from "./schemas/ticket.schema";

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  create(input: CreateTicketDto) {
    return this.ticketModel.create({
      ...input,
      requesterEmail: input.requesterEmail.toLowerCase(),
    });
  }

  findAll() {
    return this.ticketModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const ticket = await this.ticketModel.findById(id).exec();

    if (!ticket) {
      throw new NotFoundException("Ticket not found.");
    }

    return ticket;
  }

  async updateStatus(id: string, input: UpdateTicketStatusDto) {
    const ticket = await this.ticketModel.findByIdAndUpdate(id, input, { returnDocument: "after" }).exec();

    if (!ticket) {
      throw new NotFoundException("Ticket not found.");
    }

    this.realtimeGateway.emitTicketUpdated({
      id: ticket.id,
      status: ticket.status,
      priority: ticket.priority,
      subject: ticket.subject,
    });

    return ticket;
  }
}
