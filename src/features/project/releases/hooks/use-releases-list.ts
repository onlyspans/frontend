import { useState } from 'react';
import { useReleases } from '@/entities/release';
import type { Release } from '@/entities/release';

const PAGE_SIZE = 10;

export function useReleasesList(projectId: string) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useReleases(projectId, {
    page: currentPage,
    pageSize: PAGE_SIZE
  });

  const releases: Release[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  return {
    releases,
    total,
    totalPages,
    currentPage,
    pageSize: PAGE_SIZE,
    setCurrentPage,
    isLoading
  };
}
