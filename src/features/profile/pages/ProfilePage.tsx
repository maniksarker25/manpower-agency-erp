import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Avatar, AvatarFallback } from '../../../components/ui/misc';
import { PageHeader } from '../../../components/common/PageHeader';
import { SectionCard, DetailList } from '../../../components/common/SectionCard';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { FormField } from '../../../components/common/FormField';
import { useAppDispatch } from '../../../app/store/hooks';
import { useAuth } from '../../../hooks/useAuth';
import { profileUpdated } from '../../auth/authSlice';
import { formatDate, formatRelative, initials } from '../../../utils/format';

const profileSchema = z.object({
  name: z.string().min(3, 'Full name is required').max(80),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address')
});

type ProfileValues = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const { user, logout } = useAuth();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' }
  });

  const onSubmit = (values: ProfileValues) => {
    dispatch(profileUpdated(values));
    reset(values);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="space-y-5">
      <PageHeader title="My Profile" description="Your account details and workspace access." />

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Account" className="lg:col-span-2">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="text-base">{initials(user?.name ?? 'User')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-[13px] text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="profile-name" label="Full name" required error={errors.name?.message}>
                <Input {...register('name')} />
              </FormField>
              <FormField id="profile-email" label="Email" required error={errors.email?.message}>
                <Input type="email" {...register('email')} />
              </FormField>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button type="button" variant="outline" onClick={() => reset()} disabled={!isDirty}>
                Reset
              </Button>
              <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
                Save changes
              </Button>
            </div>
          </form>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Access">
            <DetailList
              columns={1}
              items={[
              { label: 'User ID', value: <span className="num">{user?.id}</span> },
              { label: 'Role', value: user ? <StatusBadge kind="role" value={user.role} withDot={false} /> : '—' },
              { label: 'Status', value: user ? <StatusBadge kind="record" value={user.status} /> : '—' },
              { label: 'Last login', value: user?.lastLogin ? formatRelative(user.lastLogin) : '—' },
              { label: 'Member since', value: formatDate(user?.createdDate) }]
              } />
            
          </SectionCard>

          <SectionCard title="Session" description="Sign out of this device.">
            <Button variant="outline" className="w-full" onClick={logout}>
              Log out
            </Button>
          </SectionCard>
        </div>
      </div>
    </div>);

}