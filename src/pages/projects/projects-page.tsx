import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { useSpaceUrl } from '@/shared/hooks/use-space-url';
import { useTranslation } from '@/shared/lib/i18n';
import {
  useProjectsList,
  ProjectsSearch,
  ProjectsFilters,
  ProjectsTable,
  ProjectsPagination
} from '@/features/project/list';

export function ProjectsPage() {
  const navigate = useNavigate();
  const { getSpaceUrl } = useSpaceUrl();
  const { t } = useTranslation();
  const {
    projects,
    isLoading,
    searchQuery,
    currentPage,
    totalPages,
    total,
    handleSearchChange,
    setCurrentPage,
    statusFilter,
    setStatusFilter,
    tagIdsFilter,
    setTagIdsFilter,
    sortBy,
    sortOrder,
    onSort
  } = useProjectsList();

  const handleProjectClick = (projectSlug: string) => {
    navigate(getSpaceUrl(`/projects/${projectSlug}`));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('pages.projects.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('pages.projects.subtitle')}
          </p>
        </div>
        <Button onClick={() => navigate(getSpaceUrl('/projects/create'))}>
          {t('pages.projects.createProject')}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <ProjectsSearch className='w-full sm:w-1/3' value={searchQuery} onChange={handleSearchChange} />
        <ProjectsFilters
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          tagIdsFilter={tagIdsFilter}
          onTagIdsChange={setTagIdsFilter}
        />
      </div>

      <ProjectsTable
        projects={projects}
        isLoading={isLoading}
        onProjectClick={handleProjectClick}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={onSort}
      />

      <ProjectsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
