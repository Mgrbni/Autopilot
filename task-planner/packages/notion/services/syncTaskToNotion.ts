import { createNotionClient, getDatabaseId, getNotionEnv } from "../client/notionClient";

type TaskSyncInput = {
  id: string;
  title: string;
  status: string;
  taskType?: string | null;
  priority?: number | null;
  deadline?: string | null;
  hardDeadline?: boolean;
  requiredDocuments?: string[];
  aiSummary?: string | null;
};

async function findTaskPageByPostgresId(notion: ReturnType<typeof createNotionClient>, databaseId: string, postgresId: string) {
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

export async function syncTaskToNotion(task: TaskSyncInput): Promise<{ pageId: string; created: boolean }> {
  const env = getNotionEnv();
  const notion = createNotionClient(env.NOTION_API_KEY);
  const databaseId = getDatabaseId(env, "tasks");

  const properties: Record<string, any> = {
    "Postgres ID": {
      rich_text: [{ text: { content: task.id } }]
    },
    Title: {
      title: [{ text: { content: task.title } }]
    },
    Status: {
      status: { name: task.status }
    },
    "Task Type": task.taskType ? { select: { name: task.taskType } } : { select: null },
    Priority: typeof task.priority === "number" ? { number: task.priority } : { number: null },
    Deadline: task.deadline ? { date: { start: task.deadline } } : { date: null },
    "Hard Deadline": { checkbox: Boolean(task.hardDeadline) },
    "Required Documents": {
      multi_select: (task.requiredDocuments ?? []).map((name) => ({ name }))
    },
    "AI Summary": task.aiSummary
      ? {
          rich_text: [{ text: { content: task.aiSummary.slice(0, 1900) } }]
        }
      : { rich_text: [] }
  };

  const existing = await findTaskPageByPostgresId(notion, databaseId, task.id);

  if (existing) {
    await notion.pages.update({
      page_id: existing.id,
      properties
    });

    return { pageId: existing.id, created: false };
  }

  const created = (await notion.pages.create({
    parent: { database_id: databaseId },
    properties
  })) as any;

  return { pageId: created.id, created: true };
}
