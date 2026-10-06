import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { apiErrorMessage } from '../../../app/store/api/baseApi';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/input';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from
'../../../components/ui/dialog';
import { FormField } from '../../../components/common/FormField';
import { CandidateStatusSelect } from '../../../components/shared/EntitySelects';
import type { Candidate } from '../../../types/models';
import { useUpdateCandidateStatusMutation } from '../candidatesApi';
import { candidateStatusSchema, type CandidateStatusFormValues } from '../candidates.schema';

interface UpdateStatusDialogProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateStatusDialog({ candidate, open, onOpenChange }: UpdateStatusDialogProps) {
  const [updateStatus, { isLoading }] = useUpdateCandidateStatusMutation();

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CandidateStatusFormValues>({
    resolver: zodResolver(candidateStatusSchema),
    defaultValues: { status: 'New', remarks: '' }
  });

  useEffect(() => {
    if (candidate && open) {
      reset({ status: candidate.status, remarks: candidate.remarks ?? '' });
    }
  }, [candidate, open, reset]);

  const onSubmit = async (values: CandidateStatusFormValues) => {
    if (!candidate) return;
    try {
      await updateStatus({ id: candidate.id, status: values.status, remarks: values.remarks }).unwrap();
      toast.success('Candidate status updated', { description: `${candidate.id} is now ${values.status}.` });
      onOpenChange(false);
    } catch (error) {
      toast.error('Could not update status', { description: apiErrorMessage(error) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>Update status</DialogTitle>
            <DialogDescription>
              {candidate ? `${candidate.id} · ${candidate.fullName}` : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormField id="status" label="Status" required error={errors.status?.message}>
              <CandidateStatusSelect
                value={watch('status')}
                onChange={(value) => setValue('status', value as CandidateStatusFormValues['status'])} />
              
            </FormField>
            <FormField id="status-remarks" label="Remarks" error={errors.remarks?.message}>
              <Textarea placeholder="Add a note about this change…" {...register('remarks')} />
            </FormField>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Save status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}