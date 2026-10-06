import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PencilIcon, PlusIcon, PowerIcon, Trash2Icon } from 'lucide-react';
import { apiErrorMessage } from '../../../app/store/api/baseApi';
import { Button } from '../../../components/ui/button';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable, type Column } from '../../../components/common/DataTable';
import { SearchInput } from '../../../components/common/SearchInput';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { RowActions } from '../../../components/common/RowActions';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { FilterPanel } from '../../../components/common/FilterBar';
import { FormField } from '../../../components/common/FormField';
import { OptionSelect } from '../../../components/shared/OptionSelect';
import { RECORD_STATUSES } from '../../../constants/options';
import { useListQuery } from '../../../hooks/useListQuery';
import { formatDate, formatNumber } from '../../../utils/format';
import type { Country } from '../../../types/models';
import { useDeleteCountryMutation, useGetCountriesQuery, useUpdateCountryMutation } from '../countriesApi';
import { CountryFormDialog } from '../components/CountryFormDialog';

export function CountriesPage() {
  const list = useListQuery({ initialSortBy: 'name', initialSortDir: 'asc', pageSize: 25 });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Country | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Country | null>(null);

  const { data, isLoading, isFetching, isError, refetch } = useGetCountriesQuery(list.params);
  const [updateCountry] = useUpdateCountryMutation();
  const [deleteCountry, { isLoading: isDeleting }] = useDeleteCountryMutation();

  const toggleStatus = async (country: Country) => {
    const next = country.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateCountry({ id: country.id, data: { status: next } }).unwrap();
      toast.success(`${country.name} ${next === 'Active' ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Could not update country', { description: apiErrorMessage(error) });
    }
  };

  const columns = useMemo<Column<Country>[]>(
    () => [
    {
      id: 'name',
      header: 'Country',
      sortKey: 'name',
      hideable: false,
      className: 'font-medium',
      cell: (row) =>
      <span className="flex items-center gap-2">
            {row.name}
            <span className="num rounded bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {row.code}
            </span>
          </span>

    },
    { id: 'status', header: 'Status', sortKey: 'status', cell: (row) => <StatusBadge kind="record" value={row.status} /> },
    {
      id: 'candidates',
      header: 'Candidates',
      sortKey: 'candidates',
      className: 'num',
      cell: (row) =>
      <Link
        to={`/candidates?country=${encodeURIComponent(row.name)}`}
        className="rounded font-medium text-primary transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        
            {formatNumber(row.candidates)}
          </Link>

    },
    {
      id: 'createdDate',
      header: 'Created Date',
      sortKey: 'createdDate',
      className: 'num whitespace-nowrap text-muted-foreground',
      cell: (row) => formatDate(row.createdDate)
    },
    {
      id: 'actions',
      header: '',
      hideable: false,
      className: 'text-right',
      headerClassName: 'w-10',
      cell: (row) =>
      <RowActions
        label={`Actions for ${row.name}`}
        actions={[
        {
          label: 'Edit country',
          icon: PencilIcon,
          onSelect: () => {
            setEditing(row);
            setFormOpen(true);
          }
        },
        {
          label: row.status === 'Active' ? 'Deactivate' : 'Activate',
          icon: PowerIcon,
          onSelect: () => void toggleStatus(row)
        },
        {
          label: 'Archive country',
          icon: Trash2Icon,
          destructive: true,
          separatorBefore: true,
          onSelect: () => setDeleteTarget(row)
        }]
        } />


    }],

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCountry(deleteTarget.id).unwrap();
      toast.success('Country archived', { description: `${deleteTarget.name} removed from the list.` });
      setDeleteTarget(null);
    } catch (error) {
      toast.error('Could not archive country', { description: apiErrorMessage(error) });
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Countries"
        description="Destination markets available across the application."
        actions={
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}>
          
            <PlusIcon aria-hidden="true" />
            Add Country
          </Button>
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
        errorDescription="We couldn't load the countries."
        emptyTitle="No countries found"
        emptyDescription="Add a destination country to start assigning candidates."
        sort={{ sortBy: list.sortBy, sortDir: list.sortDir, onToggle: list.toggleSort }}
        pagination={{
          page: list.page,
          pageSize: list.pageSize,
          total: data?.total ?? 0,
          onPageChange: list.setPage,
          onPageSizeChange: list.setPageSize
        }}
        toolbar={
        <div className="flex flex-wrap items-center gap-2">
            <SearchInput
            value={list.search}
            onChange={list.onSearchChange}
            placeholder="Search countries…"
            className="w-full sm:w-72" />
          
            <FilterPanel activeCount={list.activeFilters.length} onClear={list.clearFilters}>
              <FormField id="country-filter-status" label="Status">
                <OptionSelect
                value={list.filters.status ?? 'all'}
                onChange={(value) => list.setFilter('status', value)}
                options={RECORD_STATUSES}
                allLabel="All statuses" />
              
              </FormField>
            </FilterPanel>
          </div>
        } />
      

      <CountryFormDialog open={formOpen} onOpenChange={setFormOpen} country={editing} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Archive country?"
        description={`${deleteTarget?.name ?? ''} will no longer be selectable for new candidates.`}
        confirmLabel="Archive"
        destructive
        loading={isDeleting}
        onConfirm={confirmDelete} />
      
    </div>);

}