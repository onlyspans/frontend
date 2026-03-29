import { useState, useEffect } from 'react';
import type { RecentReleasesListParams } from '@/entities/release';

const DEBOUNCE_MS = 300;
const DEFAULT_PAGE_SIZE = 20;

export function useRecentReleasesListState(pageSize: number = DEFAULT_PAGE_SIZE) {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tagIdsFilter, setTagIdsFilter] = useState<string[]>([]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, tagIdsFilter]);

  const queryParams: RecentReleasesListParams = {
    page: currentPage,
    pageSize,
    search: debouncedSearch || undefined,
    tagIds: tagIdsFilter.length > 0 ? tagIdsFilter : undefined
  };

  return {
    searchInput,
    setSearchInput,
    currentPage,
    setCurrentPage,
    tagIdsFilter,
    setTagIdsFilter,
    queryParams
  };
}
