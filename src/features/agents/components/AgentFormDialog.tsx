import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
  DialogTitle } from
'../../../components/ui/dialog';
import { FormField } from '../../../components/common/FormField';
import { OptionSelect } from '../../../components/shared/OptionSelect';
import { RECORD_STATUSES } from '../../../constants/options';
import type { Agent } from '../../../types/models';
import { useCreateAgentMutation, useUpdateAgentMutation } from '../agentsApi';
import { agentSchema, type AgentFormValues } from '../agents.schema';

interface AgentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
}

const EMPTY: AgentFormValues = { name: '', mobile: '', address: '', commission: 8, status: 'Active' };

export function AgentFormDialog({ open, onOpenChange, agent }: AgentFormDialogProps) {
  const [createAgent, { isLoading: isCreating }] = useCreateAgentMutation();
  const [updateAgent, { isLoading: isUpdating }] = useUpdateAgentMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AgentFormValues>({ resolver: zodResolver(agentSchema), defaultValues: EMPTY });

  useEffect(() => {
    if (!open) return;
    reset(
      agent ?
      {
        name: agent.name,
        mobile: agent.mobile,
        address: agent.address,
        commission: agent.commission,
        status: agent.status
      } :
      EMPTY
    );
  }, [agent, open, reset]);

  const onSubmit = async (values: AgentFormValues) => {
    try {
      if (agent) {
        await updateAgent({ id: agent.id, data: values }).unwrap();
        toast.success('Agent updated successfully');
      } else {
        await createAgent(values).unwrap();
        toast.success('Agent added successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Could not save agent', { description: apiErrorMessage(error) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{agent ? 'Edit agent' : 'Add agent'}</DialogTitle>
            <DialogDescription>
              {agent ?
              <span className="num">{agent.id}</span> :

              'The agent ID is generated automatically after saving.'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField id="agent-name" label="Name" required error={errors.name?.message}>
                <Input placeholder="e.g. Rahim Enterprise" {...register('name')} />
              </FormField>
            </div>
            <FormField id="agent-mobile" label="Mobile" required error={errors.mobile?.message}>
              <Input placeholder="+880 1711 234567" {...register('mobile')} />
            </FormField>
            <FormField
              id="agent-commission"
              label="Commission"
              required
              error={errors.commission?.message}
              hint="Percentage of the service charge.">
              
              <Input type="number" min={0} max={100} step={0.5} {...register('commission')} />
            </FormField>
            <div className="sm:col-span-2">
              <FormField id="agent-address" label="Address" required error={errors.address?.message}>
                <Input placeholder="Motijheel, Dhaka" {...register('address')} />
              </FormField>
            </div>
            <FormField id="agent-status" label="Status" error={errors.status?.message}>
              <OptionSelect
                value={watch('status')}
                onChange={(value) => setValue('status', value as AgentFormValues['status'])}
                options={RECORD_STATUSES} />
              
            </FormField>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isCreating || isUpdating}>
              {agent ? 'Save changes' : 'Add agent'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}