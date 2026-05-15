import { useMemo, useState, useCallback } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import type { Project, ProjectEnvironmentRef } from '@/entities/project';
import { useEnvironments } from '@/entities/environment';
import type { ProcessResponse, DeploymentResponse } from '@/entities/process';
import { processApi, processQueryKeys } from '@/entities/process';
import type { Release } from '@/entities/release';
import {
  DeployProcessDrawer,
  useReleasesList,
  ReleasesTable,
  ReleasesPagination,
  type ReleaseProcessesMap,
  type StubDeploymentsMap
} from '@/features/project/releases';
import { useTranslation } from '@/shared/lib/i18n';

function getStubKey(releaseId: string, environmentId: string): string {
  return `${releaseId}:${environmentId}`;
}

export function ProjectReleasesTab() {
  const { project } = useOutletContext<{ project: Project }>();
  const { t } = useTranslation();
  const [stubDeployments, setStubDeployments] = useState<StubDeploymentsMap>({});
  const [deployContext, setDeployContext] = useState<{
    release: Release;
    environment: ProjectEnvironmentRef;
    process: ProcessResponse;
    deploymentId?: string;
  } | null>(null);
  const environmentsQuery = useEnvironments();

  const environmentsById = useMemo(
    () => new Map((environmentsQuery.data ?? []).map((env) => [env.id, env] as const)),
    [environmentsQuery.data]
  );

  const {
    releases,
    total,
    totalPages,
    currentPage,
    pageSize,
    setCurrentPage,
    isLoading
  } = useReleasesList(project.id);

  const handleDeploymentResult = useCallback((result: DeploymentResponse) => {
    if (!deployContext) return;
    const isSuccess = result.status === 'Completed';
    const isFailed = ['Failed', 'Cancelled', 'RolledBack'].includes(result.status);
    if (!isSuccess && !isFailed) return;

    setStubDeployments((prev) => ({
      ...prev,
      [getStubKey(deployContext.release.id, deployContext.environment.id)]: {
        status: isSuccess ? 'success' : 'failed',
        deployedAt: new Date().toISOString(),
        deploymentId: result.deploymentId
      }
    }));
  }, [deployContext]);

  const sortedEnvironments = useMemo(
    () => {
      const environments: ProjectEnvironmentRef[] =
        project.environments?.length
          ? project.environments
          : (project.environmentIds ?? [])
              .map((id) => environmentsById.get(id))
              .filter(Boolean)
              .map((env) => ({
                id: env!.id,
                name: env!.name,
                description: env!.description,
                color: env!.color,
                position: env!.position
              }));

      return [...environments].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    },
    [environmentsById, project.environmentIds, project.environments]
  );

  const processQueryInputs = useMemo(
    () =>
      releases.flatMap((release) =>
        sortedEnvironments.map((environment) => ({
          key: getStubKey(release.id, environment.id),
          projectId: project.id,
          environmentId: environment.id,
          releaseVersion: release.version
        }))
      ),
    [project.id, releases, sortedEnvironments]
  );

  const processQueries = useQueries({
    queries: processQueryInputs.map((input) => {
      const params = {
        environmentId: input.environmentId,
        releaseVersion: input.releaseVersion,
        fallbackToLatestInEnvironment: true
      };

      return {
        queryKey: processQueryKeys.list(input.projectId, params),
        queryFn: () => processApi.getListByProject(input.projectId, params),
        enabled: !!input.projectId && !!input.environmentId && !!input.releaseVersion,
        staleTime: 30 * 1000
      };
    })
  });

  const releaseProcesses = useMemo<ReleaseProcessesMap>(() => {
    const map: ReleaseProcessesMap = {};
    processQueryInputs.forEach((input, index) => {
      const query = processQueries[index];
      map[input.key] = {
        process: query.data?.[0],
        isLoading: query.isLoading,
        isError: query.isError
      };
    });
    return map;
  }, [processQueries, processQueryInputs]);

  return (
    <>
      <h2 className="text-lg font-semibold">{t('project.releases.title')}</h2>
      <ReleasesTable
        releases={releases}
        isLoading={isLoading}
        environments={sortedEnvironments}
        stubDeployments={stubDeployments}
        releaseProcesses={releaseProcesses}
        onDeploy={(release, environment, process, deploymentId) => {
          setDeployContext({ release, environment, process, deploymentId });
        }}
      />
      <ReleasesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
      <DeployProcessDrawer
        project={project}
        context={deployContext}
        open={deployContext != null}
        onOpenChange={(open) => {
          if (!open) setDeployContext(null);
        }}
        onDeploymentResult={handleDeploymentResult}
      />
    </>
  );
}
