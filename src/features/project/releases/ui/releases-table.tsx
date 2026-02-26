import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Check, CircleX } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';
import type { TranslationKey } from '@/shared/lib/i18n';
import type { Release } from '@/entities/release';
import type { LifecycleStage } from '@/entities/project';

const TABLE_STAGE_KEYS: Record<LifecycleStage, TranslationKey> = {
  development: 'project.releases.table.dev',
  testing: 'project.releases.table.test',
  staging: 'project.releases.table.stage',
  production: 'project.releases.table.prod'
};

export type StubDeployment = {
  status: 'success' | 'failed';
  deployedAt: string;
};

export type StubDeploymentsMap = Record<string, StubDeployment>;

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(iso));
}

interface ReleasesTableProps {
  releases: Release[];
  isLoading: boolean;
  lifecycleStages: LifecycleStage[];
  stubDeployments: StubDeploymentsMap;
  onDeploy: (releaseId: string, stage: LifecycleStage) => void;
}

function getStubKey(releaseId: string, stage: LifecycleStage): string {
  return `${releaseId}:${stage}`;
}

/** Можно ли деплоить на этап: только если предыдущий этап в цепочке уже задеплоен. */
function canDeployStage(
  releaseId: string,
  stageIndex: number,
  lifecycleStages: LifecycleStage[],
  stubDeployments: StubDeploymentsMap
): boolean {
  if (stageIndex === 0) return true;
  const prevStage = lifecycleStages[stageIndex - 1];
  const prevKey = getStubKey(releaseId, prevStage);
  return !!stubDeployments[prevKey];
}

export function ReleasesTable({
  releases,
  isLoading,
  lifecycleStages,
  stubDeployments,
  onDeploy
}: ReleasesTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    const colCount = 2 + lifecycleStages.length;
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('project.releases.table.version')}</TableHead>
              {lifecycleStages.map((stage) => (
                <TableHead key={stage}>{t(TABLE_STAGE_KEYS[stage])}</TableHead>
              ))}
              <TableHead>{t('project.releases.table.createdAt')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={colCount} className="text-center py-8 text-muted-foreground">
                {t('project.releases.table.loading')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (releases.length === 0) {
    const colCount = 2 + lifecycleStages.length;
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('project.releases.table.version')}</TableHead>
              {lifecycleStages.map((stage) => (
                <TableHead key={stage}>{t(TABLE_STAGE_KEYS[stage])}</TableHead>
              ))}
              <TableHead>{t('project.releases.table.createdAt')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={colCount} className="text-center py-8 text-muted-foreground">
                {t('project.releases.table.noReleases')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('project.releases.table.version')}</TableHead>
            {lifecycleStages.map((stage) => (
              <TableHead key={stage}>{t(TABLE_STAGE_KEYS[stage])}</TableHead>
            ))}
            <TableHead>{t('project.releases.table.createdAt')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {releases.map((release) => (
            <TableRow key={release.id}>
              <TableCell className="font-medium">{release.version}</TableCell>
              {lifecycleStages.map((stage, stageIndex) => {
                const key = getStubKey(release.id, stage);
                const stub = stubDeployments[key];
                const deployAllowed = canDeployStage(
                  release.id,
                  stageIndex,
                  lifecycleStages,
                  stubDeployments
                );
                if (stub) {
                  return (
                    <TableCell key={stage} className="text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Button
                          variant={stub.status === 'success' ? 'default' : 'destructive'}
                          size="icon"
                        >
                          {stub.status === 'success' ? (
                            <Check className="h-4 w-4" aria-hidden />
                          ) : (
                            <CircleX className="h-4 w-4" aria-hidden />
                          )}
                        </Button>
                        {formatDateTime(stub.deployedAt)}
                      </span>
                    </TableCell>
                  );
                }
                return (
                  <TableCell key={stage}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!deployAllowed}
                      title={
                        !deployAllowed
                          ? t('project.releases.table.deployDisabledHint')
                          : undefined
                      }
                      onClick={() => deployAllowed && onDeploy(release.id, stage)}
                    >
                      {t('project.releases.table.deploy')}
                    </Button>
                  </TableCell>
                );
              })}
              <TableCell className="text-muted-foreground">
                {formatDateTime(release.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
