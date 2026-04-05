import { z } from "zod";

export const messageIntentSchema = z.object({
  intent: z.enum([
    "new_task",
    "task_update",
    "blocker",
    "approval",
    "rejection",
    "research_correction",
    "progress_log",
    "unrelated"
  ]),
  confidence: z.number().min(0).max(1),
  relatedTaskId: z.string().nullable(),
  reasoningShort: z.string()
});

export type MessageIntent = z.infer<typeof messageIntentSchema>;
