import type { TaskStatus } from "../domain/task";

const transitions: Record<TaskStatus, TaskStatus[]> = {
  Inbox: ["ClarifyingNeeded", "Researching", "Done", "Cancelled"],
  ClarifyingNeeded: ["Researching", "WaitingOnUser", "Done", "Cancelled"],
  Researching: ["ReadyToSchedule", "WaitingOnExternal", "Done", "Cancelled"],
  ReadyToSchedule: ["Scheduled", "ClarifyingNeeded", "Done", "Cancelled"],
  Scheduled: ["InProgress", "Blocked", "Done", "Cancelled"],
  WaitingOnUser: ["ClarifyingNeeded", "ReadyToSchedule", "Cancelled"],
  WaitingOnExternal: ["Researching", "Blocked", "Cancelled"],
  InProgress: ["Blocked", "Done", "Cancelled"],
  Blocked: ["ReadyToSchedule", "InProgress", "Cancelled"],
  Done: [],
  Cancelled: []
};

export function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  return transitions[from].includes(to);
}
