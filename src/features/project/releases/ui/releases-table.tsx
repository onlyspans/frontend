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
import type { Release } from '@/entities/release';
import type { ProjectEnvironmentRef } from '@/entities/project';

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
  environments: ProjectEnvironmentRef[];
  stubDeployments: StubDeploymentsMap;
  onDeploy: (releaseId: string, environmentId: string) => void;
}

function getStubKey(releaseId: string, environmentId: string): string {
  return `${releaseId}:${environmentId}`;
}

/** Можно ли деплоить на этап: только если предыдущий этап в цепочке уже задеплоен. */
function canDeployStage(
  releaseId: string,
  stageIndex: number,
  environments: ProjectEnvironmentRef[],
  stubDeployments: StubDeploymentsMap
): boolean {
  if (stageIndex === 0) return true;
  const prevEnv = environments[stageIndex - 1];
  const prevKey = getStubKey(releaseId, prevEnv.id);
  return stubDeployments[prevKey]?.status === 'success';
}

export function ReleasesTable({
  releases,
  isLoading,
  environments,
  stubDeployments,
  onDeploy
}: ReleasesTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    const colCount = 2 + environments.length;
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('project.releases.table.version')}</TableHead>
              {environments.map((env) => (
                <TableHead key={env.id}>{env.name}</TableHead>
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
    const colCount = 2 + environments.length;
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('project.releases.table.version')}</TableHead>
              {environments.map((env) => (
                <TableHead key={env.id}>{env.name}</TableHead>
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
            {environments.map((env) => (
              <TableHead key={env.id}>{env.name}</TableHead>
            ))}
            <TableHead>{t('project.releases.table.createdAt')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {releases.map((release) => (
            <TableRow key={release.id}>
              <TableCell className="font-medium">{release.version}</TableCell>
              {environments.map((env, stageIndex) => {
                const key = getStubKey(release.id, env.id);
                const stub = stubDeployments[key];
                const deployAllowed = canDeployStage(
                  release.id,
                  stageIndex,
                  environments,
                  stubDeployments
                );
                if (stub) {
                  return (
                    <TableCell key={env.id} className="text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Button
                          variant={stub.status === 'success' ? 'default' : 'destructive'}
                          size="icon"
                          aria-label={
                            stub.status === 'success'
                              ? t('project.releases.table.deployedSuccess')
                              : t('project.releases.table.deployedFailed')
                          }
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
                  <TableCell key={env.id}>
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
                      onClick={() => deployAllowed && onDeploy(release.id, env.id)}
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
