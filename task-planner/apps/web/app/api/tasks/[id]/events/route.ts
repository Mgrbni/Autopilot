import { json } from "@/lib/http";

export async function POST() {
  return json({ message: "Append task event" }, 501);
}

export async function GET() {
  return json({ message: "List task events" }, 501);
}
