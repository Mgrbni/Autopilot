import { json } from "@/lib/http";

export async function POST() {
  return json({ message: "DB-first profile sync from Notion" }, 501);
}
