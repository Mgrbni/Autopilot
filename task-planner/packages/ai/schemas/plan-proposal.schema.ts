import { z } from "zod";

const optionSchema = z.object({
  start: z.string(),
  end: z.string(),
  travelMode: z.string().nullable(),
  travelStart: z.string().nullable(),
  estimatedCostTl: z.number().nonnegative().nullable(),
  reason: z.string()
});

export const planProposalSchema = z.object({
  taskId: z.string(),
  blockingReasons: z.array(z.string()),
  bestOption: optionSchema.nullable(),
  fallbackOption: optionSchema.nullable(),
  needsUserApproval: z.literal(true)
});

export type PlanProposalOutput = z.infer<typeof planProposalSchema>;
