import { Link } from 'react-router-dom';
import { useTranslation } from '@/shared/lib/i18n';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { dashboardListRowClassName, type DashboardFlatRelease } from '../lib/dashboard-bento-utils';

export type DashboardReleasesTileProps = {
  className?: string;
  flatReleases: DashboardFlatRelease[];
  showPlaceholder: boolean;
  isLoadingProjects: boolean;
  isErrorProjects: boolean;
};

export function DashboardReleasesTile({
  className,
  flatReleases,
  showPlaceholder,
  isLoadingProjects,
  isErrorProjects
}: DashboardReleasesTileProps) {
  const { t } = useTranslation();
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t('pages.dashboard.cards.releases.title')}</CardTitle>
        <CardAction>
          <Link
            to="/projects"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('pages.dashboard.viewAll')}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoadingProjects ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : isErrorProjects ? (
          <p className="text-destructive text-sm py-2">{t('pages.dashboard.cards.releases.error')}</p>
        ) : showPlaceholder ? (
          <div className="space-y-3 py-1">
            <CardDescription>{t('pages.dashboard.cards.releases.placeholder')}</CardDescription>
            <Link
              to="/projects"
              className="text-primary text-sm font-medium underline-offset-4 hover:underline inline-block"
            >
              {t('pages.dashboard.cards.releases.openProjects')}
            </Link>
          </div>
        ) : flatReleases.length === 0 ? (
          <p className="text-muted-foreground text-sm py-2">{t('pages.dashboard.cards.releases.empty')}</p>
        ) : (
          <ul className="space-y-0">
            {flatReleases.map(({ release, slug, projectName }) => (
              <li key={release.id}>
                <Link to={`/projects/${slug}/releases`} className={dashboardListRowClassName()}>
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-medium">{release.version}</span>
                    <span className="text-muted-foreground text-xs block truncate">{projectName}</span>
                  </span>
                  <Badge variant="outline" className="shrink-0 text-xs capitalize">
                    {release.status}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
