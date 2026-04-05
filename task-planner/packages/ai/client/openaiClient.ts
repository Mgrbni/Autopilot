import OpenAI from "openai";
import { z } from "zod";

const openAIEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  OPENAI_MODEL_PLANNER: z.string().min(1).default("gpt-5.4-mini"),
  OPENAI_MODEL_TAGGER: z.string().min(1).default("gpt-5.4-nano"),
  OPENAI_REASONING_EFFORT: z.enum(["low", "medium", "high"]).default("medium")
});

export type OpenAIEnv = z.infer<typeof openAIEnvSchema>;
export type OpenAIReasoningEffort = OpenAIEnv["OPENAI_REASONING_EFFORT"];

let cachedClient: OpenAI | null = null;

export function getOpenAIEnv(rawEnv: NodeJS.ProcessEnv = process.env): OpenAIEnv {
  return openAIEnvSchema.parse(rawEnv);
}

export function createOpenAIClient(apiKey: string): OpenAI {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. Set OPENAI_API_KEY in server environment.");
  }

  return new OpenAI({ apiKey });
}

export function getOpenAIClient(): OpenAI {
  if (cachedClient) {
    return cachedClient;
  }

  const env = getOpenAIEnv();
  cachedClient = createOpenAIClient(env.OPENAI_API_KEY);
  return cachedClient;
}
