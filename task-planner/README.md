# Task Planner

Production-grade task planning system built to be typed, stateful, approval-gated, and explicitly non-hallucinatory.

## Stack

- Next.js + TypeScript (web + API routes)
- PostgreSQL + Prisma
- OpenAI API via typed AI service layer
- Notion API sync layer
- Turborepo monorepo layout

## Non-hallucination guarantees

1. Raw user input is stored immediately.
2. Every task update emits an append-only `TaskEvent`.
3. Model output is schema validated before DB writes.
4. Research facts remain unapproved until user approval.
5. Scheduling is blocked by missing critical fields.
6. Clarification questions are capped at 3 critical prompts.
7. User-approved data outranks everything else.
8. Stored facts outrank model inference.
9. Inference is explicitly labeled.
10. Historical state is append-only.

## Getting started

```bash
npm install
npm run dev
```

## Monorepo structure

See `docs/architecture.md` for full details.
