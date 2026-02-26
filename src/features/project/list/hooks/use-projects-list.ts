import { useState } from 'react';
import { useProjectsList as useProjectsListQuery } from '@/entities/project';
import type { ProjectStatus, ProjectSortField, SortOrder } from '@/entities/project';

const ITEMS_PER_PAGE = 20;
const DEFAULT_SORT: ProjectSortField = 'createdAt';
const DEFAULT_ORDER: SortOrder = 'desc';

export function useProjectsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [tagIdsFilter, setTagIdsFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<ProjectSortField>(DEFAULT_SORT);
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_ORDER);

  const { data, isLoading } = useProjectsListQuery({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    search: searchQuery || undefined,
    status: statusFilter || undefined,
    tagIds: tagIdsFilter.length > 0 ? tagIdsFilter : undefined,
    sortBy,
    sortOrder
  });

  const projects = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const setStatusFilterAndResetPage = (value: ProjectStatus | '') => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const setTagIdsFilterAndResetPage = (ids: string[]) => {
    setTagIdsFilter(ids);
    setCurrentPage(1);
  };

  const handleSort = (field: ProjectSortField) => {
    setSortBy((prev) => {
      if (prev === field) {
        setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortOrder('asc');
      return field;
    });
  };

  return {
    projects,
    isLoading,
    searchQuery,
    currentPage,
    totalPages,
    total: data?.total ?? 0,
    handleSearchChange,
    setCurrentPage,
    statusFilter,
    setStatusFilter: setStatusFilterAndResetPage,
    tagIdsFilter,
    setTagIdsFilter: setTagIdsFilterAndResetPage,
    sortBy,
    sortOrder,
    onSort: handleSort
  };
}
