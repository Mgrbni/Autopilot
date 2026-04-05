import { createNotionClient, getDatabaseId, getNotionEnv } from "../client/notionClient";

type TaskEventSyncInput = {
  id: string;
  taskNotionPageId: string;
  summary: string;
  eventType: string;
  actor: string;
  createdAt: string;
  payload?: Record<string, unknown>;
};

async function findByPostgresId(notion: ReturnType<typeof createNotionClient>, databaseId: string, postgresId: string) {
  const query = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Postgres ID",
      rich_text: { equals: postgresId }
    },
    page_size: 1
  });

  return query.results[0] as any | undefined;
}

export async function syncTaskEventToNotion(input: TaskEventSyncInput): Promise<{ pageId: string; created: boolean }> {
  const env = getNotionEnv();
  const notion = createNotionClient(env.NOTION_API_KEY);
  const databaseId = getDatabaseId(env, "taskEvents");

  const properties: Record<string, any> = {
    "Postgres ID": { rich_text: [{ text: { content: input.id } }] },
    Summary: { title: [{ text: { content: input.summary.slice(0, 2000) } }] },
    "Event Type": { select: { name: input.eventType } },
    Actor: { select: { name: input.actor } },
    "Created At": { date: { start: input.createdAt } },
    "Payload JSON": {
      rich_text: input.payload
        ? [{ text: { content: JSON.stringify(input.payload).slice(0, 1900) } }]
        : []
    },
    Task: {
      relation: [{ id: input.taskNotionPageId }]
    }
  };

  const existing = await findByPostgresId(notion, databaseId, input.id);

  if (existing) {
    await notion.pages.update({ page_id: existing.id, properties });
    return { pageId: existing.id, created: false };
  }

  const created = (await notion.pages.create({
    parent: { database_id: databaseId },
    properties
  })) as any;

  return { pageId: created.id, created: true };
}
