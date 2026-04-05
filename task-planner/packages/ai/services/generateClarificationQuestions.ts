import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import { getOpenAIClient, getOpenAIEnv } from "../client/openaiClient";

const clarificationQuestionsSchema = z.object({
  clarifyingQuestions: z.array(z.string()).max(3)
});

export type ClarificationQuestionResult = z.infer<typeof clarificationQuestionsSchema>;

export type ClarificationQuestionInput = {
  title: string;
  rawInput: string;
  missingFields: string[];
  knownFacts: Record<string, string | number | boolean | null>;
};

const CLARIFICATION_DEVELOPER_PROMPT = [
  "You generate critical clarification questions for task planning.",
  "Output at most 3 questions.",
  "Do not ask about fields already known.",
  "Keep questions short and concrete.",
  "Return only JSON matching the provided schema."
].join(" ");

export async function generateClarificationQuestions(
  input: ClarificationQuestionInput
): Promise<ClarificationQuestionResult> {
  if (input.missingFields.length === 0) {
    return { clarifyingQuestions: [] };
  }

  const env = getOpenAIEnv();
  const client = getOpenAIClient();

  const userPayload = {
    title: input.title,
    rawInput: input.rawInput,
    missingFields: input.missingFields,
    knownFacts: input.knownFacts
  };

  const response = await client.responses.parse({
    model: env.OPENAI_MODEL_PLANNER,
    reasoning: { effort: env.OPENAI_REASONING_EFFORT },
    input: [
      { role: "developer", content: CLARIFICATION_DEVELOPER_PROMPT },
      { role: "user", content: JSON.stringify(userPayload) }
    ],
    text: {
      format: zodResponseFormat(clarificationQuestionsSchema, "clarification_questions")
    }
  });

  const parsed = response.output_parsed;
  const validated = clarificationQuestionsSchema.safeParse(parsed);

  if (!validated.success) {
    throw new Error(`Clarification questions schema validation failed: ${validated.error.message}`);
  }

  return validated.data;
}
