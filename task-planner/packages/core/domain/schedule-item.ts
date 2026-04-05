export type ScheduleItem = {
  id: string;
  taskId: string;
  start: string;
  end: string;
  travelMode: string | null;
  travelStart: string | null;
  estimatedCostTl: number | null;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
};
