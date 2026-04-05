import { json } from "@/lib/http";

export async function GET() {
  return json({
    widgets: [
      "needsClarification",
      "readyToSchedule",
      "waitingForApproval",
      "blockedTasks",
      "upcomingScheduled",
      "recentUpdates"
    ]
  }, 501);
}
