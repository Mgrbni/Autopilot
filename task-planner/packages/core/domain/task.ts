export type TaskStatus =
  | "Inbox"
  | "ClarifyingNeeded"
  | "Researching"
  | "ReadyToSchedule"
  | "Scheduled"
  | "WaitingOnUser"
  | "WaitingOnExternal"
  | "InProgress"
  | "Blocked"
  | "Done"
  | "Cancelled";

export type Task = {
  id: string;
  title: string;
  rawInput: string;
  taskType: string | null;
  strategicArea: string | null;
  status: TaskStatus;
  priority: number | null;
  deadline: string | null;
  hardDeadline: boolean;
  estimatedDurationMin: number | null;
  needsPhysicalPresence: boolean | null;
  needsResearch: boolean | null;
  needsPrep: boolean | null;
  prepNotes: string | null;
  institutionId: string | null;
  locationId: string | null;
  appointmentRequired: boolean | null;
  requiredDocuments: string[];
  transportModePreferred: string | null;
  estimatedCostTl: number | null;
  proposedStart: string | null;
  proposedEnd: string | null;
  approvedStart: string | null;
  approvedEnd: string | null;
  followupDue: string | null;
  missingFields: string[];
  aiSummary: string | null;
  userApprovedPlan: boolean;
  parentTaskId: string | null;
  createdAt: string;
  updatedAt: string;
};
