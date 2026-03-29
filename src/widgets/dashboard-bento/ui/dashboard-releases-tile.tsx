import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Environment } from '@/entities/environment';
import type { RecentReleaseItem } from '@/entities/release';
import { RecentReleasesTable } from '@/features/releases-recent';
import type { StubDeploymentsMap } from '@/features/project/releases';
import { useTranslation } from '@/shared/lib/i18n';
import { cn } from '@/shared/lib/utils';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

function getStubKey(releaseId: string, environmentId: string): string {
  return `${releaseId}:${environmentId}`;
}

export type DashboardReleasesTileProps = {
  className?: string;
  items: RecentReleaseItem[];
  columnEnvironments: Environment[];
  environmentsById: Map<string, Environment>;
  isLoading: boolean;
  isError: boolean;
};

export function DashboardReleasesTile({
  className,
  items,
  columnEnvironments,
  environmentsById,
  isLoading,
  isError
}: DashboardReleasesTileProps) {
  const { t } = useTranslation();
  const [stubDeployments, setStubDeployments] = useState<StubDeploymentsMap>({});

  const handleDeploy = useCallback((releaseId: string, environmentId: string) => {
    setStubDeployments((prev) => ({
      ...prev,
      [getStubKey(releaseId, environmentId)]: {
        status: 'success',
        deployedAt: new Date().toISOString()
      }
    }));
  }, []);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t('pages.dashboard.cards.releases.title')}</CardTitle>
        <CardAction>
          <Link
            to="/releases"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('pages.dashboard.viewAll')}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isError ? (
          <p className="text-destructive text-sm py-2">{t('pages.dashboard.cards.releases.error')}</p>
        ) : (
          <div className="max-h-[min(320px,42vh)] w-full overflow-auto rounded-md">
            <div className="min-w-max">
              <RecentReleasesTable
                className='border-none'
                items={items}
                columnEnvironments={columnEnvironments}
                environmentsById={environmentsById}
                isLoading={isLoading}
                stubDeployments={stubDeployments}
                onDeploy={handleDeploy}
                maxRows={5}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
