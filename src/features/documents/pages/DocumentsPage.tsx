import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  BadgeCheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  FileTextIcon,
  LinkIcon,
  PlusIcon,
  Trash2Icon,
  XCircleIcon
} from 'lucide-react';
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
import { DOCUMENT_STATUSES, DOCUMENT_TYPES } from '../../../constants/options';
import { useListQuery } from '../../../hooks/useListQuery';
import { formatDate } from '../../../utils/format';
import type { DocumentRecord } from '../../../types/models';
import {
  useDeleteDocumentMutation,
  useGetDocumentsQuery,
  useUpdateDocumentStatusMutation
} from '../documentsApi';
import { UploadDocumentDialog } from '../components/UploadDocumentDialog';

const FILTER_LABELS: Record<string, string> = {
  type: 'Type',
  status: 'Status',
  candidateId: 'Candidate'
};

export function DocumentsPage() {
  const [searchParams] = useSearchParams();
  const candidateParam = searchParams.get('candidateId') ?? undefined;
  const list = useListQuery({
    initialSortBy: 'uploadedDate',
    initialSortDir: 'desc',
    initialFilters: candidateParam ? { candidateId: candidateParam } : {}
  });

  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DocumentRecord | null>(null);

  useEffect(() => {
    if (candidateParam) list.setFilter('candidateId', candidateParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateParam]);

  const { data, isLoading, isFetching, isError, refetch } = useGetDocumentsQuery(list.params);
  const [updateStatus] = useUpdateDocumentStatusMutation();
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();

  const changeStatus = async (doc: DocumentRecord, status: DocumentRecord['status']) => {
    try {
      await updateStatus({ id: doc.id, status }).unwrap();
      toast.success(`Document marked ${status.toLowerCase()}`);
    } catch (error) {
      toast.error('Could not update document', { description: apiErrorMessage(error) });
    }
  };

  const copyDocLink = (url?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(
      () => toast.success('Link copied to clipboard!'),
      () => toast.error('Failed to copy link')
    );
  };

  const columns = useMemo<Column<DocumentRecord>[]>(
    () => [
      {
        id: 'title',
        header: 'Document Title',
        hideable: false,
        cell: (row) => (
          <span className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
              <FileTextIcon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{row.title || row.fileName || 'Untitled Document'}</span>
              <span className="num block text-xs text-muted-foreground">{row.id}</span>
            </span>
          </span>
        )
      },
      {
        id: 'documentUrl',
        header: 'Document Link',
        hideable: false,
        cell: (row) => {
          const url = row.documentUrl || (row.driveFileId ? `https://drive.google.com/file/d/${row.driveFileId}/view` : undefined);
          if (!url) return <span className="text-xs text-muted-foreground">No link</span>;

          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-[240px] items-center gap-1.5 truncate text-xs font-medium text-primary hover:underline"
            >
              <LinkIcon className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">Open Link</span>
              <ExternalLinkIcon className="size-3 shrink-0" aria-hidden="true" />
            </a>
          );
        }
      },
      {
        id: 'candidate',
        header: 'Candidate',
        hideable: false,
        className: 'whitespace-nowrap',
        cell: (row) => (
          <span className="flex flex-col">
            <Link
              to={`/candidates/${row.candidateId}`}
              className="rounded font-medium text-primary transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {row.candidateName}
            </Link>
            <span className="num text-xs text-muted-foreground">{row.candidateId}</span>
          </span>
        )
      },
      { id: 'type', header: 'Type', className: 'text-muted-foreground', cell: (row) => row.type },
      { id: 'status', header: 'Status', sortKey: 'status', cell: (row) => <StatusBadge kind="document" value={row.status} /> },
      {
        id: 'uploadedDate',
        header: 'Date Added',
        sortKey: 'uploadedDate',
        className: 'num whitespace-nowrap text-muted-foreground',
        cell: (row) => formatDate(row.uploadedDate)
      },
      {
        id: 'actions',
        header: '',
        hideable: false,
        className: 'text-right',
        headerClassName: 'w-10',
        cell: (row) => {
          const url = row.documentUrl || (row.driveFileId ? `https://drive.google.com/file/d/${row.driveFileId}/view` : undefined);
          return (
            <RowActions
              label={`Actions for ${row.title || row.fileName}`}
              actions={[
                {
                  label: 'Open document link',
                  icon: ExternalLinkIcon,
                  disabled: !url,
                  onSelect: () => {
                    if (url) window.open(url, '_blank', 'noopener,noreferrer');
                  }
                },
                {
                  label: 'Copy link',
                  icon: CopyIcon,
                  disabled: !url,
                  onSelect: () => copyDocLink(url)
                },
                {
                  label: 'Mark verified',
                  icon: BadgeCheckIcon,
                  disabled: row.status === 'Verified',
                  onSelect: () => void changeStatus(row, 'Verified')
                },
                {
                  label: 'Mark rejected',
                  icon: XCircleIcon,
                  disabled: row.status === 'Rejected',
                  onSelect: () => void changeStatus(row, 'Rejected')
                },
                {
                  label: 'Delete document',
                  icon: Trash2Icon,
                  destructive: true,
                  separatorBefore: true,
                  onSelect: () => setDeleteTarget(row)
                }
              ]}
            />
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDocument(deleteTarget.id).unwrap();
      toast.success('Document deleted', { description: deleteTarget.title || deleteTarget.fileName });
      setDeleteTarget(null);
    } catch (error) {
      toast.error('Could not delete document', { description: apiErrorMessage(error) });
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Documents"
        description="Passport, medical, visa and ticket links for candidates."
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <PlusIcon aria-hidden="true" />
            Add Document Link
          </Button>
        }
      />

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
        errorDescription="We couldn't load the documents."
        emptyTitle="No document links found"
        emptyDescription="Add a candidate document link to get started."
        emptyAction={
          <Button size="sm" onClick={() => setUploadOpen(true)}>
            <PlusIcon aria-hidden="true" />
            Add Document Link
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
                placeholder="Search documents…"
                className="w-full sm:w-72"
              />

              <FilterPanel activeCount={list.activeFilters.length} onClear={list.clearFilters}>
                <FormField id="doc-filter-type" label="Document type">
                  <OptionSelect
                    value={list.filters.type ?? 'all'}
                    onChange={(value) => list.setFilter('type', value)}
                    options={DOCUMENT_TYPES}
                    allLabel="All types"
                  />
                </FormField>
                <FormField id="doc-filter-status" label="Status">
                  <OptionSelect
                    value={list.filters.status ?? 'all'}
                    onChange={(value) => list.setFilter('status', value)}
                    options={DOCUMENT_STATUSES}
                    allLabel="All statuses"
                  />
                </FormField>
                <FormField id="doc-filter-candidate" label="Candidate">
                  <CandidateSelect
                    value={list.filters.candidateId ?? 'all'}
                    onChange={(value) => list.setFilter('candidateId', value)}
                    allLabel="All candidates"
                  />
                </FormField>
              </FilterPanel>
            </div>
            <ActiveFilters
              filters={list.activeFilters as [string, string][]}
              labels={FILTER_LABELS}
              onRemove={list.clearFilter}
              onClearAll={list.clearFilters}
            />
          </div>
        }
        renderMobileRow={(row) => {
          const url = row.documentUrl || (row.driveFileId ? `https://drive.google.com/file/d/${row.driveFileId}/view` : undefined);
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{row.title || row.fileName}</span>
                <StatusBadge kind="document" value={row.status} />
              </div>
              <p className="text-[13px] text-muted-foreground">
                {row.type} · {row.candidateName}
              </p>
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <ExternalLinkIcon className="size-3.5" />
                  Open Document Link
                </a>
              ) : null}
              <p className="num text-xs text-muted-foreground">
                Added {formatDate(row.uploadedDate)}
              </p>
            </div>
          );
        }}
      />

      <UploadDocumentDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        defaultCandidateId={candidateParam}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete document link?"
        description={`${deleteTarget?.title || deleteTarget?.fileName || 'This document'} will be removed from the candidate record. This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}