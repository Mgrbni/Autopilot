# Notion integration layer

This package contains Notion-only integration logic for Task Planner OS.

## Setup

1. Share each original database with your Notion integration.
2. Add the IDs and API key to `.env` using `.env.example`.
3. Keep Postgres as source-of-truth; this package only syncs memory/state to Notion.

## Verify connection and schema

Run the API server and call:

```bash
curl -X POST http://localhost:3000/api/notion/test-connection
```

The endpoint returns:

- `envPass` and env issues
- per-database retrieval status
- strict required property validation status per database
- `overallPass`

If a property name or type is wrong, validation fails loudly in the corresponding database report.

## Files

- `client/notionClient.ts`: SDK client creation, env loading, connection test runner.
- `config/notionMappings.ts`: all 6 database property mappings and expectations.
- `validators/notionSchema.ts`: env and strict schema validators.
- `services/*`: fetch/sync helpers with idempotent upsert behavior via `Postgres ID` (or name fallback for institutions).
