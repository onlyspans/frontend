import { useMemo, useState } from 'react';
import type { ExportEventsRequest } from '@/entities/event';
import { useEventsSearch } from '@/entities/event';

export type EventsSortField =
  | 'timestamp'
  | 'entity_id'
  | 'entity_name'
  | 'action'
  | 'user_id'
  | 'tenant';

export type SortOrder = 'asc' | 'desc';

export type EventsLogFilters = {
  entityId: string;
  entityName: string;
  action: string;
  userId: string;
  tenant: string;
  startDate: string; // datetime-local value
  endDate: string; // datetime-local value
};

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_SORT_BY: EventsSortField = 'timestamp';
const DEFAULT_SORT_ORDER: SortOrder = 'desc';

function toIsoOrUndefined(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  const date = new Date(v);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export function useEventsLog() {
  const [filters, setFilters] = useState<EventsLogFilters>({
    entityId: '',
    entityName: '',
    action: '',
    userId: '',
    tenant: '',
    startDate: '',
    endDate: ''
  });
  const [sortBy, setSortBy] = useState<EventsSortField>(DEFAULT_SORT_BY);
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_SORT_ORDER);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const request = useMemo(() => {
    return {
      entityId: filters.entityId.trim() || undefined,
      entityName: filters.entityName.trim() || undefined,
      action: filters.action.trim() || undefined,
      userId: filters.userId.trim() || undefined,
      tenant: filters.tenant.trim() || undefined,
      startDate: toIsoOrUndefined(filters.startDate),
      endDate: toIsoOrUndefined(filters.endDate),
      sortBy,
      sortOrder,
      page,
      size: pageSize
    };
  }, [filters, page, pageSize, sortBy, sortOrder]);

  const query = useEventsSearch({
    ...request,
    page
  });

  const exportRequest: ExportEventsRequest = useMemo(
    () => ({
      entityId: request.entityId,
      entityName: request.entityName,
      action: request.action,
      userId: request.userId,
      tenant: request.tenant,
      startDate: request.startDate,
      endDate: request.endDate,
      sortBy: request.sortBy,
      sortOrder: request.sortOrder
    }),
    [request]
  );

  const onChangeFilters = (patch: Partial<EventsLogFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const onClearFilters = () => {
    setFilters({
      entityId: '',
      entityName: '',
      action: '',
      userId: '',
      tenant: '',
      startDate: '',
      endDate: ''
    });
    setPage(1);
  };

  const onSort = (field: EventsSortField) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
      setPage(1);
      return;
    }
    setSortBy(field);
    setSortOrder('asc');
    setPage(1);
  };

  return {
    filters,
    setFilters: onChangeFilters,
    clearFilters: onClearFilters,
    sortBy,
    sortOrder,
    onSort,
    setSortBy: (field: EventsSortField) => {
      setSortBy(field);
      setPage(1);
    },
    setSortOrder: (order: SortOrder) => {
      setSortOrder(order);
      setPage(1);
    },
    page,
    setPage,
    pageSize,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
    query,
    events: query.data?.events ?? [],
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    exportRequest
  };
}
