export type Institution = {
  id: string;
  name: string;
  address: string | null;
  district: string | null;
  city: string | null;
  officialHours: string | null;
  appointmentRequiredDefault: boolean | null;
  defaultRequiredDocuments: string[];
  source: string | null;
  lastVerifiedAt: string | null;
};
