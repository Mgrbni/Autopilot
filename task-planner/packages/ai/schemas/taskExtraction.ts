import { z } from "zod";

export const taskExtractionSchema = z.object({
  title: z.string(),
  taskType: z.string().nullable(),
  strategicArea: z.string().nullable(),
  needsPhysicalPresence: z.boolean().nullable(),
  needsResearch: z.boolean().nullable(),
  needsPrep: z.boolean().nullable(),
  estimatedDurationMin: z.number().int().nullable(),
  deadline: z.string().nullable(),
  hardDeadline: z.boolean(),
  institutionName: z.string().nullable(),
  locationName: z.string().nullable(),
  requiredDocuments: z.array(z.string()),
  missingFields: z.array(z.string()),
  clarifyingQuestions: z.array(z.string()).max(3),
  confidence: z.number().min(0).max(1)
});

export type TaskExtraction = z.infer<typeof taskExtractionSchema>;
