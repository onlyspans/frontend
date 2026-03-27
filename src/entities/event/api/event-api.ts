import { api } from '@/shared/api';
import type {
  BatchIngestRequest,
  BatchIngestResponse,
  ExportEventsRequest,
  QueryResult,
  SearchEventsRequest,
  SettingsDTO,
  IngestEventRequest,
  SingleIngestResponse
} from '../model/types';

const EVENTS_BASE = '/events';

const eventEndpoints = {
  search: () => EVENTS_BASE,
  export: () => `${EVENTS_BASE}/export`,
  ingest: () => `${EVENTS_BASE}/ingest`,
  ingestBatch: () => `${EVENTS_BASE}/ingest/batch`,
  settings: () => '/settings'
} as const;

function getFilenameFromContentDisposition(value: string | undefined): string | null {
  if (!value) return null;
  const match = value.match(/filename\*?=(?:UTF-8''|")?([^\";]+)"?/i);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export const eventApi = {
  search: (body: SearchEventsRequest) =>
    api.events.post<QueryResult>(eventEndpoints.search(), body).then((r) => r.data),

  exportCsv: async (body: ExportEventsRequest) => {
    const response = await api.events.post<Blob>(eventEndpoints.export(), body, {
      responseType: 'blob'
    });

    const contentDisposition = String(response.headers?.['content-disposition'] ?? '');
    const filename = getFilenameFromContentDisposition(contentDisposition);

    return { blob: response.data, filename };
  },

  getSettings: () => api.events.get<SettingsDTO>(eventEndpoints.settings()).then((r) => r.data),

  updateSettings: (body: SettingsDTO) =>
    api.events.put<SettingsDTO>(eventEndpoints.settings(), body).then((r) => r.data),

  ingest: (body: IngestEventRequest) =>
    api.events.post<SingleIngestResponse>(eventEndpoints.ingest(), body).then((r) => r.data),

  ingestBatch: (body: BatchIngestRequest) =>
    api.events
      .post<BatchIngestResponse>(eventEndpoints.ingestBatch(), body)
      .then((r) => r.data)
};
