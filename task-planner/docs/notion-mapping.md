# Notion mapping

Notion is external memory, not transaction authority.

## Postgres-first entities

- tasks
- task_events
- schedule_items
- research_snapshots
- user_profile cache

## Notion targets

- Daily logs and summaries
- Long-form user notes
- Reusable profile context
- Manual review queue for approvals/rejections

## Sync policies

- Pull profile context from Notion into cached `UserProfile`.
- Push approved plan/research summaries as human-readable logs.
- Never overwrite explicit user-confirmed DB fields from Notion automatically.
