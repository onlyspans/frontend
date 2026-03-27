export type EventChange = {
  field?: string;
  oldValue?: string;
  newValue?: string;
};

export type Event = {
  id: string;
  timestamp: string; // RFC3339
  entityId: string;
  entityName?: string;
  action: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  tenant?: string;
  changes?: EventChange[];
};

export type SearchEventsRequest = {
  entityId?: string;
  entityName?: string;
  action?: string;
  userId?: string;
  tenant?: string;
  startDate?: string; // RFC3339
  endDate?: string; // RFC3339
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number; // 0-based
  size?: number; // max 1000
};

export type ExportEventsRequest = Omit<SearchEventsRequest, 'page' | 'size'>;

export type QueryResult = {
  events: Event[];
  total: number;
  page: number; // 0-based
  size: number;
  totalPages: number;
};

export type SettingsDTO = {
  retentionPeriodDays: number;
  maxExportSize: number;
};

// Ingest endpoints use snake_case as per service contract
export type IngestEventRequest = {
  timestamp?: string; // RFC3339
  entity_id: string;
  entity_name?: string;
  action: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  tenant?: string;
  changes?: EventChange[];
};

export type SingleIngestResponse = { id: string };

export type BatchIngestRequest = {
  events: IngestEventRequest[];
};

export type BatchIngestResponse = {
  success_count: number;
  failure_count: number;
  errors?: Array<{ index: number; error: string }>;
};
