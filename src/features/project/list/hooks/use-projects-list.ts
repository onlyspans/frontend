import { useState, useMemo } from 'react';
import { useProjects } from '@/entities/project';
import { useLifecycles } from '@/entities/lifecycle';

const ITEMS_PER_PAGE = 10;

export function useProjectsList() {
  const { data: projects = [], isLoading } = useProjects();
  const { data: lifecycles = [] } = useLifecycles();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const lifecycleMap = useMemo(() => {
    return new Map(lifecycles.map((lc) => [lc.id, lc]));
  }, [lifecycles]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return projects;
    }

    const query = searchQuery.toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        lifecycleMap.get(project.lifecycleId)?.name.toLowerCase().includes(query)
    );
  }, [projects, searchQuery, lifecycleMap]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return {
    projects: paginatedProjects,
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
  };
}

