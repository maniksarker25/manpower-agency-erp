import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { PencilIcon, PlusIcon, PowerIcon, Trash2Icon } from 'lucide-react';
import { apiErrorMessage } from '../../../app/store/api/baseApi';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback } from '../../../components/ui/misc';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable, type Column } from '../../../components/common/DataTable';
import { SearchInput } from '../../../components/common/SearchInput';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { RowActions } from '../../../components/common/RowActions';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { FilterPanel } from '../../../components/common/FilterBar';
import { FormField } from '../../../components/common/FormField';
import { OptionSelect } from '../../../components/shared/OptionSelect';
import { RECORD_STATUSES, USER_ROLES } from '../../../constants/options';
import { useListQuery } from '../../../hooks/useListQuery';
import { formatDate, formatRelative, initials } from '../../../utils/format';
import type { UserAccount } from '../../../types/models';
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from '../usersApi';
import { UserFormDialog } from '../components/UserFormDialog';

export function UsersPage() {
  const list = useListQuery({ initialSortBy: 'name', initialSortDir: 'asc' });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UserAccount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserAccount | null>(null);

  const { data, isLoading, isFetching, isError, refetch } = useGetUsersQuery(list.params);
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const toggleStatus = async (user: UserAccount) => {
    const next = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateUser({ id: user.id, data: { status: next } }).unwrap();
      toast.success(`${user.name} ${next === 'Active' ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Could not update user', { description: apiErrorMessage(error) });
    }
  };

  const columns = useMemo<Column<UserAccount>[]>(
    () => [
    {
      id: 'name',
      header: 'User',
      sortKey: 'name',
      hideable: false,
      cell: (row) =>
      <span className="flex items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarFallback className="text-[11px]">{initials(row.name)}</AvatarFallback>
            </Avatar>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{row.name}</span>
              <span className="num block text-xs text-muted-foreground">{row.id}</span>
            </span>
          </span>

    },
    { id: 'email', header: 'Email', className: 'whitespace-nowrap text-muted-foreground', cell: (row) => row.email },
    { id: 'role', header: 'Role', sortKey: 'role', cell: (row) => <StatusBadge kind="role" value={row.role} withDot={false} /> },
    { id: 'status', header: 'Status', sortKey: 'status', cell: (row) => <StatusBadge kind="record" value={row.status} /> },
    {
      id: 'lastLogin',
      header: 'Last Login',
      className: 'whitespace-nowrap text-muted-foreground',
      cell: (row) => row.lastLogin ? formatRelative(row.lastLogin) : 'Never'
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
          label: 'Edit user',
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
          label: 'Remove user',
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
      await deleteUser(deleteTarget.id).unwrap();
      toast.success('User removed', { description: `${deleteTarget.name} no longer has access.` });
      setDeleteTarget(null);
    } catch (error) {
      toast.error('Could not remove user', { description: apiErrorMessage(error) });
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Users"
        description="Team members with access to the ERP and their permissions."
        actions={
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}>
          
            <PlusIcon aria-hidden="true" />
            Add User
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
        errorDescription="We couldn't load the users."
        emptyTitle="No users found"
        emptyDescription="Invite a team member to give them access."
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
            placeholder="Search users…"
            className="w-full sm:w-72" />
          
            <FilterPanel activeCount={list.activeFilters.length} onClear={list.clearFilters}>
              <FormField id="user-filter-role" label="Role">
                <OptionSelect
                value={list.filters.role ?? 'all'}
                onChange={(value) => list.setFilter('role', value)}
                options={USER_ROLES}
                allLabel="All roles" />
              
              </FormField>
              <FormField id="user-filter-status" label="Status">
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
              <span className="text-sm font-medium">{row.name}</span>
              <StatusBadge kind="record" value={row.status} />
            </div>
            <p className="truncate text-[13px] text-muted-foreground">{row.email}</p>
            <div className="flex items-center gap-2">
              <StatusBadge kind="role" value={row.role} withDot={false} />
              <span className="text-[13px] text-muted-foreground">
                {row.lastLogin ? formatRelative(row.lastLogin) : 'Never signed in'}
              </span>
            </div>
          </div>
        } />
      

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} user={editing} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove user?"
        description={`${deleteTarget?.name ?? ''} will lose access immediately. Consider deactivating instead to keep their audit history intact.`}
        confirmLabel="Remove user"
        destructive
        loading={isDeleting}
        onConfirm={confirmDelete} />
      
    </div>);

}