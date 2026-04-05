export type UserProfile = {
  id: string;
  homeBase: string | null;
  workScheduleJson: Record<string, unknown>;
  preferredTransportOrder: string[];
  morningTransportRule: string | null;
  acceptableTaxiThresholdTl: number | null;
  defaultTravelBufferMin: number;
  workdayErrandPolicy: string | null;
  knownDocuments: string[];
  budgetSensitivity: string | null;
  allowBeforeWork: boolean;
  allowAfterWork: boolean;
  allowSundayErrands: boolean;
  timezone: string;
};
