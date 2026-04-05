import { createNotionClient, getDatabaseId, getNotionEnv } from "../client/notionClient";

export type NotionInstitutionRecord = {
  notionPageId: string;
  postgresId: string | null;
  name: string;
  address: string | null;
  district: string | null;
  city: string | null;
  officialHours: string | null;
  appointmentRequiredDefault: boolean | null;
  defaultRequiredDocuments: string[];
  source: string | null;
  lastVerifiedAt: string | null;
};

function text(prop: any): string | null {
  if (!prop) return null;
  if (prop.type === "title") return prop.title?.[0]?.plain_text ?? null;
  if (prop.type === "rich_text") return prop.rich_text?.[0]?.plain_text ?? null;
  return null;
}

export async function fetchInstitutionByName(name: string): Promise<NotionInstitutionRecord | null> {
  const env = getNotionEnv();
  const notion = createNotionClient(env.NOTION_API_KEY);
  const databaseId = getDatabaseId(env, "institutions");

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Name",
      title: {
        equals: name
      }
    },
    page_size: 1
  });

  const page = response.results[0] as any;
  if (!page) {
    return null;
  }

  const p = page.properties;

  return {
    notionPageId: page.id,
    postgresId: text(p["Postgres ID"]),
    name: text(p.Name) ?? "",
    address: text(p.Address),
    district: text(p.District),
    city: text(p.City),
    officialHours: text(p["Official Hours"]),
    appointmentRequiredDefault: p["Appointment Required Default"]?.checkbox ?? null,
    defaultRequiredDocuments: (p["Default Required Documents"]?.multi_select ?? []).map((x: any) => x.name),
    source: p.Source?.url ?? null,
    lastVerifiedAt: p["Last Verified At"]?.date?.start ?? null
  };
}
