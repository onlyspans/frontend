import { Link } from 'react-router-dom';
import type { Environment } from '@/entities/environment';
import { useTranslation } from '@/shared/lib/i18n';
import { cn } from '@/shared/lib/utils';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { dashboardListRowClassName } from '../lib/dashboard-bento-utils';
import { ScrollArea } from '@/shared/ui/scroll-area';

export type DashboardEnvironmentsTileProps = {
  className?: string;
  environments: Environment[];
  isLoading: boolean;
  isError: boolean;
};

export function DashboardEnvironmentsTile({
  className,
  environments,
  isLoading,
  isError
}: DashboardEnvironmentsTileProps) {
  const { t } = useTranslation();
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t('pages.dashboard.cards.environments.title')}</CardTitle>
        <CardAction>
          <Link
            to="/environments"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('pages.dashboard.viewAll')}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-destructive text-sm py-2">{t('pages.dashboard.cards.environments.error')}</p>
        ) : environments.length === 0 ? (
          <p className="text-muted-foreground text-sm py-2">{t('pages.dashboard.cards.environments.empty')}</p>
        ) : (
          <ScrollArea className="max-h-44 overflow-y-auto">
            <ul className="space-y-0">
              {environments.map((env) => (
                <li key={env.id}>
                  <Link to="/environments" className={dashboardListRowClassName()}>
                    {env.color ? (
                      <span
                        className="size-2.5 shrink-0 rounded-full border border-border/60"
                        style={{ backgroundColor: env.color }}
                        aria-hidden
                      />
                    ) : (
                      <span className="size-2.5 shrink-0 rounded-full bg-muted" aria-hidden />
                    )}
                    <span className="min-w-0 flex-1 truncate">{env.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
