import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from '@/shared/lib/i18n';
import { useEnvironments } from '@/entities/environment';
import { useRecentReleases } from '@/entities/release';
import {
  RecentReleasesTable,
  RecentReleasesFilters,
  useRecentReleasesListState,
  ReleasesPagination
} from '@/features/releases-recent';
import type { StubDeploymentsMap } from '@/features/project/releases';

const PAGE_SIZE = 20;

function getStubKey(releaseId: string, environmentId: string): string {
  return `${releaseId}:${environmentId}`;
}

export function ReleasesPage() {
  const { t } = useTranslation();
  const [stubDeployments, setStubDeployments] = useState<StubDeploymentsMap>({});
  const {
    searchInput,
    setSearchInput,
    currentPage,
    setCurrentPage,
    tagIdsFilter,
    setTagIdsFilter,
    queryParams
  } = useRecentReleasesListState(PAGE_SIZE);

  const recentQuery = useRecentReleases(queryParams);
  const environmentsQuery = useEnvironments();

  const columnEnvironments = useMemo(() => {
    const list = environmentsQuery.data ?? [];
    return [...list].sort((a, b) => a.position - b.position);
  }, [environmentsQuery.data]);

  const environmentsById = useMemo(
    () => new Map((environmentsQuery.data ?? []).map((e) => [e.id, e] as const)),
    [environmentsQuery.data]
  );

  const handleDeploy = useCallback((releaseId: string, environmentId: string) => {
    setStubDeployments((prev) => ({
      ...prev,
      [getStubKey(releaseId, environmentId)]: {
        status: 'success',
        deployedAt: new Date().toISOString()
      }
    }));
  }, []);

  const items = recentQuery.data?.items ?? [];
  const totalPages = recentQuery.data?.totalPages ?? 0;
  const total = recentQuery.data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('pages.releases.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('pages.releases.subtitle')}</p>
      </div>

      <RecentReleasesFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        tagIdsFilter={tagIdsFilter}
        onTagIdsChange={setTagIdsFilter}
      />

      <RecentReleasesTable
        items={items}
        columnEnvironments={columnEnvironments}
        environmentsById={environmentsById}
        isLoading={recentQuery.isLoading}
        stubDeployments={stubDeployments}
        onDeploy={handleDeploy}
      />

      <ReleasesPagination
        rangeTranslationKey="pages.releases.pagination.range"
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
