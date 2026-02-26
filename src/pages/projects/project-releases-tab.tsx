import { useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Project } from '@/entities/project';
import type { LifecycleStage } from '@/entities/project';
import {
  useReleasesList,
  ReleasesTable,
  ReleasesPagination,
  type StubDeploymentsMap
} from '@/features/project/releases';
import { useTranslation } from '@/shared/lib/i18n';

function getStubKey(releaseId: string, stage: LifecycleStage): string {
  return `${releaseId}:${stage}`;
}

export function ProjectReleasesTab() {
  const { project } = useOutletContext<{ project: Project }>();
  const { t } = useTranslation();
  const [stubDeployments, setStubDeployments] = useState<StubDeploymentsMap>({});

  const {
    releases,
    total,
    totalPages,
    currentPage,
    pageSize,
    setCurrentPage,
    isLoading
  } = useReleasesList(project.id);

  const handleDeploy = useCallback((releaseId: string, stage: LifecycleStage) => {
    setStubDeployments((prev) => ({
      ...prev,
      [getStubKey(releaseId, stage)]: {
        status: 'success',
        deployedAt: new Date().toISOString()
      }
    }));
  }, []);

  const stages = project.lifecycleStages ?? [];

  return (
    <>
      <h2 className="text-lg font-semibold">{t('project.releases.title')}</h2>
      <ReleasesTable
        releases={releases}
        isLoading={isLoading}
        lifecycleStages={stages}
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
