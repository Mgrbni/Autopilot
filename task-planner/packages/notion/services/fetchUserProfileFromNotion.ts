import { createNotionClient, getDatabaseId, getNotionEnv } from "../client/notionClient";
import { notionMappings } from "../config/notionMappings";

export type NotionUserProfileRecord = {
  notionPageId: string;
  postgresId: string | null;
  name: string;
  homeBase: string | null;
  preferredTransportOrder: string[];
  morningTransportRule: string | null;
  acceptableTaxiThresholdTl: number | null;
  defaultTravelBufferMin: number | null;
  workdayErrandPolicy: string | null;
  knownDocuments: string[];
  budgetSensitivity: string | null;
  allowBeforeWork: boolean | null;
  allowAfterWork: boolean | null;
  allowSundayErrands: boolean | null;
  timezone: string | null;
};

function firstText(prop: any): string | null {
  if (!prop) return null;
  if (prop.type === "title") return prop.title?.[0]?.plain_text ?? null;
  if (prop.type === "rich_text") return prop.rich_text?.[0]?.plain_text ?? null;
  return null;
}

export async function fetchUserProfileFromNotion(): Promise<NotionUserProfileRecord | null> {
  const env = getNotionEnv();
  const notion = createNotionClient(env.NOTION_API_KEY);
  const databaseId = getDatabaseId(env, "userProfile");

  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 1
  });

  const page = response.results[0] as any;
  if (!page) return null;

  const p = page.properties;

  return {
    notionPageId: page.id,
    postgresId: firstText(p[notionMappings.userProfile.properties.find((item) => item.key === "postgresId")!.name]),
    name: firstText(p[notionMappings.userProfile.properties.find((item) => item.key === "name")!.name]) ?? "",
    homeBase: firstText(p["Home Base"]),
    preferredTransportOrder: (p["Preferred Transport Order"]?.multi_select ?? []).map((x: any) => x.name),
    morningTransportRule: firstText(p["Morning Transport Rule"]),
    acceptableTaxiThresholdTl: p["Acceptable Taxi Threshold TL"]?.number ?? null,
    defaultTravelBufferMin: p["Default Travel Buffer Min"]?.number ?? null,
    workdayErrandPolicy: firstText(p["Workday Errand Policy"]),
    knownDocuments: (p["Known Documents"]?.multi_select ?? []).map((x: any) => x.name),
    budgetSensitivity: p["Budget Sensitivity"]?.select?.name ?? null,
    allowBeforeWork: p["Allow Before Work"]?.checkbox ?? null,
    allowAfterWork: p["Allow After Work"]?.checkbox ?? null,
    allowSundayErrands: p["Allow Sunday Errands"]?.checkbox ?? null,
    timezone: firstText(p["Timezone"])
  };
}
