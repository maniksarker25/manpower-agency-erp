import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  FileTextIcon,
  LinkIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  Trash2Icon,
  UploadIcon
} from 'lucide-react';
import { apiErrorMessage } from '../../../app/store/api/baseApi';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { PageHeader } from '../../../components/common/PageHeader';
import { SectionCard, DetailList } from '../../../components/common/SectionCard';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { RowActions } from '../../../components/common/RowActions';
import { EmptyState, ErrorState, LoadingState } from '../../../components/common/States';
import { useGetDocumentsQuery } from '../../documents/documentsApi';
import { useGetPaymentsQuery } from '../../payments/paymentsApi';
import { formatCurrency, formatDate } from '../../../utils/format';
import { useDeleteCandidateMutation, useGetCandidateQuery } from '../candidatesApi';
import { StatusTimeline } from '../components/StatusTimeline';
import { UpdateStatusDialog } from '../components/UpdateStatusDialog';
import { UploadDocumentDialog } from '../../documents/components/UploadDocumentDialog';

export function CandidateDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addDocOpen, setAddDocOpen] = useState(false);

  const { data: candidate, isLoading, isError, refetch } = useGetCandidateQuery(id as string, { skip: !id });
  const { data: documents, isLoading: docsLoading } = useGetDocumentsQuery(
    { candidateId: id, pageSize: 25 },
    { skip: !id }
  );
  const { data: payments, isLoading: paymentsLoading } = useGetPaymentsQuery(
    { candidateId: id, pageSize: 25 },
    { skip: !id }
  );
  const [deleteCandidate, { isLoading: isDeleting }] = useDeleteCandidateMutation();

  if (isLoading) {
    return (
      <Card>
        <LoadingState rows={8} columns={3} />
      </Card>
    );
  }

  if (isError || !candidate) {
    return (
      <Card>
        <ErrorState
          title="Candidate not found"
          description="This candidate record could not be loaded."
          onRetry={() => {
            void refetch();
          }}
        />
      </Card>
    );
  }

  const confirmDelete = async () => {
    try {
      await deleteCandidate(candidate.id).unwrap();
      toast.success('Candidate deleted', { description: `${candidate.id} has been removed.` });
      navigate('/candidates');
    } catch (error) {
      toast.error('Could not delete candidate', { description: apiErrorMessage(error) });
    }
  };

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
        <Link to="/candidates">
          <ArrowLeftIcon aria-hidden="true" />
          All candidates
        </Link>
      </Button>

      <PageHeader
        title={candidate.fullName}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to={`/candidates/${candidate.id}/edit`}>
                <PencilIcon aria-hidden="true" />
                Edit
              </Link>
            </Button>
            <Button onClick={() => setStatusOpen(true)}>
              <RefreshCwIcon aria-hidden="true" />
              Update Status
            </Button>
            <RowActions
              label="More actions"
              actions={[
                {
                  label: 'Add document link',
                  icon: LinkIcon,
                  onSelect: () => setAddDocOpen(true)
                },
                {
                  label: 'Manage documents',
                  icon: FileTextIcon,
                  onSelect: () => navigate(`/documents?candidateId=${candidate.id}`)
                },
                {
                  label: 'Record payment',
                  icon: UploadIcon,
                  onSelect: () => navigate(`/payments?candidateId=${candidate.id}`)
                },
                {
                  label: 'Delete candidate',
                  icon: Trash2Icon,
                  destructive: true,
                  separatorBefore: true,
                  onSelect: () => setDeleteOpen(true)
                }
              ]}
            />
          </>
        }
      >
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="num text-sm font-medium text-primary">{candidate.id}</span>
          <StatusBadge kind="candidate" value={candidate.status} />
          <span className="text-[13px] text-muted-foreground">
            Registered {formatDate(candidate.registrationDate)}
          </span>
        </div>
      </PageHeader>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">
            Documents
            <span className="num text-xs text-muted-foreground">{documents?.total ?? 0}</span>
          </TabsTrigger>
          <TabsTrigger value="payments">
            Payments
            <span className="num text-xs text-muted-foreground">{payments?.total ?? 0}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="space-y-4 xl:col-span-2">
              <SectionCard title="Personal Information">
                <DetailList
                  items={[
                    { label: 'Full name', value: candidate.fullName },
                    { label: 'Mobile', value: <span className="num">{candidate.mobile}</span> },
                    { label: 'NID / Passport', value: <span className="num">{candidate.passportNo}</span> },
                    { label: 'Date of birth', value: formatDate(candidate.dateOfBirth) },
                    { label: 'Gender', value: candidate.gender },
                    { label: 'Email', value: candidate.email }
                  ]}
                />
              </SectionCard>

              <SectionCard title="Recruitment Information">
                <DetailList
                  items={[
                    { label: 'Country', value: candidate.country },
                    { label: 'Job position', value: candidate.jobPosition },
                    { label: 'Salary offered', value: <span className="num">{formatCurrency(candidate.salary)}</span> },
                    { label: 'Status', value: <StatusBadge kind="candidate" value={candidate.status} /> },
                    { label: 'Registration date', value: formatDate(candidate.registrationDate) }
                  ]}
                />
              </SectionCard>

              <SectionCard title="Agent Information">
                <DetailList
                  items={[
                    { label: 'Agent', value: candidate.agentName },
                    { label: 'Agent ID', value: <span className="num">{candidate.agentId}</span> }
                  ]}
                />
              </SectionCard>

              <SectionCard title="Remarks">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {candidate.remarks || 'No remarks recorded for this candidate.'}
                </p>
              </SectionCard>
            </div>

            <SectionCard title="Status Timeline" description="Progress through the deployment pipeline.">
              <StatusTimeline status={candidate.status} />
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <SectionCard
            title="Documents"
            description="Document links stored against this candidate."
            action={
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => setAddDocOpen(true)}>
                  <PlusIcon aria-hidden="true" />
                  Add Link
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/documents?candidateId=${candidate.id}`}>Manage</Link>
                </Button>
              </div>
            }
          >
            {docsLoading ? (
              <LoadingState rows={4} columns={4} />
            ) : (documents?.items.length ?? 0) === 0 ? (
              <EmptyState
                title="No document links added"
                description="Passport, NID, medical and visa links will appear here."
                icon={FileTextIcon}
              />
            ) : (
              <ul className="divide-y divide-border">
                {documents?.items.map((doc) => {
                  const url = doc.documentUrl || (doc.driveFileId ? `https://drive.google.com/file/d/${doc.driveFileId}/view` : undefined);
                  return (
                    <li key={doc.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{doc.title || doc.fileName}</p>
                        <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
                          <span>{doc.type}</span>
                          <span>·</span>
                          <span className="num">{formatDate(doc.uploadedDate)}</span>
                          {url ? (
                            <>
                              <span>·</span>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                              >
                                <ExternalLinkIcon className="size-3" />
                                Open Link
                              </a>
                            </>
                          ) : null}
                        </div>
                      </div>
                      <StatusBadge kind="document" value={doc.status} />
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="payments">
          <SectionCard
            title="Payments"
            description="Fees and commissions recorded for this candidate."
            action={
              <Button size="sm" variant="outline" asChild>
                <Link to={`/payments?candidateId=${candidate.id}`}>Manage</Link>
              </Button>
            }
          >
            {paymentsLoading ? (
              <LoadingState rows={4} columns={4} />
            ) : (payments?.items.length ?? 0) === 0 ? (
              <EmptyState title="No payments recorded" description="Recorded fees will be listed here." />
            ) : (
              <ul className="divide-y divide-border">
                {payments?.items.map((payment) => (
                  <li key={payment.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{payment.paymentType}</p>
                      <p className="num text-[13px] text-muted-foreground">
                        {payment.id} · {payment.paymentMethod} · {formatDate(payment.paymentDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="num text-sm font-semibold">{formatCurrency(payment.amount)}</span>
                      <StatusBadge kind="payment" value={payment.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>

      <UpdateStatusDialog candidate={candidate} open={statusOpen} onOpenChange={setStatusOpen} />

      <UploadDocumentDialog
        open={addDocOpen}
        onOpenChange={setAddDocOpen}
        defaultCandidateId={candidate.id}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete candidate?"
        description={
          <>
            Are you sure you want to delete <span className="num font-medium text-foreground">{candidate.id}</span> (
            {candidate.fullName})? This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}