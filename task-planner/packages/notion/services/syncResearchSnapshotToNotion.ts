import { createNotionClient, getDatabaseId, getNotionEnv } from "../client/notionClient";

type ResearchSyncInput = {
  id: string;
  taskNotionPageId: string;
  queryType: string;
  queryText: string;
  resultSummary: string;
  confidence: number;
  approvedByUser: boolean;
  createdAt: string;
  sourceLinks?: string[];
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

export async function syncResearchSnapshotToNotion(input: ResearchSyncInput): Promise<{ pageId: string; created: boolean }> {
  const env = getNotionEnv();
  const notion = createNotionClient(env.NOTION_API_KEY);
  const databaseId = getDatabaseId(env, "research");

  const properties: Record<string, any> = {
    "Postgres ID": { rich_text: [{ text: { content: input.id } }] },
    Summary: { title: [{ text: { content: input.resultSummary.slice(0, 2000) } }] },
    "Query Type": { select: { name: input.queryType } },
    "Query Text": { rich_text: [{ text: { content: input.queryText.slice(0, 1900) } }] },
    "Result Summary": { rich_text: [{ text: { content: input.resultSummary.slice(0, 1900) } }] },
    Confidence: { number: input.confidence },
    "Approved By User": { checkbox: input.approvedByUser },
    "Created At": { date: { start: input.createdAt } },
    Task: { relation: [{ id: input.taskNotionPageId }] },
    "Source Links": {
      url: input.sourceLinks?.[0] ?? null
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
