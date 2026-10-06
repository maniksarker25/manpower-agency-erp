import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { InfoIcon } from 'lucide-react';
import { apiErrorMessage } from '../../../app/store/api/baseApi';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input, Textarea } from '../../../components/ui/input';
import { PageHeader } from '../../../components/common/PageHeader';
import { FormField, FormSection } from '../../../components/common/FormField';
import { ErrorState, LoadingState } from '../../../components/common/States';
import { OptionSelect } from '../../../components/shared/OptionSelect';
import { AgentSelect, CandidateStatusSelect, CountrySelect } from '../../../components/shared/EntitySelects';
import { GENDERS, JOB_POSITIONS } from '../../../constants/options';
import { todayIso } from '../../../utils/format';
import {
  useCreateCandidateMutation,
  useGetCandidateQuery,
  useUpdateCandidateMutation } from
'../candidatesApi';
import { candidateSchema, type CandidateFormValues } from '../candidates.schema';

const EMPTY_VALUES: CandidateFormValues = {
  fullName: '',
  mobile: '',
  passportNo: '',
  dateOfBirth: '',
  gender: 'Male',
  country: '',
  jobPosition: '',
  salary: 0,
  agentId: '',
  status: 'New',
  registrationDate: todayIso(),
  remarks: ''
};

interface CandidateFormPageProps {
  mode: 'create' | 'edit';
}

