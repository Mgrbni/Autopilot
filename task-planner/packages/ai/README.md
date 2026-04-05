# AI layer

Server-side OpenAI integration for Task Planner.

## Environment setup

Add to `.env`:

- `OPENAI_API_KEY`
- `OPENAI_MODEL_PLANNER` (default: `gpt-5.4-mini`)
- `OPENAI_MODEL_TAGGER` (default: `gpt-5.4-nano`)
- `OPENAI_REASONING_EFFORT` (`low` | `medium` | `high`)

## Why API key must remain server-side

`OPENAI_API_KEY` is only read in server runtime code (`packages/ai/client/openaiClient.ts`).
Do not expose it in browser bundles, client components, or public runtime config.

## Why schema validation is mandatory

Model output is untrusted until validated with Zod. Every extraction/classification service validates structured JSON before returning typed data. This prevents invalid payloads from being written to Postgres or Notion.

## Model split

- Planner/extraction workloads: `OPENAI_MODEL_PLANNER`
- Cheap classification/tagging workloads: `OPENAI_MODEL_TAGGER`
