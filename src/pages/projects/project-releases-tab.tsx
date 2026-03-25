import { useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Project, ProjectEnvironmentRef } from '@/entities/project';
import { useEnvironments } from '@/entities/environment';
import {
  useReleasesList,
  ReleasesTable,
  ReleasesPagination,
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
  const environmentsQuery = useEnvironments();

  const environmentsById = new Map(
    (environmentsQuery.data ?? []).map((env) => [env.id, env] as const)
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

  const handleDeploy = useCallback((releaseId: string, environmentId: string) => {
    setStubDeployments((prev) => ({
      ...prev,
      [getStubKey(releaseId, environmentId)]: {
        status: 'success',
        deployedAt: new Date().toISOString()
      }
    }));
  }, []);

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
            position: env!.position
          }));

  return (
    <>
      <h2 className="text-lg font-semibold">{t('project.releases.title')}</h2>
      <ReleasesTable
        releases={releases}
        isLoading={isLoading}
        environments={environments}
        stubDeployments={stubDeployments}
        onDeploy={handleDeploy}
      />
      <ReleasesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
