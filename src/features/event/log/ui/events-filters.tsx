import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useTranslation } from '@/shared/lib/i18n';
import type { EventsLogFilters, EventsSortField, SortOrder } from '../hooks/use-events-log';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { EventsDateRangePicker } from './events-date-range-picker';

const pageSizeOptions = [20, 50, 100, 500, 1000] as const;

const sortFieldOptions: Array<{ value: EventsSortField; labelKey: string }> = [
  { value: 'timestamp', labelKey: 'pages.events.filters.sort.timestamp' },
  { value: 'entity_id', labelKey: 'pages.events.filters.sort.entityId' },
  { value: 'entity_name', labelKey: 'pages.events.filters.sort.entityName' },
  { value: 'action', labelKey: 'pages.events.filters.sort.action' },
  { value: 'user_id', labelKey: 'pages.events.filters.sort.userId' },
  { value: 'tenant', labelKey: 'pages.events.filters.sort.tenant' }
];

interface EventsFiltersProps {
  filters: EventsLogFilters;
  onChange: (patch: Partial<EventsLogFilters>) => void;
  onClear: () => void;
  sortBy: EventsSortField;
  sortOrder: SortOrder;
  onSortByChange: (field: EventsSortField) => void;
  onSortOrderChange: (order: SortOrder) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export function EventsFilters({
                                filters,
                                onChange,
                                onClear,
                                sortBy,
                                sortOrder,
                                onSortByChange,
                                onSortOrderChange,
                                pageSize,
                                onPageSizeChange
                              }: EventsFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <Input
          placeholder={t('pages.events.filters.entityId')}
          value={filters.entityId}
          onChange={(e) => onChange({ entityId: e.target.value })}
        />
        <Input
          placeholder={t('pages.events.filters.entityName')}
          value={filters.entityName}
          onChange={(e) => onChange({ entityName: e.target.value })}
        />
        <Input
          placeholder={t('pages.events.filters.action')}
          value={filters.action}
          onChange={(e) => onChange({ action: e.target.value })}
        />
        <Input
          placeholder={t('pages.events.filters.userId')}
          value={filters.userId}
          onChange={(e) => onChange({ userId: e.target.value })}
        />
        <Input
          placeholder={t('pages.events.filters.tenant')}
          value={filters.tenant}
          onChange={(e) => onChange({ tenant: e.target.value })}
        />

        <EventsDateRangePicker
          startDate={filters.startDate}
          endDate={filters.endDate}
          onChange={({ startDate, endDate }) => onChange({ startDate, endDate })}
          className="md:col-span-2 lg:col-span-3"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={sortBy} onValueChange={(v) => onSortByChange(v as EventsSortField)}>
            <SelectTrigger className="w-[210px]">
              <SelectValue placeholder={t('pages.events.filters.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              {sortFieldOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.labelKey as never)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(v) => onSortOrderChange(v as SortOrder)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t('pages.events.filters.sortOrder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">{t('pages.events.filters.sort.desc')}</SelectItem>
              <SelectItem value="asc">{t('pages.events.filters.sort.asc')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t('pages.events.filters.pageSize')} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {t('pages.events.filters.pageSizeValue', { value: s })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClear}>
            {t('pages.events.filters.clear')}
          </Button>
        </div>
      </div>
    </div>
  );
}
