import { json } from "@/lib/http";

export async function GET() {
  return json({ message: "Get task by id" }, 501);
}

export async function PATCH() {
  return json({ message: "Patch task: always append TaskEvent for state mutation." }, 501);
}
