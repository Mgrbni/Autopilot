import { z } from "zod";

export const researchSummarySchema = z.object({
  taskId: z.string(),
  researchNeeded: z.boolean(),
  queriesRun: z.array(z.string()),
  institution: z
    .object({
      name: z.string(),
      address: z.string().nullable(),
      hours: z.string().nullable(),
      appointmentRequired: z.boolean().nullable()
    })
    .nullable(),
  requiredDocuments: z.array(z.string()),
  routeOptions: z.array(
    z.object({
      mode: z.string(),
      durationMin: z.number().int().positive(),
      estimatedCostTl: z.number().nonnegative()
    })
  ),
  warnings: z.array(z.string()),
  needsUserApproval: z.literal(true)
});

export type ResearchSummaryOutput = z.infer<typeof researchSummarySchema>;
