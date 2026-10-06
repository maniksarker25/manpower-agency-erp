import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui/badge';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable, type Column } from '../../../components/common/DataTable';
import { SearchInput } from '../../../components/common/SearchInput';
import { ActiveFilters, FilterPanel } from '../../../components/common/FilterBar';
import { FormField } from '../../../components/common/FormField';
import { OptionSelect } from '../../../components/shared/OptionSelect';
import { DateRangeFilter } from '../../../components/shared/DateRangeFilter';
import { ACTIVITY_ACTIONS, ACTIVITY_MODULES } from '../../../constants/options';
import { useListQuery } from '../../../hooks/useListQuery';
import { useGetUsersQuery } from '../../users/usersApi';
import { formatDateTime } from '../../../utils/format';
import type { ActivityEntry } from '../../../types/models';
import { useGetActivityQuery } from '../activityApi';

const FILTER_LABELS: Record<string, string> = {
  user: 'User',
  module: 'Module',
  action: 'Action',
  dateFrom: 'From',
  dateTo: 'To'
};

export function ActivityLogPage() {
  const list = useListQuery({ pageSize: 25 });
  const { data, isLoading, isFetching, isError, refetch } = useGetActivityQuery(list.params);
  const { data: users } = useGetUsersQuery({ pageSize: 100 });

  const userOptions = useMemo(
    () => (users?.items ?? []).map((user) => ({ value: user.name, label: user.name })),
    [users]
  );

  const columns = useMemo<Column<ActivityEntry>[]>(
    () => [
    {
      id: 'timestamp',
      header: 'Date / Time',
      hideable: false,
      className: 'num whitespace-nowrap text-muted-foreground',
      cell: (row) => formatDateTime(row.timestamp)
    },
    { id: 'user', header: 'User', className: 'whitespace-nowrap font-medium', cell: (row) => row.user },
    { id: 'action', header: 'Action', className: 'whitespace-nowrap', cell: (row) => row.action },
    {
      id: 'module',
      header: 'Module',
      cell: (row) => <Badge variant="outline">{row.module}</Badge>
    },
    {
      id: 'record',
      header: 'Record',
      className: 'num whitespace-nowrap',
      cell: (row) =>
      /^CAN-/.test(row.record) ?
      <Link
        to={`/candidates/${row.record}`}
        className="rounded font-medium text-primary transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        
              {row.record}
            </Link> :

      <span className="text-muted-foreground">{row.record}</span>

    },
    {
      id: 'details',
      header: 'Details',
      className: 'max-w-[380px] text-muted-foreground',
      cell: (row) => row.details
    }],

    []
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Activity Log"
        description="A complete audit trail of every change made in the system." />
      

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => {
          void refetch();
        }}
        errorDescription="We couldn't load the activity log."
        emptyTitle="No activity found"
        emptyDescription="Try changing your search, filters or date range."
        pagination={{
          page: list.page,
          pageSize: list.pageSize,
          total: data?.total ?? 0,
          onPageChange: list.setPage,
          onPageSizeChange: list.setPageSize
        }}
        toolbar={
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput
              value={list.search}
              onChange={list.onSearchChange}
              placeholder="Search actions, records or users…"
              className="w-full sm:w-80" />
            
              <FilterPanel activeCount={list.activeFilters.length} onClear={list.clearFilters}>
                <FormField id="activity-filter-user" label="User">
                  <OptionSelect
                  value={list.filters.user ?? 'all'}
                  onChange={(value) => list.setFilter('user', value)}
                  options={userOptions}
                  allLabel="All users" />
                
                </FormField>
                <FormField id="activity-filter-module" label="Module">
                  <OptionSelect
                  value={list.filters.module ?? 'all'}
                  onChange={(value) => list.setFilter('module', value)}
                  options={ACTIVITY_MODULES}
                  allLabel="All modules" />
                
                </FormField>
                <FormField id="activity-filter-action" label="Action">
                  <OptionSelect
                  value={list.filters.action ?? 'all'}
                  onChange={(value) => list.setFilter('action', value)}
                  options={ACTIVITY_ACTIONS}
                  allLabel="All actions" />
                
                </FormField>
                <DateRangeFilter
                from={list.filters.dateFrom}
                to={list.filters.dateTo}
                onChange={(key, value) => list.setFilter(key, value)}
                idPrefix="activity" />
              
              </FilterPanel>
            </div>
            <ActiveFilters
            filters={list.activeFilters as [string, string][]}
            labels={FILTER_LABELS}
            onRemove={list.clearFilter}
            onClearAll={list.clearFilters} />
          
          </div>
        }
        renderMobileRow={(row) =>
        <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{row.action}</span>
              <Badge variant="outline">{row.module}</Badge>
            </div>
            <p className="text-[13px] text-muted-foreground">{row.details}</p>
            <p className="num text-xs text-muted-foreground">
              {row.user} · {formatDateTime(row.timestamp)}
            </p>
          </div>
        } />
      
    </div>);

}