export function CandidateFormPage({ mode }: CandidateFormPageProps) {
  const navigate = useNavigate();
  const { id } = useParams<{id: string;}>();
  const isEdit = mode === 'edit';

  const {
    data: candidate,
    isLoading: isLoadingCandidate,
    isError,
    refetch
  } = useGetCandidateQuery(id as string, { skip: !isEdit || !id });

  const [createCandidate, { isLoading: isCreating }] = useCreateCandidateMutation();
  const [updateCandidate, { isLoading: isUpdating }] = useUpdateCandidateMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: EMPTY_VALUES
  });

  useEffect(() => {
    if (isEdit && candidate) {
      reset({
        fullName: candidate.fullName,
        mobile: candidate.mobile,
        passportNo: candidate.passportNo,
        dateOfBirth: candidate.dateOfBirth ?? '',
        gender: candidate.gender,
        country: candidate.country,
        jobPosition: candidate.jobPosition,
        salary: candidate.salary,
        agentId: candidate.agentId,
        status: candidate.status,
        registrationDate: candidate.registrationDate,
        remarks: candidate.remarks ?? ''
      });
    }
  }, [candidate, isEdit, reset]);

  const onSubmit = async (values: CandidateFormValues) => {
    try {
      if (isEdit && id) {
        await updateCandidate({ id, data: values }).unwrap();
        toast.success('Candidate updated successfully');
        navigate(`/candidates/${id}`);
        return;
      }
      const created = await createCandidate(values).unwrap();
      toast.success('Candidate created successfully', { description: `Assigned ID ${created.id}.` });
      navigate(`/candidates/${created.id}`);
    } catch (error) {
      toast.error(isEdit ? 'Could not update candidate' : 'Could not create candidate', {
        description: apiErrorMessage(error)
      });
    }
  };

  if (isEdit && isLoadingCandidate) {
    return (
      <Card>
        <LoadingState rows={8} columns={2} />
      </Card>);

  }

  if (isEdit && isError) {
    return (
      <Card>
        <ErrorState
          title="Candidate not found"
          description="We couldn't load this candidate record."
          onRetry={() => {
            void refetch();
          }} />
        
      </Card>);

  }

  const isSaving = isCreating || isUpdating;

  return (
    <div className="space-y-5">
      <PageHeader
        title={isEdit ? `Edit ${candidate?.id ?? 'candidate'}` : 'Add Candidate'}
        description={
        isEdit ?
        'Update the recruitment record for this candidate.' :
        'Register a new candidate in the manpower pipeline.'
        }
        actions={
        <Button variant="outline" asChild>
            <Link to={isEdit && id ? `/candidates/${id}` : '/candidates'}>Cancel</Link>
          </Button>
        } />
      

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="overflow-hidden">
          <FormSection
            title="Personal Information"
            description="Identity details as they appear on the candidate's passport or NID.">
            
            <FormField id="fullName" label="Full Name" required error={errors.fullName?.message}>
              <Input placeholder="e.g. Abdul Hossain" autoComplete="name" {...register('fullName')} />
            </FormField>
            <FormField id="mobile" label="Mobile" required error={errors.mobile?.message}>
              <Input placeholder="+880 1711 234567" autoComplete="tel" {...register('mobile')} />
            </FormField>
            <FormField id="passportNo" label="NID / Passport No." required error={errors.passportNo?.message}>
              <Input placeholder="BX1234567" {...register('passportNo')} />
            </FormField>
            <FormField id="dateOfBirth" label="Date of Birth" error={errors.dateOfBirth?.message}>
              <Input type="date" {...register('dateOfBirth')} />
            </FormField>
            <FormField id="gender" label="Gender" error={errors.gender?.message}>
              <OptionSelect
                value={watch('gender')}
                onChange={(value) => setValue('gender', value as CandidateFormValues['gender'], { shouldDirty: true })}
                options={GENDERS} />
              
            </FormField>
          </FormSection>

          <FormSection
            title="Recruitment Information"
            description="Destination, job offer and the agent responsible for this file.">
            
            <FormField id="country" label="Country" required error={errors.country?.message}>
              <CountrySelect
                value={watch('country') || undefined}
                onChange={(value) => setValue('country', value, { shouldDirty: true })} />
              
            </FormField>
            <FormField id="jobPosition" label="Job Position" required error={errors.jobPosition?.message}>
              <OptionSelect
                value={watch('jobPosition') || undefined}
                onChange={(value) => setValue('jobPosition', value, { shouldDirty: true })}
                options={JOB_POSITIONS}
                placeholder="Select position" />
              
            </FormField>
            <FormField id="salary" label="Salary Offered" error={errors.salary?.message} hint="Monthly, in USD.">
              <Input type="number" min={0} step={50} {...register('salary')} />
            </FormField>
            <FormField id="agentId" label="Agent" required error={errors.agentId?.message}>
              <AgentSelect
                value={watch('agentId') || undefined}
                onChange={(value) => setValue('agentId', value, { shouldDirty: true })} />
              
            </FormField>
            <FormField id="status" label="Status" error={errors.status?.message}>
              <CandidateStatusSelect
                value={watch('status')}
                onChange={(value) => setValue('status', value as CandidateFormValues['status'], { shouldDirty: true })} />
              
            </FormField>
          </FormSection>

          <FormSection title="Additional Information" description="Internal notes and registration metadata.">
            <FormField
              id="registrationDate"
              label="Registration Date"
              required
              error={errors.registrationDate?.message}>
              
              <Input type="date" {...register('registrationDate')} />
            </FormField>
            <div className="sm:col-span-2">
              <FormField id="remarks" label="Remarks" error={errors.remarks?.message}>
                <Textarea rows={4} placeholder="Medical status, employer feedback, follow-up notes…" {...register('remarks')} />
              </FormField>
            </div>
            {!isEdit ?
            <p className="flex items-start gap-2 rounded-md border border-border bg-secondary/50 p-3 text-[13px] text-muted-foreground sm:col-span-2">
                <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  <span className="font-medium text-foreground">Candidate ID</span> is generated automatically after
                  registration.
                </span>
              </p> :
            null}
          </FormSection>

          <div className="flex flex-col-reverse gap-2 border-t border-border bg-secondary/30 px-5 py-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" asChild>
              <Link to={isEdit && id ? `/candidates/${id}` : '/candidates'}>Cancel</Link>
            </Button>
            <Button type="submit" loading={isSaving} disabled={isEdit && !isDirty}>
              {isEdit ? 'Save changes' : 'Register candidate'}
            </Button>
          </div>
        </Card>
      </form>
    </div>);

}