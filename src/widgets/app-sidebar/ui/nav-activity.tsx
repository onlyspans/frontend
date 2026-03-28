import { formatDistanceToNow } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecentEventsPreview } from '@/entities/event';
import { useTranslation } from '@/shared/lib/i18n';
import { Badge } from '@/shared/ui/badge';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/shared/ui/sidebar';
import { Skeleton } from '@/shared/ui/skeleton';
import { useMemo } from 'react';

const SKELETON_ROWS = 5;
const EVENTS_PATH = '/events';

export type NavActivityItem = {
  id: string;
  title: string;
  subtitle?: string;
  timeLabel: string;
  to: string;
};

export function NavActivity() {
  const { t, currentLanguage } = useTranslation();
  const { data, isPending, isError } = useRecentEventsPreview(5);

  const items = useMemo((): NavActivityItem[] => {
    const events = data?.events ?? [];
    const locale = currentLanguage === 'ru' ? ru : enUS;
    return events.map((e) => ({
      id: e.id,
      title: e.action,
      subtitle: e.entityName?.trim() ? e.entityName : undefined,
      timeLabel: formatDistanceToNow(new Date(e.timestamp), {
        addSuffix: true,
        locale
      }),
      to: EVENTS_PATH
    }));
  }, [data, currentLanguage]);

  const show = !isError && (isPending || items.length > 0);
  if (!show) return null;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t('sidebar.recentActivity.title')}</SidebarGroupLabel>
      <SidebarMenu>
        {isPending
          ? Array.from({ length: SKELETON_ROWS }, (_, i) => (
              <SidebarMenuItem key={`recent-activity-skeleton-${i}`}>
                <SidebarMenuButton
                  disabled
                  className="h-14 items-start pointer-events-none"
                >
                  <div className="flex w-full flex-1 flex-col gap-1.5 min-w-0 justify-start text-left">
                    <div className="flex w-full items-center justify-start gap-2 min-w-0">
                      <Skeleton className="h-3.5 min-w-0 flex-1 max-w-[42%]" />
                      <Skeleton className="h-5 w-[7.5rem] shrink-0 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-28" />
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          : items.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild className="items-start">
                  <Link
                    to={item.to}
                    className="group/activity flex w-full min-h-12 flex-col items-stretch gap-1! py-2 text-left"
                  >
                    <div className="flex w-full min-w-0 items-center justify-start gap-2">
                      <span
                        className="min-w-0 truncate text-sm font-medium leading-tight"
                        title={item.title}
                      >
                        {item.title}
                      </span>
                      {item.subtitle ? (
                        <Badge
                          variant="secondary"
                          className="max-w-[min(13rem,58%)] shrink px-2 py-0 font-normal"
                          title={item.subtitle}
                        >
                          <span className="block min-w-0 truncate">{item.subtitle}</span>
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex w-full min-w-0 items-center justify-start gap-1.5">
                      <Clock className="size-3 shrink-0 text-muted-foreground" />
                      <span
                        className="min-w-0 truncate text-xs text-muted-foreground"
                        title={item.timeLabel}
                      >
                        {item.timeLabel}
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
