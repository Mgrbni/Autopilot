import { json } from "@/lib/http";

export async function POST() {
  return json({ message: "Endpoint scaffold" }, 501);
}
