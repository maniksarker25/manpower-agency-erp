import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PAGE_SIZE_OPTIONS } from '../../constants/options';
import { formatNumber } from '../../utils/format';

interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function DataTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange
}: DataTablePaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="Table pagination"
      className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      
      <p className="num text-[13px] text-muted-foreground">
        Showing <span className="font-medium text-foreground">{formatNumber(from)}</span>–
        <span className="font-medium text-foreground">{formatNumber(to)}</span> of{' '}
        <span className="font-medium text-foreground">{formatNumber(total)}</span>
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-muted-foreground">Rows</span>
          <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="h-8 w-[72px]" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((option) =>
              <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="First page"
            disabled={page <= 1}
            onClick={() => onPageChange(1)}>
            
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}>
            
            <ChevronLeftIcon />
          </Button>
          <span className="num px-2 text-[13px] text-muted-foreground">
            Page <span className="font-medium text-foreground">{page}</span> of {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}>
            
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Last page"
            disabled={page >= pageCount}
            onClick={() => onPageChange(pageCount)}>
            
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </nav>);

}