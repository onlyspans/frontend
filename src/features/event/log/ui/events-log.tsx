import { useState } from 'react';
import { useTranslation } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/button';
import { Download } from 'lucide-react';
import { EventsFilters } from './events-filters';
import { EventsPagination } from './events-pagination';
import { EventsTable } from './events-table';
import { EventsExportModal } from './events-export-modal';
import { useEventsLog } from '../hooks/use-events-log';

export function EventsLog() {
  const { t } = useTranslation();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const log = useEventsLog();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{t('pages.events.log.title')}</h2>
          <p className="text-muted-foreground text-sm">{t('pages.events.log.subtitle')}</p>
        </div>
        <Button type="button" variant="outline" onClick={() => setIsExportOpen(true)}>
          <Download className="size-4 mr-2" />
          {t('pages.events.export.open')}
        </Button>
      </div>

      <EventsFilters
        filters={log.filters}
        onChange={log.setFilters}
        onClear={log.clearFilters}
        sortBy={log.sortBy}
        sortOrder={log.sortOrder}
        onSortByChange={log.setSortBy}
        onSortOrderChange={log.setSortOrder}
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

      <EventsExportModal
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        body={log.exportRequest}
      />
    </div>
  );
}
