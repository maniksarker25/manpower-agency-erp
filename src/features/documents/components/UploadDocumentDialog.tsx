import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { LinkIcon, InfoIcon } from 'lucide-react';
import { apiErrorMessage } from '../../../app/store/api/baseApi';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../../../components/ui/dialog';
import { FormField } from '../../../components/common/FormField';
import { OptionSelect } from '../../../components/shared/OptionSelect';
import { CandidateSelect } from '../../../components/shared/EntitySelects';
import { DOCUMENT_TYPES } from '../../../constants/options';
import { useUploadDocumentMutation } from '../documentsApi';
import { documentUploadSchema, type DocumentUploadValues } from '../documents.schema';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCandidateId?: string;
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  defaultCandidateId
}: UploadDocumentDialogProps) {
  const [uploadDocument, { isLoading }] = useUploadDocumentMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<DocumentUploadValues>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      candidateId: defaultCandidateId ?? '',
      type: 'Passport',
      title: '',
      documentUrl: ''
    }
  });

  useEffect(() => {
    if (!open) return;
    reset({
      candidateId: defaultCandidateId ?? '',
      type: 'Passport',
      title: '',
      documentUrl: ''
    });
  }, [defaultCandidateId, open, reset]);

  const selectedType = watch('type');

  // Auto-suggest title when type changes if title is empty
  const onTypeChange = (type: DocumentUploadValues['type']) => {
    setValue('type', type);
    const currentTitle = watch('title');
    if (!currentTitle || DOCUMENT_TYPES.includes(currentTitle as DocumentUploadValues['type'])) {
      setValue('title', `${type} Document`);
    }
  };

  const onSubmit = async (values: DocumentUploadValues) => {
    try {
      await uploadDocument(values).unwrap();
      toast.success('Document link added successfully', { description: values.title });
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add document link', { description: apiErrorMessage(error) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>Add Document Link</DialogTitle>
            <DialogDescription>Attach a document link (Google Drive, Dropbox, Cloud) to a candidate.</DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormField id="doc-candidate" label="Candidate" required error={errors.candidateId?.message}>
              <CandidateSelect
                value={watch('candidateId') || undefined}
                onChange={(value) => setValue('candidateId', value, { shouldValidate: true })}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="doc-type" label="Document Type" required error={errors.type?.message}>
                <OptionSelect
                  value={selectedType}
                  onChange={(value) => onTypeChange(value as DocumentUploadValues['type'])}
                  options={DOCUMENT_TYPES}
                />
              </FormField>

              <FormField id="doc-title" label="Document Title" required error={errors.title?.message}>
                <Input
                  {...register('title')}
                  placeholder="e.g. Passport Copy, Medical Test"
                />
              </FormField>
            </div>

            <FormField id="doc-link" label="Document Link (URL)" required error={errors.documentUrl?.message}>
              <div className="relative">
                <LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  {...register('documentUrl')}
                  type="url"
                  placeholder="https://drive.google.com/file/d/... or document URL"
                  className="pl-9"
                />
              </div>
            </FormField>

            <p className="flex items-start gap-2 rounded-md border border-border bg-secondary/50 p-3 text-[13px] text-muted-foreground">
              <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              Provide a direct URL to the document in Google Drive, Dropbox, or any cloud storage.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Add Document Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}