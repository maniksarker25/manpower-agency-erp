import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { EyeIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { apiErrorMessage } from '../../../app/store/api/baseApi';
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
import { CandidateSelect } from '../../../components/shared/EntitySelects';
import { DateRangeFilter } from '../../../components/shared/DateRangeFilter';
import { PAYMENT_STATUSES, PAYMENT_TYPES } from '../../../constants/options';
import { useListQuery } from '../../../hooks/useListQuery';
import { formatCurrency, formatDate } from '../../../utils/format';
import type { Payment } from '../../../types/models';
import { useDeletePaymentMutation, useGetPaymentsQuery } from '../paymentsApi';
import { PaymentFormDialog } from '../components/PaymentFormDialog';

const FILTER_LABELS: Record<string, string> = {
  status: 'Status',
  paymentType: 'Type',
  candidateId: 'Candidate',
  dateFrom: 'From',
  dateTo: 'To'
};

export function PaymentsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const candidateParam = searchParams.get('candidateId') ?? undefined;
  const list = useListQuery({
    initialSortBy: 'paymentDate',
    initialSortDir: 'desc',
    initialFilters: candidateParam ? { candidateId: candidateParam } : {}
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);

  useEffect(() => {
    if (candidateParam) list.setFilter('candidateId', candidateParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateParam]);

  const { data, isLoading, isFetching, isError, refetch } = useGetPaymentsQuery(list.params);
  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

  const columns = useMemo<Column<Payment>[]>(
    () => [
    { id: 'id', header: 'Payment ID', sortKey: 'id', hideable: false, className: 'num font-medium', cell: (row) => row.id },
    {
      id: 'candidate',
      header: 'Candidate',
      hideable: false,
      className: 'whitespace-nowrap',
      cell: (row) =>
      <span className="flex flex-col">
            <Link
          to={`/candidates/${row.candidateId}`}
          className="rounded font-medium text-primary transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          
              {row.candidateName}
            </Link>
            <span className="num text-xs text-muted-foreground">{row.candidateId}</span>
          </span>

    },
    { id: 'paymentType', header: 'Payment Type', className: 'whitespace-nowrap text-muted-foreground', cell: (row) => row.paymentType },
    {
      id: 'amount',
      header: 'Amount',
      sortKey: 'amount',
      className: 'num font-medium',
      cell: (row) => formatCurrency(row.amount)
    },
    {
      id: 'paymentDate',
      header: 'Payment Date',
      sortKey: 'paymentDate',
      className: 'num whitespace-nowrap text-muted-foreground',
      cell: (row) => formatDate(row.paymentDate)
    },
    { id: 'paymentMethod', header: 'Method', className: 'whitespace-nowrap text-muted-foreground', cell: (row) => row.paymentMethod },
    { id: 'status', header: 'Status', sortKey: 'status', cell: (row) => <StatusBadge kind="payment" value={row.status} /> },
    {
      id: 'remarks',
      header: 'Remarks',
      className: 'max-w-[240px] truncate text-muted-foreground',
      defaultHidden: true,
      cell: (row) => row.remarks || '—'
    },
    {
      id: 'actions',
      header: '',
      hideable: false,
      className: 'text-right',
      headerClassName: 'w-10',
      cell: (row) =>
      <RowActions
        label={`Actions for ${row.id}`}
        actions={[
        {
          label: 'View candidate',
          icon: EyeIcon,
          onSelect: () => navigate(`/candidates/${row.candidateId}`)
        },
        {
          label: 'Edit payment',
          icon: PencilIcon,
          onSelect: () => {
            setEditing(row);
            setFormOpen(true);
          }
        },
        {
          label: 'Delete payment',
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
      await deletePayment(deleteTarget.id).unwrap();
      toast.success('Payment deleted', { description: `${deleteTarget.id} has been removed.` });
      setDeleteTarget(null);
    } catch (error) {
      toast.error('Could not delete payment', { description: apiErrorMessage(error) });
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payments"
        description="Fees, commissions and refunds recorded against candidates."
        actions={
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}>
          
            <PlusIcon aria-hidden="true" />
            Add Payment
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
        errorDescription="We couldn't load the payments."
        emptyTitle="No payments found"
        emptyDescription="Try changing your search or filters."
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
              placeholder="Search by payment or candidate…"
              className="w-full sm:w-72" />
            
              <FilterPanel activeCount={list.activeFilters.length} onClear={list.clearFilters}>
                <FormField id="payment-filter-status" label="Status">
                  <OptionSelect
                  value={list.filters.status ?? 'all'}
                  onChange={(value) => list.setFilter('status', value)}
                  options={PAYMENT_STATUSES}
                  allLabel="All statuses" />
                
                </FormField>
                <FormField id="payment-filter-type" label="Payment type">
                  <OptionSelect
                  value={list.filters.paymentType ?? 'all'}
                  onChange={(value) => list.setFilter('paymentType', value)}
                  options={PAYMENT_TYPES}
                  allLabel="All types" />
                
                </FormField>
                <FormField id="payment-filter-candidate" label="Candidate">
                  <CandidateSelect
                  value={list.filters.candidateId ?? 'all'}
                  onChange={(value) => list.setFilter('candidateId', value)}
                  allLabel="All candidates" />
                
                </FormField>
                <DateRangeFilter
                from={list.filters.dateFrom}
                to={list.filters.dateTo}
                onChange={(key, value) => list.setFilter(key, value)}
                label="Payment date"
                idPrefix="payment" />
              
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
        <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="num text-[13px] font-medium text-muted-foreground">{row.id}</span>
              <StatusBadge kind="payment" value={row.status} />
            </div>
            <p className="text-sm font-medium">{row.candidateName}</p>
            <p className="text-[13px] text-muted-foreground">{row.paymentType}</p>
            <p className="num text-[13px]">
              <span className="font-semibold">{formatCurrency(row.amount)}</span>
              <span className="text-muted-foreground"> · {formatDate(row.paymentDate)} · {row.paymentMethod}</span>
            </p>
          </div>
        } />
      

      <PaymentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        payment={editing}
        defaultCandidateId={candidateParam} />
      

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete payment?"
        description={
        <>
            Payment <span className="num font-medium text-foreground">{deleteTarget?.id}</span> will be removed from the
            ledger. This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
        onConfirm={confirmDelete} />
      
    </div>);

}