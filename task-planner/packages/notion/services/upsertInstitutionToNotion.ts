import { createNotionClient, getDatabaseId, getNotionEnv } from "../client/notionClient";

type InstitutionUpsertInput = {
  id: string;
  name: string;
  address?: string | null;
  district?: string | null;
  city?: string | null;
  officialHours?: string | null;
  appointmentRequiredDefault?: boolean | null;
  defaultRequiredDocuments?: string[];
  source?: string | null;
  lastVerifiedAt?: string | null;
};

async function findExistingInstitution(
  notion: ReturnType<typeof createNotionClient>,
  databaseId: string,
  input: InstitutionUpsertInput
) {
  const byPostgresId = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Postgres ID",
      rich_text: { equals: input.id }
    },
    page_size: 1
  });

  if (byPostgresId.results[0]) {
    return byPostgresId.results[0] as any;
  }

  const byName = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Name",
      title: { equals: input.name }
    },
    page_size: 1
  });

  return byName.results[0] as any | undefined;
}

export async function upsertInstitutionToNotion(
  input: InstitutionUpsertInput
): Promise<{ pageId: string; created: boolean }> {
  const env = getNotionEnv();
  const notion = createNotionClient(env.NOTION_API_KEY);
  const databaseId = getDatabaseId(env, "institutions");

  const properties: Record<string, any> = {
    "Postgres ID": { rich_text: [{ text: { content: input.id } }] },
    Name: { title: [{ text: { content: input.name } }] },
    Address: input.address ? { rich_text: [{ text: { content: input.address } }] } : { rich_text: [] },
    District: input.district ? { rich_text: [{ text: { content: input.district } }] } : { rich_text: [] },
    City: input.city ? { rich_text: [{ text: { content: input.city } }] } : { rich_text: [] },
    "Official Hours": input.officialHours
      ? { rich_text: [{ text: { content: input.officialHours } }] }
      : { rich_text: [] },
    "Appointment Required Default": { checkbox: Boolean(input.appointmentRequiredDefault) },
    "Default Required Documents": {
      multi_select: (input.defaultRequiredDocuments ?? []).map((name) => ({ name }))
    },
    Source: { url: input.source ?? null },
    "Last Verified At": input.lastVerifiedAt ? { date: { start: input.lastVerifiedAt } } : { date: null }
  };

  const existing = await findExistingInstitution(notion, databaseId, input);

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
