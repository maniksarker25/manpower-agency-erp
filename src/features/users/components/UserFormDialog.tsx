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
import { RECORD_STATUSES, USER_ROLES } from '../../../constants/options';
import type { UserAccount } from '../../../types/models';
import { useCreateUserMutation, useUpdateUserMutation } from '../usersApi';
import { userSchema, type UserFormValues } from '../users.schema';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserAccount | null;
}

const EMPTY: UserFormValues = { name: '', email: '', role: 'Viewer', status: 'Active' };

const ROLE_HINTS: Record<string, string> = {
  Admin: 'Full access, including users and settings.',
  Manager: 'Manages candidates, agents, payments and documents.',
  'Data Entry': 'Creates and edits candidate records.',
  Viewer: 'Read-only access to records and reports.'
};

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<UserFormValues>({ resolver: zodResolver(userSchema), defaultValues: EMPTY });

  useEffect(() => {
    if (!open) return;
    reset(user ? { name: user.name, email: user.email, role: user.role, status: user.status } : EMPTY);
  }, [open, reset, user]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      if (user) {
        await updateUser({ id: user.id, data: values }).unwrap();
        toast.success('User updated successfully');
      } else {
        await createUser(values).unwrap();
        toast.success('User added successfully', { description: 'An invite email will be sent.' });
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Could not save user', { description: apiErrorMessage(error) });
    }
  };

  const role = watch('role');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{user ? 'Edit user' : 'Add user'}</DialogTitle>
            <DialogDescription>Roles control what each team member can do.</DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormField id="user-name" label="Full name" required error={errors.name?.message}>
              <Input placeholder="e.g. Nadia Karim" {...register('name')} />
            </FormField>
            <FormField id="user-email" label="Email" required error={errors.email?.message}>
              <Input type="email" placeholder="name@agency.com" {...register('email')} />
            </FormField>
            <FormField id="user-role" label="Role" required error={errors.role?.message} hint={ROLE_HINTS[role]}>
              <OptionSelect
                value={role}
                onChange={(value) => setValue('role', value as UserFormValues['role'])}
                options={USER_ROLES} />
              
            </FormField>
            <FormField id="user-status" label="Status" error={errors.status?.message}>
              <OptionSelect
                value={watch('status')}
                onChange={(value) => setValue('status', value as UserFormValues['status'])}
                options={RECORD_STATUSES} />
              
            </FormField>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isCreating || isUpdating}>
              {user ? 'Save changes' : 'Add user'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}