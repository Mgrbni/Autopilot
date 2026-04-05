# API contracts (MVP)

## Task resources

- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `POST /api/tasks/:id/events`
- `GET /api/tasks/:id/events`

## Workflow actions

- `POST /api/tasks/:id/clarify`
- `POST /api/tasks/:id/research`
- `POST /api/tasks/:id/research/approve`
- `POST /api/tasks/:id/decompose`
- `POST /api/tasks/:id/propose-plan`
- `POST /api/tasks/:id/approve-plan`
- `POST /api/tasks/:id/progress`

## Dashboard/profile/notion

- `GET /api/dashboard`
- `GET /api/profile`
- `PATCH /api/profile`
- `POST /api/notion/sync-profile`
- `POST /api/notion/sync-logs`
