import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BuildingIcon, PencilIcon, PlusIcon, PowerIcon, Trash2Icon, UsersIcon } from 'lucide-react';
import { apiErrorMessage } from '../../../app/store/api/baseApi';
import { Button } from '../../../components/ui/button';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable, type Column } from '../../../components/common/DataTable';
import { SearchInput } from '../../../components/common/SearchInput';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { RowActions } from '../../../components/common/RowActions';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { FormField } from '../../../components/common/FormField';
import { FilterPanel } from '../../../components/common/FilterBar';
import { OptionSelect } from '../../../components/shared/OptionSelect';
import { RECORD_STATUSES } from '../../../constants/options';
import { useListQuery } from '../../../hooks/useListQuery';
import { formatDate, formatNumber } from '../../../utils/format';
import type { Agent } from '../../../types/models';
import { useDeleteAgentMutation, useGetAgentsQuery, useUpdateAgentMutation } from '../agentsApi';
import { AgentFormDialog } from '../components/AgentFormDialog';

export function AgentsPage() {
  const list = useListQuery({ initialSortBy: 'name', initialSortDir: 'asc' });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Agent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Agent | null>(null);

  const { data, isLoading, isFetching, isError, refetch } = useGetAgentsQuery(list.params);
  const [updateAgent] = useUpdateAgentMutation();
  const [deleteAgent, { isLoading: isDeleting }] = useDeleteAgentMutation();

  const toggleStatus = async (agent: Agent) => {
    const next = agent.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateAgent({ id: agent.id, data: { status: next } }).unwrap();
      toast.success(`Agent ${next === 'Active' ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Could not update agent', { description: apiErrorMessage(error) });
    }
  };

  const columns = useMemo<Column<Agent>[]>(
    () => [
    { id: 'id', header: 'Agent ID', sortKey: 'id', hideable: false, className: 'num font-medium', cell: (row) => row.id },
    {
      id: 'name',
      header: 'Name',
      sortKey: 'name',
      hideable: false,
      className: 'whitespace-nowrap font-medium',
      cell: (row) => row.name
    },
    { id: 'mobile', header: 'Mobile', className: 'num whitespace-nowrap text-muted-foreground', cell: (row) => row.mobile },
    { id: 'address', header: 'Address', className: 'text-muted-foreground', cell: (row) => row.address },
    {
      id: 'commission',
      header: 'Commission',
      sortKey: 'commission',
      className: 'num text-muted-foreground',
      cell: (row) => `${row.commission}%`
    },
    { id: 'status', header: 'Status', sortKey: 'status', cell: (row) => <StatusBadge kind="record" value={row.status} /> },
    {
      id: 'candidates',
      header: 'Candidates',
      sortKey: 'candidates',
      className: 'num',
      cell: (row) =>
      <Link
        to={`/candidates?agentId=${row.id}`}
        className="rounded font-medium text-primary transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        
            {formatNumber(row.candidates)}
          </Link>

    },
    {
      id: 'createdDate',
      header: 'Created',
      className: 'num whitespace-nowrap text-muted-foreground',
      defaultHidden: true,
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
          label: 'Edit agent',
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
          label: 'Archive agent',
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
      await deleteAgent(deleteTarget.id).unwrap();
      toast.success('Agent archived', { description: `${deleteTarget.name} is no longer active.` });
      setDeleteTarget(null);
    } catch (error) {
      toast.error('Could not archive agent', { description: apiErrorMessage(error) });
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Agents"
        description="Recruitment partners sourcing candidates for your agency."
        actions={
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}>
          
            <PlusIcon aria-hidden="true" />
            Add Agent
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
        errorDescription="We couldn't load the agents."
        emptyTitle="No agents found"
        emptyDescription="Try changing your search, or add your first agent."
        emptyAction={
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}>
          
            <PlusIcon aria-hidden="true" />
            Add Agent
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
        <div className="flex flex-wrap items-center gap-2">
            <SearchInput
            value={list.search}
            onChange={list.onSearchChange}
            placeholder="Search agents…"
            className="w-full sm:w-72" />
          
            <FilterPanel activeCount={list.activeFilters.length} onClear={list.clearFilters}>
              <FormField id="agent-filter-status" label="Status">
                <OptionSelect
                value={list.filters.status ?? 'all'}
                onChange={(value) => list.setFilter('status', value)}
                options={RECORD_STATUSES}
                allLabel="All statuses" />
              
              </FormField>
            </FilterPanel>
          </div>
        }
        renderMobileRow={(row) =>
        <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="num text-[13px] font-medium text-muted-foreground">{row.id}</span>
              <StatusBadge kind="record" value={row.status} />
            </div>
            <p className="text-sm font-medium">{row.name}</p>
            <p className="num text-[13px] text-muted-foreground">{row.mobile}</p>
            <p className="text-[13px] text-muted-foreground">
              <BuildingIcon className="mr-1 inline size-3.5" aria-hidden="true" />
              {row.address}
            </p>
            <p className="num text-[13px] text-muted-foreground">
              <UsersIcon className="mr-1 inline size-3.5" aria-hidden="true" />
              {row.candidates} candidates · {row.commission}% commission
            </p>
          </div>
        } />
      

      <AgentFormDialog open={formOpen} onOpenChange={setFormOpen} agent={editing} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Archive agent?"
        description={
        <>
            {deleteTarget?.name} will be removed from the agent list. Existing candidate records keep their agent
            reference.
          </>
        }
        confirmLabel="Archive"
        destructive
        loading={isDeleting}
        onConfirm={confirmDelete} />
      
    </div>);

}