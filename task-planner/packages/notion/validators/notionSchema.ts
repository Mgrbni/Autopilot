import { z } from "zod";

import {
  notionMappings,
  type NotionDatabaseKey,
  type NotionDatabaseMapping,
  type NotionPropertyRequirement
} from "../config/notionMappings";

const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1, "NOTION_API_KEY is required"),
  NOTION_TASKS_DATABASE_ID: z.string().min(1, "NOTION_TASKS_DATABASE_ID is required"),
  NOTION_TASK_EVENTS_DATABASE_ID: z.string().min(1, "NOTION_TASK_EVENTS_DATABASE_ID is required"),
  NOTION_INSTITUTIONS_DATABASE_ID: z.string().min(1, "NOTION_INSTITUTIONS_DATABASE_ID is required"),
  NOTION_RESEARCH_DATABASE_ID: z.string().min(1, "NOTION_RESEARCH_DATABASE_ID is required"),
  NOTION_USER_PROFILE_DATABASE_ID: z.string().min(1, "NOTION_USER_PROFILE_DATABASE_ID is required"),
  NOTION_DOCUMENTS_DATABASE_ID: z.string().min(1, "NOTION_DOCUMENTS_DATABASE_ID is required")
});

export type NotionEnv = z.infer<typeof envSchema>;

export type NotionPropertyValidationIssue = {
  propertyKey: string;
  propertyName: string;
  expectedType: string;
  actualType: string | null;
  reason: "missing_property" | "type_mismatch";
};

export type NotionDatabaseValidationResult = {
  databaseKey: NotionDatabaseKey;
  label: string;
  databaseId: string;
  pass: boolean;
  issues: NotionPropertyValidationIssue[];
};

export function validateNotionEnv(rawEnv: NodeJS.ProcessEnv): NotionEnv {
  return envSchema.parse(rawEnv);
}

export function getDatabaseIdFromEnv(env: NotionEnv, mapping: NotionDatabaseMapping): string {
  return env[mapping.envKey as keyof NotionEnv];
}

export function validateNotionDatabaseSchema(
  databaseKey: NotionDatabaseKey,
  databaseId: string,
  dbProperties: Record<string, { type: string }>,
  requiredProperties: NotionPropertyRequirement[]
): NotionDatabaseValidationResult {
  const issues: NotionPropertyValidationIssue[] = [];

  for (const expected of requiredProperties) {
    if (!expected.required) {
      continue;
    }

    const actual = dbProperties[expected.name];
    if (!actual) {
      issues.push({
        propertyKey: expected.key,
        propertyName: expected.name,
        expectedType: expected.type,
        actualType: null,
        reason: "missing_property"
      });
      continue;
    }

    if (actual.type !== expected.type) {
      issues.push({
        propertyKey: expected.key,
        propertyName: expected.name,
        expectedType: expected.type,
        actualType: actual.type,
        reason: "type_mismatch"
      });
    }
  }

  return {
    databaseKey,
    label: notionMappings[databaseKey].label,
    databaseId,
    pass: issues.length === 0,
    issues
  };
}
