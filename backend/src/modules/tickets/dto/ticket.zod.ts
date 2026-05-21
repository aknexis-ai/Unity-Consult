import { z } from "zod";

export const createTicketSchema = z.object({
  subject: z.string().min(2),
  message: z.string().min(2),
  requesterName: z.string().min(2),
  requesterEmail: z.string().email(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
});
