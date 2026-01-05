import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { useSpaceUrl } from '@/shared/hooks/use-space-url';
import {
  useProjectsList,
  ProjectsSearch,
  ProjectsTable,
  ProjectsPagination
} from '@/features/project/list';

export function ProjectsPage() {
  const navigate = useNavigate();
  const { getSpaceUrl } = useSpaceUrl();
  const {
    projects,
    filteredProjects,
    isLoading,
    lifecycleMap,
    searchQuery,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    handleSearchChange,
    setCurrentPage
  } = useProjectsList();

  const handleProjectClick = (projectId: string) => {
    navigate(getSpaceUrl(`/projects/${projectId}`));
  };

  return (
    <div className="container space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all your projects
          </p>
        </div>
        <Button onClick={() => navigate(getSpaceUrl('/projects/create'))}>
          Create Project
        </Button>
      </div>

      <ProjectsSearch value={searchQuery} onChange={handleSearchChange} />

      <ProjectsTable
        projects={projects}
        isLoading={isLoading}
        lifecycleMap={lifecycleMap}
        onProjectClick={handleProjectClick}
      />

      <ProjectsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={filteredProjects.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
