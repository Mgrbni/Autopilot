import { json } from "@/lib/http";

export async function GET() {
  return json({ message: "Get profile" }, 501);
}

export async function PATCH() {
  return json({ message: "Patch profile" }, 501);
}
