export type NotionPropertyType =
  | "title"
  | "rich_text"
  | "number"
  | "select"
  | "multi_select"
  | "date"
  | "checkbox"
  | "url"
  | "email"
  | "phone_number"
  | "relation"
  | "people"
  | "files"
  | "status"
  | "created_time"
  | "last_edited_time"
  | "created_by"
  | "last_edited_by";

export type NotionPropertyRequirement = {
  key: string;
  name: string;
  type: NotionPropertyType;
  required: boolean;
};

export type NotionDatabaseMapping = {
  envKey: string;
  label: string;
  properties: NotionPropertyRequirement[];
};

// NOTE: Property names in `name` must exactly match the original Notion database properties.
export const notionMappings = {
  tasks: {
    envKey: "NOTION_TASKS_DATABASE_ID",
    label: "Tasks",
    properties: [
      { key: "postgresId", name: "Postgres ID", type: "rich_text", required: true },
      { key: "title", name: "Title", type: "title", required: true },
      { key: "status", name: "Status", type: "status", required: true },
      { key: "taskType", name: "Task Type", type: "select", required: false },
      { key: "priority", name: "Priority", type: "number", required: false },
      { key: "deadline", name: "Deadline", type: "date", required: false },
      { key: "hardDeadline", name: "Hard Deadline", type: "checkbox", required: false },
      { key: "requiredDocuments", name: "Required Documents", type: "multi_select", required: false },
      { key: "aiSummary", name: "AI Summary", type: "rich_text", required: false },
      { key: "taskEvents", name: "Task Events", type: "relation", required: false },
      { key: "institution", name: "Institution", type: "relation", required: false },
      { key: "researchSnapshots", name: "Research Snapshots", type: "relation", required: false },
      { key: "documents", name: "Documents", type: "relation", required: false },
      { key: "userProfile", name: "User Profile", type: "relation", required: false }
    ]
  },
  taskEvents: {
    envKey: "NOTION_TASK_EVENTS_DATABASE_ID",
    label: "Task Events",
    properties: [
      { key: "postgresId", name: "Postgres ID", type: "rich_text", required: true },
      { key: "summary", name: "Summary", type: "title", required: true },
      { key: "eventType", name: "Event Type", type: "select", required: true },
      { key: "actor", name: "Actor", type: "select", required: true },
      { key: "createdAt", name: "Created At", type: "date", required: true },
      { key: "payloadJson", name: "Payload JSON", type: "rich_text", required: false },
      { key: "task", name: "Task", type: "relation", required: true }
    ]
  },
  institutions: {
    envKey: "NOTION_INSTITUTIONS_DATABASE_ID",
    label: "Institutions",
    properties: [
      { key: "postgresId", name: "Postgres ID", type: "rich_text", required: true },
      { key: "name", name: "Name", type: "title", required: true },
      { key: "address", name: "Address", type: "rich_text", required: false },
      { key: "district", name: "District", type: "rich_text", required: false },
      { key: "city", name: "City", type: "rich_text", required: false },
      { key: "officialHours", name: "Official Hours", type: "rich_text", required: false },
      { key: "appointmentRequiredDefault", name: "Appointment Required Default", type: "checkbox", required: false },
      { key: "defaultRequiredDocuments", name: "Default Required Documents", type: "multi_select", required: false },
      { key: "source", name: "Source", type: "url", required: false },
      { key: "lastVerifiedAt", name: "Last Verified At", type: "date", required: false },
      { key: "tasks", name: "Tasks", type: "relation", required: false },
      { key: "researchSnapshots", name: "Research Snapshots", type: "relation", required: false }
    ]
  },
  research: {
    envKey: "NOTION_RESEARCH_DATABASE_ID",
    label: "Research Snapshots",
    properties: [
      { key: "postgresId", name: "Postgres ID", type: "rich_text", required: true },
      { key: "summary", name: "Summary", type: "title", required: true },
      { key: "queryType", name: "Query Type", type: "select", required: true },
      { key: "queryText", name: "Query Text", type: "rich_text", required: true },
      { key: "resultSummary", name: "Result Summary", type: "rich_text", required: true },
      { key: "sourceLinks", name: "Source Links", type: "url", required: false },
      { key: "confidence", name: "Confidence", type: "number", required: true },
      { key: "approvedByUser", name: "Approved By User", type: "checkbox", required: true },
      { key: "createdAt", name: "Created At", type: "date", required: true },
      { key: "task", name: "Task", type: "relation", required: true },
      { key: "institution", name: "Institution", type: "relation", required: false },
      { key: "documents", name: "Documents", type: "relation", required: false }
    ]
  },
  userProfile: {
    envKey: "NOTION_USER_PROFILE_DATABASE_ID",
    label: "User Profile",
    properties: [
      { key: "postgresId", name: "Postgres ID", type: "rich_text", required: true },
      { key: "name", name: "Name", type: "title", required: true },
      { key: "homeBase", name: "Home Base", type: "rich_text", required: false },
      { key: "preferredTransportOrder", name: "Preferred Transport Order", type: "multi_select", required: false },
      { key: "morningTransportRule", name: "Morning Transport Rule", type: "rich_text", required: false },
      { key: "acceptableTaxiThresholdTl", name: "Acceptable Taxi Threshold TL", type: "number", required: false },
      { key: "defaultTravelBufferMin", name: "Default Travel Buffer Min", type: "number", required: true },
      { key: "workdayErrandPolicy", name: "Workday Errand Policy", type: "rich_text", required: false },
      { key: "knownDocuments", name: "Known Documents", type: "multi_select", required: false },
      { key: "budgetSensitivity", name: "Budget Sensitivity", type: "select", required: false },
      { key: "allowBeforeWork", name: "Allow Before Work", type: "checkbox", required: true },
      { key: "allowAfterWork", name: "Allow After Work", type: "checkbox", required: true },
      { key: "allowSundayErrands", name: "Allow Sunday Errands", type: "checkbox", required: true },
      { key: "timezone", name: "Timezone", type: "rich_text", required: true },
      { key: "tasks", name: "Tasks", type: "relation", required: false },
      { key: "documents", name: "Documents", type: "relation", required: false }
    ]
  },
  documents: {
    envKey: "NOTION_DOCUMENTS_DATABASE_ID",
    label: "Documents",
    properties: [
      { key: "postgresId", name: "Postgres ID", type: "rich_text", required: true },
      { key: "name", name: "Name", type: "title", required: true },
      { key: "documentType", name: "Document Type", type: "select", required: false },
      { key: "status", name: "Status", type: "status", required: false },
      { key: "expiryDate", name: "Expiry Date", type: "date", required: false },
      { key: "issuingInstitution", name: "Issuing Institution", type: "relation", required: false },
      { key: "tasks", name: "Tasks", type: "relation", required: false },
      { key: "researchSnapshots", name: "Research Snapshots", type: "relation", required: false },
      { key: "userProfile", name: "User Profile", type: "relation", required: false }
    ]
  }
} satisfies Record<string, NotionDatabaseMapping>;

export type NotionDatabaseKey = keyof typeof notionMappings;
