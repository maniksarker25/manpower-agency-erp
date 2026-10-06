import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../constants/options';
import type { ListQuery } from '../types/models';
import { useDebouncedValue } from './useDebouncedValue';

export type Filters = Record<string, string>;

interface UseListQueryOptions {
  initialFilters?: Filters;
  initialSortBy?: string;
  initialSortDir?: 'asc' | 'desc';
  pageSize?: number;
}

/**
 * Owns all list-view UI state (search, filters, sorting, pagination) and exposes
 * it as a flat params object. That object is handed straight to RTK Query, so the
 * same shape reaches the Apps Script endpoint without any translation layer.
 */
export function useListQuery({
  initialFilters = {},
  initialSortBy,
  initialSortDir = 'desc',
  pageSize: initialPageSize = DEFAULT_PAGE_SIZE
}: UseListQueryOptions = {}) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(initialSortDir);

  const debouncedSearch = useDebouncedValue(search, 300);

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }, []);

  const setManyFilters = useCallback((next: Filters) => {
    setFilters(next);
    setPage(1);
  }, []);

  const clearFilter = useCallback((key: string) => {
    setFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const toggleSort = useCallback((key: string) => {
    setSortBy((currentKey) => {
      if (currentKey === key) {
        setSortDir((dir) => dir === 'asc' ? 'desc' : 'asc');
        return currentKey;
      }
      setSortDir('asc');
      return key;
    });
  }, []);

  const activeFilters = useMemo(
    () => Object.entries(filters).filter(([, value]) => value && value !== 'all'),
    [filters]
  );

  const params = useMemo<ListQuery>(() => {
    const next: ListQuery = { page, pageSize, sortBy, sortDir };
    if (debouncedSearch.trim()) next.search = debouncedSearch.trim();
    activeFilters.forEach(([key, value]) => {
      next[key] = value;
    });
    return next;
  }, [activeFilters, debouncedSearch, page, pageSize, sortBy, sortDir]);

  return {
    search,
    onSearchChange,
    filters,
    setFilter,
    setManyFilters,
    clearFilter,
    clearFilters,
    activeFilters,
    page,
    setPage,
    pageSize,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
    sortBy,
    sortDir,
    toggleSort,
    params
  };
}

export type ListQueryState = ReturnType<typeof useListQuery>;