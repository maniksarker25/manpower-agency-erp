import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  DownloadIcon,
  FileTextIcon,
  PencilIcon,
  RefreshCwIcon,
  Trash2Icon,
  UserPlusIcon,
  UsersIcon,
  EyeIcon } from
'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable, type Column } from '../../../components/common/DataTable';
import { SearchInput } from '../../../components/common/SearchInput';
import { ActiveFilters, FilterPanel } from '../../../components/common/FilterBar';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { RowActions } from '../../../components/common/RowActions';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { FormField } from '../../../components/common/FormField';
import { OptionSelect } from '../../../components/shared/OptionSelect';
import { AgentSelect, CandidateStatusSelect, CountrySelect } from '../../../components/shared/EntitySelects';
import { DateRangeFilter } from '../../../components/shared/DateRangeFilter';
import { GENDERS, JOB_POSITIONS } from '../../../constants/options';
import { useListQuery } from '../../../hooks/useListQuery';
import { apiErrorMessage } from '../../../app/store/api/baseApi';
import { formatCurrency, formatDate } from '../../../utils/format';
import type { Candidate } from '../../../types/models';
import { useDeleteCandidateMutation, useGetCandidatesQuery } from '../candidatesApi';
import { UpdateStatusDialog } from '../components/UpdateStatusDialog';

const FILTER_LABELS: Record<string, string> = {
  country: 'Country',
  status: 'Status',
  agentId: 'Agent',
  gender: 'Gender',
  jobPosition: 'Position',
  dateFrom: 'From',
  dateTo: 'To'
};

