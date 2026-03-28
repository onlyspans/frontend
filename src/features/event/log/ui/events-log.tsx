import { EventsFilters } from './events-filters';
import { EventsPagination } from './events-pagination';
import { EventsTable } from './events-table';
import { useEventsLog } from '../hooks/use-events-log';

interface EventsLogProps {
  log: ReturnType<typeof useEventsLog>;
}

export function EventsLog({ log }: EventsLogProps) {

  return (
    <div className="space-y-4">
      <EventsFilters
        filters={log.filters}
        onChange={log.setFilters}
        onClear={log.clearFilters}
        pageSize={log.pageSize}
        onPageSizeChange={log.setPageSize}
      />

      <EventsTable
        events={log.events}
        isLoading={log.query.isLoading}
        isError={Boolean(log.query.isError)}
        sortBy={log.sortBy}
        sortOrder={log.sortOrder}
        onSort={log.onSort}
      />

      <EventsPagination
        currentPage={log.page}
        totalPages={log.totalPages}
        totalItems={log.total}
        pageSize={log.pageSize}
        onPageChange={log.setPage}
      />
    </div>
  );
}
