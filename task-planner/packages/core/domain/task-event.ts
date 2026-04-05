export type TaskEventType =
  | "task_created"
  | "field_extracted"
  | "clarification_requested"
  | "clarification_answered"
  | "research_requested"
  | "research_result_added"
  | "research_approved"
  | "subtask_created"
  | "plan_proposed"
  | "plan_approved"
  | "progress_logged"
  | "blocker_detected"
  | "blocker_resolved"
  | "task_done"
  | "task_cancelled";

export type TaskEventActor = "user" | "system" | "assistant" | "research";

export type TaskEvent = {
  id: string;
  taskId: string;
  eventType: TaskEventType;
  actor: TaskEventActor;
  payload: Record<string, unknown>;
  summary: string;
  createdAt: string;
};
