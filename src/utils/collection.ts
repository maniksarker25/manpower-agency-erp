import type { Paginated } from '../types/models';

/** Case-insensitive match of a query across the given fields. */
export function matchesSearch<T>(item: T, fields: (keyof T)[], search?: string): boolean {
  if (!search) return true;
  const needle = search.trim().toLowerCase();
  if (!needle) return true;
  return fields.some((field) => String(item[field] ?? '').toLowerCase().includes(needle));
}

export function matchesEquals<T>(item: T, field: keyof T, value?: string): boolean {
  if (!value || value === 'all') return true;
  return String(item[field]) === value;
}

export function withinDateRange(value: string, from?: string, to?: string): boolean {
  if (from && value < from) return false;
  if (to && value > to) return false;
  return true;
}

export function sortItems<T>(items: T[], sortBy?: string, sortDir: 'asc' | 'desc' = 'asc'): T[] {
  if (!sortBy) return items;
  const dir = sortDir === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => {
    const av = (a as Record<string, unknown>)[sortBy];
    const bv = (b as Record<string, unknown>)[sortBy];
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
  });
}

export function paginate<T>(items: T[], page = 1, pageSize = 10): Paginated<T> {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize
  };
}