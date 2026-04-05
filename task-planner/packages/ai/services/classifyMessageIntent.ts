import { zodResponseFormat } from "openai/helpers/zod";

import { getOpenAIClient, getOpenAIEnv } from "../client/openaiClient";
import { messageIntentSchema, type MessageIntent } from "../schemas/messageIntent";

const INTENT_DEVELOPER_PROMPT = [
  "You classify user messages for a task-planning backend.",
  "Do not invent task IDs.",
  "If task link is unknown, relatedTaskId must be null.",
  "Return only JSON matching the provided schema."
].join(" ");

export async function classifyMessageIntent(userMessage: string): Promise<MessageIntent> {
  if (!userMessage.trim()) {
    throw new Error("classifyMessageIntent requires a non-empty userMessage.");
  }

  const env = getOpenAIEnv();
  const client = getOpenAIClient();

  const response = await client.responses.parse({
    model: env.OPENAI_MODEL_TAGGER,
    reasoning: { effort: env.OPENAI_REASONING_EFFORT },
    input: [
      { role: "developer", content: INTENT_DEVELOPER_PROMPT },
      { role: "user", content: userMessage }
    ],
    text: {
      format: zodResponseFormat(messageIntentSchema, "message_intent")
    }
  });

  const parsed = response.output_parsed;
  const validated = messageIntentSchema.safeParse(parsed);

  if (!validated.success) {
    throw new Error(`Message intent schema validation failed: ${validated.error.message}`);
  }

  return validated.data;
}
