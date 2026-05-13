import { Link } from 'react-router-dom';
import type { Event } from '@/entities/event';
import { useTranslation } from '@/shared/lib/i18n';
import { cn } from '@/shared/lib/utils';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { dashboardListRowClassName, formatDashboardDateTimeShort } from '../lib/dashboard-bento-utils';
import { ScrollArea } from '@/shared/ui/scroll-area';

export type DashboardEventsTileProps = {
  className?: string;
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  invalidDateLabel: string;
};

export function DashboardEventsTile({
  className,
  events,
  isLoading,
  isError,
  invalidDateLabel
}: DashboardEventsTileProps) {
  const { t } = useTranslation();
  return (
    <Card className={cn('md:min-h-[280px]', className)}>
      <CardHeader>
        <CardTitle>{t('pages.dashboard.cards.events.title')}</CardTitle>
        <CardAction>
          <Link
            to="/events"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('pages.dashboard.viewAll')}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className={cn('min-h-0 flex-1 px-2')}>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-destructive text-sm py-2">{t('pages.dashboard.cards.events.error')}</p>
        ) : events.length === 0 ? (
          <p className="text-muted-foreground text-sm py-2">{t('pages.dashboard.cards.events.empty')}</p>
        ) : (
          <ScrollArea className="max-h-[510px] overflow-y-auto">
            <ul className="space-y-0">
              {events.map((ev) => {
                const label = ev.entityName?.trim() || ev.entityId;
                return (
                  <li key={ev.id}>
                    <Link to="/events" className={cn(dashboardListRowClassName(), 'items-start gap-2')}>
                      <time
                        className="text-muted-foreground shrink-0 tabular-nums text-xs pt-0.5 w-[7.5rem]"
                        dateTime={ev.timestamp}
                      >
                        {formatDashboardDateTimeShort(ev.timestamp, invalidDateLabel)}
                      </time>
                      <span className="min-w-0 flex-1">
                        <span className="text-foreground font-medium block truncate">{ev.action}</span>
                        <span className="text-muted-foreground text-xs block truncate">{label}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
