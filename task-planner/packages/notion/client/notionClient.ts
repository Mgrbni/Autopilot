import { Client } from "@notionhq/client";

import { notionMappings, type NotionDatabaseKey } from "../config/notionMappings";
import {
  getDatabaseIdFromEnv,
  validateNotionDatabaseSchema,
  validateNotionEnv,
  type NotionDatabaseValidationResult,
  type NotionEnv
} from "../validators/notionSchema";

export type NotionConnectionReport = {
  envPass: boolean;
  envIssues: string[];
  databaseReports: Array<
    NotionDatabaseValidationResult & {
      retrieved: boolean;
      retrieveError?: string;
    }
  >;
  overallPass: boolean;
};

export function getNotionEnv(): NotionEnv {
  return validateNotionEnv(process.env);
}

export function createNotionClient(apiKey = getNotionEnv().NOTION_API_KEY): Client {
  return new Client({ auth: apiKey });
}

export function getDatabaseId(env: NotionEnv, key: NotionDatabaseKey): string {
  return getDatabaseIdFromEnv(env, notionMappings[key]);
}

export async function testNotionConnection(): Promise<NotionConnectionReport> {
  let env: NotionEnv;

  try {
    env = validateNotionEnv(process.env);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown env validation error";
    return {
      envPass: false,
      envIssues: [message],
      databaseReports: [],
      overallPass: false
    };
  }

  const notion = createNotionClient(env.NOTION_API_KEY);
  const databaseReports: NotionConnectionReport["databaseReports"] = [];

  for (const key of Object.keys(notionMappings) as NotionDatabaseKey[]) {
    const mapping = notionMappings[key];
    const databaseId = getDatabaseIdFromEnv(env, mapping);

    try {
      const database = await notion.databases.retrieve({ database_id: databaseId });
      const dbProperties = database.properties as Record<string, { type: string }>;

      const validation = validateNotionDatabaseSchema(key, databaseId, dbProperties, mapping.properties);

      databaseReports.push({
        ...validation,
        retrieved: true
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Notion API error";
      databaseReports.push({
        databaseKey: key,
        label: mapping.label,
        databaseId,
        pass: false,
        issues: [],
        retrieved: false,
        retrieveError: message
      });
    }
  }

  const overallPass = databaseReports.every((report) => report.pass && report.retrieved);

  return {
    envPass: true,
    envIssues: [],
    databaseReports,
    overallPass
  };
}
