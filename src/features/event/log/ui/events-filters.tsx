import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useTranslation } from '@/shared/lib/i18n';
import type { EventsLogFilters } from '../hooks/use-events-log';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { Field, FieldLabel } from '@/shared/ui/field';
import { EventsDateRangePicker } from './events-date-range-picker';

const pageSizeOptions = [20, 50, 100, 200, 500] as const;

interface EventsFiltersProps {
  filters: EventsLogFilters;
  onChange: (patch: Partial<EventsLogFilters>) => void;
  onClear: () => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export function EventsFilters({
  filters,
  onChange,
  onClear,
  pageSize,
  onPageSizeChange
}: EventsFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div>
        <h3 className="text-base font-semibold">{t('pages.events.filters.title')}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <Field>
          <FieldLabel htmlFor="events-filter-entity-id">{t('pages.events.filters.entityId')}</FieldLabel>
          <Input
            id="events-filter-entity-id"
            value={filters.entityId}
            onChange={(e) => onChange({ entityId: e.target.value })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="events-filter-entity-name">{t('pages.events.filters.entityName')}</FieldLabel>
          <Input
            id="events-filter-entity-name"
            value={filters.entityName}
            onChange={(e) => onChange({ entityName: e.target.value })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="events-filter-action">{t('pages.events.filters.action')}</FieldLabel>
          <Input
            id="events-filter-action"
            value={filters.action}
            onChange={(e) => onChange({ action: e.target.value })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="events-filter-user-id">{t('pages.events.filters.userId')}</FieldLabel>
          <Input
            id="events-filter-user-id"
            value={filters.userId}
            onChange={(e) => onChange({ userId: e.target.value })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="events-filter-tenant">{t('pages.events.filters.tenant')}</FieldLabel>
          <Input
            id="events-filter-tenant"
            value={filters.tenant}
            onChange={(e) => onChange({ tenant: e.target.value })}
          />
        </Field>

        <EventsDateRangePicker
          startDate={filters.startDate}
          endDate={filters.endDate}
          onChange={({ startDate, endDate }) => onChange({ startDate, endDate })}
          className="w-full"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex items-end gap-2">
          <Field className="w-[170px]">
            <FieldLabel htmlFor="events-page-size">{t('pages.events.filters.pageSize')}</FieldLabel>
          <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger id="events-page-size" className="w-full">
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
          </Field>
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
