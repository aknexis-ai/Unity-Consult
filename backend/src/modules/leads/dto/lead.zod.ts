import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(2),
  stage: z.enum(["new", "qualified", "proposal", "won"]).optional(),
  source: z.string().optional(),
  budget: z.string().optional(),
});
