import { useState } from 'react';
import { useProjectsList as useProjectsListQuery } from '@/entities/project';

const ITEMS_PER_PAGE = 10;

export function useProjectsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useProjectsListQuery({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    search: searchQuery || undefined
  });

  const projects = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return {
    projects,
    isLoading,
    searchQuery,
    currentPage,
    totalPages,
    total: data?.total ?? 0,
    handleSearchChange,
    setCurrentPage
  };
}

