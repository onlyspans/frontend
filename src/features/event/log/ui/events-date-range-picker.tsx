import { useMemo } from 'react';
import { format, subDays, subHours, startOfDay, endOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Field, FieldLabel } from '@/shared/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/shared/ui/popover';
import { useTranslation } from '@/shared/lib/i18n';
import { cn } from '@/shared/lib/utils';

type Preset = '12h' | '24h' | '7d' | '30d';

const presetButtons: Array<{ value: Preset; labelKey: string }> = [
  { value: '12h', labelKey: 'pages.events.filters.presets.last12h' },
  { value: '24h', labelKey: 'pages.events.filters.presets.last24h' },
  { value: '7d', labelKey: 'pages.events.filters.presets.last7d' },
  { value: '30d', labelKey: 'pages.events.filters.presets.last30d' }
];

function toDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function presetToRange(preset: Preset): { from: Date; to: Date } {
  const now = new Date();
  switch (preset) {
    case '12h':
      return { from: subHours(now, 12), to: now };
    case '24h':
      return { from: subHours(now, 24), to: now };
    case '7d':
      return { from: subDays(now, 7), to: now };
    case '30d':
      return { from: subDays(now, 30), to: now };
    default:
      return { from: subHours(now, 24), to: now };
  }
}

interface EventsDateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onChange: (value: { startDate: string; endDate: string }) => void;
  className?: string;
}

export function EventsDateRangePicker({
  startDate,
  endDate,
  onChange,
  className
}: EventsDateRangePickerProps) {
  const { t } = useTranslation();

  const selectedRange: DateRange | undefined = useMemo(() => {
    const from = toDate(startDate);
    const to = toDate(endDate);
    if (!from && !to) return undefined;
    return { from, to };
  }, [startDate, endDate]);

  const setPreset = (preset: Preset) => {
    const range = presetToRange(preset);
    onChange({
      startDate: range.from.toISOString(),
      endDate: range.to.toISOString()
    });
  };

  const setRange = (range: DateRange | undefined) => {
    if (!range?.from) {
      onChange({ startDate: '', endDate: '' });
      return;
    }

    const from = startOfDay(range.from);
    const to = range.to ? endOfDay(range.to) : endOfDay(range.from);

    onChange({
      startDate: from.toISOString(),
      endDate: to.toISOString()
    });
  };

  return (
    <Field className={cn('w-full', className)}>
      <FieldLabel htmlFor="events-date-range">{t('pages.events.filters.dateRange')}</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="events-date-range"
            className="justify-start px-2.5 font-normal w-full"
          >
            <CalendarIcon className="mr-2 size-4" />
            {selectedRange?.from ? (
              selectedRange.to ? (
                <>
                  {format(selectedRange.from, 'LLL dd, y')} - {format(selectedRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(selectedRange.from, 'LLL dd, y')
              )
            ) : (
              <span>{t('pages.events.filters.pickDateRange')}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="border-b p-2 flex flex-wrap gap-2 justify-between">
            <div className="flex flex-wrap gap-2">
              {presetButtons.map((preset) => (
                <Button
                  key={preset.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreset(preset.value)}
                >
                  {t(preset.labelKey as never)}
                </Button>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange({ startDate: '', endDate: '' })}
            >
              {t('pages.events.filters.clearDateRange')}
            </Button>
          </div>
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={setRange}
            numberOfMonths={2}
            defaultMonth={selectedRange?.from}
            className="p-3"
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
