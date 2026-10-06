import React, { useMemo, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, Columns3Icon } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
'../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { cn } from '../../lib/utils';
import { DataTablePagination } from './DataTablePagination';
import { EmptyState, ErrorState, LoadingState } from './States';

export interface Column<T> {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** Field name sent to the API when this column is sorted. */
  sortKey?: string;
  className?: string;
  headerClassName?: string;
  /** Column can be hidden from the column-visibility menu. */
  hideable?: boolean;
  defaultHidden?: boolean;
}

interface SortState {
  sortBy?: string;
  sortDir: 'asc' | 'desc';
  onToggle: (key: string) => void;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  errorTitle?: string;
  errorDescription?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  toolbar?: React.ReactNode;
  sort?: SortState;
  pagination?: PaginationState;
  onRowClick?: (row: T) => void;
  /** Rendered instead of the table on small screens. */
  renderMobileRow?: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  isLoading = false,
  isFetching = false,
  isError = false,
  onRetry,
  errorTitle,
  errorDescription,
  emptyTitle = 'No records found',
  emptyDescription = 'Try changing your search or filters.',
  emptyAction,
  toolbar,
  sort,
  pagination,
  onRowClick,
  renderMobileRow
}: DataTableProps<T>) {
  const [hidden, setHidden] = useState<string[]>(() =>
  columns.filter((column) => column.defaultHidden).map((column) => column.id)
  );

  const visibleColumns = useMemo(
    () => columns.filter((column) => !hidden.includes(column.id)),
    [columns, hidden]
  );

  const hideableColumns = columns.filter((column) => column.hideable !== false);

  const toggleColumn = (id: string) => {
    setHidden((current) =>
    current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const showTable = !isLoading && !isError && rows.length > 0;

  return (
    <section className="rounded-lg border border-border bg-card shadow-xs">
      {(toolbar || hideableColumns.length > 0) &&
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">{toolbar}</div>
          {hideableColumns.length > 0 ?
        <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="shrink-0">
                  <Columns3Icon aria-hidden="true" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52">
                <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hideableColumns.map((column) =>
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={!hidden.includes(column.id)}
              onCheckedChange={() => toggleColumn(column.id)}
              onSelect={(event) => event.preventDefault()}>
              
                    {column.header}
                  </DropdownMenuCheckboxItem>
            )}
              </DropdownMenuContent>
            </DropdownMenu> :
        null}
        </div>
      }

      {isLoading ? <LoadingState columns={Math.min(visibleColumns.length, 6)} /> : null}

      {isError ?
      <ErrorState title={errorTitle} description={errorDescription} onRetry={onRetry} /> :
      null}

      {!isLoading && !isError && rows.length === 0 ?
      <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} /> :
      null}

      {showTable ?
      <div
        className={cn(
          'transition-opacity duration-150 ease-out',
          isFetching && 'opacity-60',
          renderMobileRow && 'hidden md:block'
        )}>
        
          <div className="thin-scroll w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {visibleColumns.map((column) => {
                  const sortable = Boolean(column.sortKey && sort);
                  const isSorted = sortable && sort?.sortBy === column.sortKey;
                  return (
                    <TableHead key={column.id} className={column.headerClassName}>
                        {sortable ?
                      <button
                        type="button"
                        onClick={() => sort?.onToggle(column.sortKey as string)}
                        className="inline-flex items-center gap-1 rounded transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Sort by ${column.header}`}>
                        
                            {column.header}
                            {isSorted ?
                        sort?.sortDir === 'asc' ?
                        <ArrowUpIcon className="size-3.5" /> :

                        <ArrowDownIcon className="size-3.5" /> :


                        <ChevronsUpDownIcon className="size-3.5 opacity-40" />
                        }
                          </button> :

                      column.header
                      }
                      </TableHead>);

                })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) =>
              <TableRow
                key={getRowId(row)}
                className={cn('hover:bg-secondary/50', onRowClick && 'cursor-pointer')}
                onClick={onRowClick ? () => onRowClick(row) : undefined}>
                
                    {visibleColumns.map((column) =>
                <TableCell key={column.id} className={column.className}>
                        {column.cell(row)}
                      </TableCell>
                )}
                  </TableRow>
              )}
              </TableBody>
            </Table>
          </div>
        </div> :
      null}

      {showTable && renderMobileRow ?
      <ul className="divide-y divide-border md:hidden">
          {rows.map((row) =>
        <li key={getRowId(row)} className="p-4">
              {renderMobileRow(row)}
            </li>
        )}
        </ul> :
      null}

      {pagination && !isLoading && !isError && rows.length > 0 ?
      <DataTablePagination {...pagination} /> :
      null}
    </section>);

}