import type { Task } from "../domain/task";

export const CRITICAL_FIELDS = [
  "exact_next_step",
  "deadline_or_urgency",
  "estimated_duration",
  "institution_or_location_if_physical",
  "required_documents_status",
  "availability_window_if_time_sensitive"
] as const;

export function detectMissingCriticalFields(task: Task): string[] {
  const missing = new Set<string>(task.missingFields);

  if (!task.title?.trim()) missing.add("exact_next_step");
  if (!task.deadline) missing.add("deadline_or_urgency");
  if (!task.estimatedDurationMin) missing.add("estimated_duration");

  if (task.needsPhysicalPresence && !task.institutionId && !task.locationId) {
    missing.add("institution_or_location_if_physical");
  }

  if (task.requiredDocuments.length === 0) {
    missing.add("required_documents_status");
  }

  return [...missing];
}

export function isSchedulable(task: Task): boolean {
  return detectMissingCriticalFields(task).length === 0;
}
