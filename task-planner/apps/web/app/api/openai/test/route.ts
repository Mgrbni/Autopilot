import { NextResponse } from "next/server";

import { getOpenAIClient, getOpenAIEnv } from "@task-planner/ai/client/openaiClient";

export async function POST() {
  try {
    const env = getOpenAIEnv();
    const client = getOpenAIClient();

    const response = await client.responses.create({
      model: env.OPENAI_MODEL_TAGGER,
      input: "Reply with exactly OPENAI_OK"
    });

    const outputText = response.output_text?.trim() ?? "";

    return NextResponse.json({
      ok: outputText === "OPENAI_OK",
      output_text: outputText
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown OpenAI test error";

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
