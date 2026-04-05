export type ResearchSnapshot = {
  id: string;
  taskId: string;
  queryType: string;
  queryText: string;
  resultSummary: string;
  structuredData: Record<string, unknown>;
  sourceLinks: string[];
  confidence: number;
  approvedByUser: boolean;
  createdAt: string;
};
