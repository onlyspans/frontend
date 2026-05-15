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
import type { ProcessResponse } from '@/entities/process';

export type StubDeployment = {
  status: 'success' | 'failed';
  deployedAt: string;
  deploymentId?: string;
};

export type StubDeploymentsMap = Record<string, StubDeployment>;

export interface ReleaseProcessCell {
  process?: ProcessResponse;
  isLoading?: boolean;
  isError?: boolean;
}

export type ReleaseProcessesMap = Record<string, ReleaseProcessCell>;

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
  releaseProcesses: ReleaseProcessesMap;
  onDeploy: (
    release: Release,
    environment: ProjectEnvironmentRef,
    process: ProcessResponse,
    deploymentId?: string
  ) => void;
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
  releaseProcesses,
  onDeploy
}: ReleasesTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    const colCount = 2 + environments.length;
    return (
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-secondary">
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
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-secondary">
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
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader className="bg-secondary">
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
                const processCell = releaseProcesses[key];
                const process = processCell?.process;
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
                          disabled={!process}
                          aria-label={
                            stub.status === 'success'
                              ? t('project.releases.table.deployedSuccess')
                              : t('project.releases.table.deployedFailed')
                          }
                          title={
                            process
                              ? t('project.releases.table.openDeploymentDetails')
                              : t('project.releases.table.noProcessHint')
                          }
                          onClick={() => {
                            if (process) onDeploy(release, env, process, stub.deploymentId);
                          }}
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
                      disabled={!deployAllowed || processCell?.isLoading || !process}
                      title={
                        !deployAllowed
                          ? t('project.releases.table.deployDisabledHint')
                          : processCell?.isLoading
                            ? t('project.releases.table.processLoadingHint')
                            : !process
                              ? t('project.releases.table.noProcessHint')
                              : undefined
                      }
                      onClick={() => {
                        if (deployAllowed && process) onDeploy(release, env, process);
                      }}
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
