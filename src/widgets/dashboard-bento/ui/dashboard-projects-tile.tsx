import { Link } from 'react-router-dom';
import type { Project } from '@/entities/project';
import { ProjectIcon } from '@/entities/project';
import { useTranslation } from '@/shared/lib/i18n';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { dashboardListRowClassName } from '../lib/dashboard-bento-utils';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { getContrastTextColor } from '@/shared/lib/color/get-contrast-text-color.ts';

export type DashboardProjectsTileProps = {
  className?: string;
  projects: Project[];
  isLoading: boolean;
  isError: boolean;
};

export function DashboardProjectsTile({ className, projects, isLoading, isError }: DashboardProjectsTileProps) {
  const { t } = useTranslation();
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t('pages.dashboard.cards.projects.title')}</CardTitle>
        <CardAction>
          <Link
            to="/projects"
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
          <p className="text-destructive text-sm py-2">{t('pages.dashboard.cards.projects.error')}</p>
        ) : projects.length === 0 ? (
          <p className="text-muted-foreground text-sm py-2">{t('pages.dashboard.cards.projects.empty')}</p>
        ) : (
          <ScrollArea className="max-h-44 overflow-y-auto">
            <ul className="space-y-0">
              {projects.map((p) => {
                if (p.status !== 'active') return null;

                return <li key={p.id}>
                  <Link to={`/projects/${p.slug}`} className={dashboardListRowClassName()}>
                    <ProjectIcon project={p} size="sm" />
                    <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                    {p.tags?.length ? p.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="text-xs font-normal"
                        style={
                          tag.color
                            ? {
                              backgroundColor: tag.color,
                              color: getContrastTextColor(tag.color),
                              borderColor: 'transparent'
                            }
                            : undefined
                        }
                      >
                        {tag.name}
                      </Badge>
                    )) : null}
                  </Link>
                </li>;
              })}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
