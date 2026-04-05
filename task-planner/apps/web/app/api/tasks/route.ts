import { json } from "@/lib/http";

export async function POST() {
  return json({ message: "Create task: persist rawInput immediately, then append task_created event." }, 501);
}

export async function GET() {
  return json({ message: "List tasks" }, 501);
}