export function CandidatesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const list = useListQuery({ initialSortBy: 'registrationDate', initialSortDir: 'desc' });
  const [statusTarget, setStatusTarget] = useState<Candidate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Candidate | null>(null);

  // A global header search deep-links into this list.
  const initialQuery = searchParams.get('q');
  React.useEffect(() => {
    if (initialQuery) list.onSearchChange(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const { data, isLoading, isFetching, isError, refetch } = useGetCandidatesQuery(list.params);
  const [deleteCandidate, { isLoading: isDeleting }] = useDeleteCandidateMutation();

  const columns = useMemo<Column<Candidate>[]>(
    () => [
    {
      id: 'id',
      header: 'Candidate ID',
      sortKey: 'id',
      hideable: false,
      cell: (row) =>
      <Link
        to={`/candidates/${row.id}`}
        className="num rounded font-medium text-primary transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        
            {row.id}
          </Link>

    },
    {
      id: 'registrationDate',
      header: 'Registered',
      sortKey: 'registrationDate',
      className: 'num whitespace-nowrap text-muted-foreground',
      cell: (row) => formatDate(row.registrationDate)
    },
    {
      id: 'fullName',
      header: 'Full Name',
      sortKey: 'fullName',
      hideable: false,
      className: 'whitespace-nowrap font-medium',
      cell: (row) => row.fullName
    },
    {
      id: 'mobile',
      header: 'Mobile',
      className: 'num whitespace-nowrap text-muted-foreground',
      cell: (row) => row.mobile
    },
    {
      id: 'passportNo',
      header: 'Passport / NID',
      className: 'num whitespace-nowrap text-muted-foreground',
      cell: (row) => row.passportNo
    },
    {
      id: 'dateOfBirth',
      header: 'Date of Birth',
      className: 'num whitespace-nowrap text-muted-foreground',
      defaultHidden: true,
      cell: (row) => formatDate(row.dateOfBirth)
    },
    {
      id: 'gender',
      header: 'Gender',
      className: 'text-muted-foreground',
      defaultHidden: true,
      cell: (row) => row.gender
    },
    {
      id: 'country',
      header: 'Country',
      sortKey: 'country',
      className: 'whitespace-nowrap text-muted-foreground',
      cell: (row) => row.country
    },
    {
      id: 'jobPosition',
      header: 'Job Position',
      className: 'whitespace-nowrap text-muted-foreground',
      cell: (row) => row.jobPosition
    },
    {
      id: 'salary',
      header: 'Salary',
      sortKey: 'salary',
      className: 'num whitespace-nowrap text-muted-foreground',
      cell: (row) => formatCurrency(row.salary)
    },
    {
      id: 'agentName',
      header: 'Agent',
      className: 'whitespace-nowrap text-muted-foreground',
      cell: (row) => row.agentName
    },
    {
      id: 'status',
      header: 'Status',
      sortKey: 'status',
      hideable: false,
      cell: (row) => <StatusBadge kind="candidate" value={row.status} />
    },
    {
      id: 'actions',
      header: '',
      hideable: false,
      headerClassName: 'w-10',
      className: 'text-right',
      cell: (row) =>
      <RowActions
        label={`Actions for ${row.id}`}
        actions={[
        { label: 'View', icon: EyeIcon, onSelect: () => navigate(`/candidates/${row.id}`) },
        { label: 'Edit', icon: PencilIcon, onSelect: () => navigate(`/candidates/${row.id}/edit`) },
        {
          label: 'Documents',
          icon: FileTextIcon,
          onSelect: () => navigate(`/documents?candidateId=${row.id}`)
        },
        { label: 'Update Status', icon: RefreshCwIcon, onSelect: () => setStatusTarget(row) },
        {
          label: 'Delete',
          icon: Trash2Icon,
          destructive: true,
          separatorBefore: true,
          onSelect: () => setDeleteTarget(row)
        }]
        } />


    }],

    [navigate]
  );

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCandidate(deleteTarget.id).unwrap();
      toast.success('Candidate deleted', { description: `${deleteTarget.id} has been removed.` });
      setDeleteTarget(null);
    } catch (error) {
      toast.error('Could not delete candidate', { description: apiErrorMessage(error) });
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Candidates"
        description="Manage and track all registered candidates."
        actions={
        <>
            <Button
            variant="outline"
            onClick={() => toast.success('Export queued', { description: 'Your CSV will download shortly.' })}>
            
              <DownloadIcon aria-hidden="true" />
              Export
            </Button>
            <Button asChild>
              <Link to="/candidates/new">
                <UserPlusIcon aria-hidden="true" />
                Add Candidate
              </Link>
            </Button>
          </>
        } />
      

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
        errorDescription="We couldn't load the candidates."
        emptyTitle="No candidates found"
        emptyDescription="Try changing your search or filters."
        emptyAction={
        <Button asChild size="sm">
            <Link to="/candidates/new">
              <UserPlusIcon aria-hidden="true" />
              Add Candidate
            </Link>
          </Button>
        }
        sort={{ sortBy: list.sortBy, sortDir: list.sortDir, onToggle: list.toggleSort }}
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
              placeholder="Search by ID, name, mobile or passport…"
              className="w-full sm:w-80" />
            
              <FilterPanel activeCount={list.activeFilters.length} onClear={list.clearFilters}>
                <FormField id="filter-country" label="Country">
                  <CountrySelect
                  value={list.filters.country ?? 'all'}
                  onChange={(value) => list.setFilter('country', value)}
                  allLabel="All countries" />
                
                </FormField>
                <FormField id="filter-status" label="Status">
                  <CandidateStatusSelect
                  value={list.filters.status ?? 'all'}
                  onChange={(value) => list.setFilter('status', value)}
                  allLabel="All statuses" />
                
                </FormField>
                <FormField id="filter-agent" label="Agent">
                  <AgentSelect
                  value={list.filters.agentId ?? 'all'}
                  onChange={(value) => list.setFilter('agentId', value)}
                  allLabel="All agents" />
                
                </FormField>
                <FormField id="filter-gender" label="Gender">
                  <OptionSelect
                  value={list.filters.gender ?? 'all'}
                  onChange={(value) => list.setFilter('gender', value)}
                  options={GENDERS}
                  allLabel="Any gender" />
                
                </FormField>
                <FormField id="filter-position" label="Job position">
                  <OptionSelect
                  value={list.filters.jobPosition ?? 'all'}
                  onChange={(value) => list.setFilter('jobPosition', value)}
                  options={JOB_POSITIONS}
                  allLabel="All positions" />
                
                </FormField>
                <DateRangeFilter
                from={list.filters.dateFrom}
                to={list.filters.dateTo}
                onChange={(key, value) => list.setFilter(key, value)}
                label="Registration date"
                idPrefix="candidate" />
              
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
        <Link to={`/candidates/${row.id}`} className="block space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="num text-[13px] font-medium text-primary">{row.id}</span>
              <StatusBadge kind="candidate" value={row.status} />
            </div>
            <p className="text-sm font-medium">{row.fullName}</p>
            <p className="text-[13px] text-muted-foreground">
              {row.jobPosition} · {row.country}
            </p>
            <p className="num text-[13px] text-muted-foreground">
              {row.mobile} · {formatDate(row.registrationDate)}
            </p>
          </Link>
        } />
      

      <UpdateStatusDialog
        candidate={statusTarget}
        open={Boolean(statusTarget)}
        onOpenChange={(open) => !open && setStatusTarget(null)} />
      

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete candidate?"
        description={
        <>
            Are you sure you want to delete <span className="num font-medium text-foreground">{deleteTarget?.id}</span> (
            {deleteTarget?.fullName})? This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
        onConfirm={confirmDelete} />
      

      <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <UsersIcon className="size-3.5" aria-hidden="true" />
        Showing candidates from the live register. Filters are sent to the API as query parameters.
      </p>
    </div>);

}