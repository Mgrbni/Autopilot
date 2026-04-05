import { zodResponseFormat } from "openai/helpers/zod";

import { getOpenAIClient, getOpenAIEnv } from "../client/openaiClient";
import { taskExtractionSchema, type TaskExtraction } from "../schemas/taskExtraction";

const EXTRACTION_DEVELOPER_PROMPT = [
  "You are a task extraction engine for a strict workflow system.",
  "Never invent facts.",
  "Preserve uncertainty by using null and missingFields when data is unknown.",
  "Ask at most 3 critical clarification questions.",
  "Return only JSON matching the provided schema."
].join(" ");

export async function extractTask(userMessage: string): Promise<TaskExtraction> {
  if (!userMessage.trim()) {
    throw new Error("extractTask requires a non-empty userMessage.");
  }

  const env = getOpenAIEnv();
  const client = getOpenAIClient();

  const response = await client.responses.parse({
    model: env.OPENAI_MODEL_PLANNER,
    reasoning: { effort: env.OPENAI_REASONING_EFFORT },
    input: [
      { role: "developer", content: EXTRACTION_DEVELOPER_PROMPT },
      { role: "user", content: userMessage }
    ],
    text: {
      format: zodResponseFormat(taskExtractionSchema, "task_extraction")
    }
  });

  const parsed = response.output_parsed;
  const validated = taskExtractionSchema.safeParse(parsed);

  if (!validated.success) {
    throw new Error(`Task extraction schema validation failed: ${validated.error.message}`);
  }

  return validated.data;
}
