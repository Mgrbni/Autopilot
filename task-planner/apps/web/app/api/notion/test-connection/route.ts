import { NextResponse } from "next/server";

import { testNotionConnection } from "@task-planner/notion/client/notionClient";

export async function POST() {
  const report = await testNotionConnection();

  return NextResponse.json(report, {
    status: report.overallPass ? 200 : 400
  });
}
