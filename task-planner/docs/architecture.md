# Architecture

Task Planner is a DB-first planning system with strict model contracts.

## Principles

- PostgreSQL is operational source of truth.
- Task snapshot and event history are separate.
- Model output is accepted only through schema validators.
- Research requires explicit user approval before becoming schedulable truth.

## Layers

- `apps/web`: Next.js UI + API routes.
- `packages/db`: Prisma schema and DB client.
- `packages/core`: domain types, state machine, scheduling logic.
- `packages/ai`: prompt assets, JSON schemas, OpenAI client wrapper.
- `packages/notion`: integration and sync boundaries.

## Data flow (task intake)

1. Persist raw task input immediately.
2. Append `task_created` event.
3. Run extraction via typed AI schema.
4. Validate output and append `field_extracted` event.
5. Detect blockers; if present, emit `clarification_requested`.
6. If research needed, store `ResearchSnapshot` as unapproved.
7. Only approved research can feed plan proposals.
