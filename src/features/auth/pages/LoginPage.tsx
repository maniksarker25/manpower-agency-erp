import React from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { LayersIcon, ShieldCheckIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { apiErrorMessage } from '../../../app/store/api/baseApi';
import { env } from '../../../config/env';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Checkbox } from '../../../components/ui/misc';
import { FormField } from '../../../components/common/FormField';
import { useLoginMutation } from '../authApi';
import { credentialsReceived } from '../authSlice';
import { loginSchema, type LoginFormValues } from '../auth.schema';

const HIGHLIGHTS = [
'Track every candidate from registration to deployment.',
'Agent, country, payment and document records in one register.',
'Full audit trail for every change your team makes.'];


export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAppSelector((state) => state.auth.token);
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@meridianmanpower.com', password: 'demo1234', remember: true }
  });

  if (token) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await login({ email: values.email, password: values.password }).unwrap();
      dispatch(credentialsReceived({ token: result.token, user: result.user }));
      toast.success(`Welcome back, ${result.user.name.split(' ')[0]}`);
      const from = (location.state as {from?: string;} | null)?.from;
      navigate(from ?? '/dashboard', { replace: true });
    } catch (error) {
      toast.error('Sign in failed', { description: apiErrorMessage(error) });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-10 lg:w-[52%] lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <LayersIcon className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold leading-tight">{env.appName}</span>
              <span className="block text-xs text-muted-foreground">Manpower Agency ERP</span>
            </span>
          </div>

          <h1 className="mt-10 text-2xl font-semibold tracking-tight">Sign in to your workspace</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Use your agency account to access the candidate register.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField id="email" label="Email address" required error={errors.email?.message}>
              <Input type="email" autoComplete="email" placeholder="you@agency.com" {...register('email')} />
            </FormField>

            <FormField id="password" label="Password" required error={errors.password?.message}>
              <Input type="password" autoComplete="current-password" placeholder="••••••••" {...register('password')} />
            </FormField>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={watch('remember')}
                  onCheckedChange={(checked) => setValue('remember', checked === true)} />
                
                <Label htmlFor="remember" className="text-[13px] font-normal text-muted-foreground">
                  Keep me signed in
                </Label>
              </div>
              <Link
                to="/login"
                className="rounded text-[13px] font-medium text-primary transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>
              Sign in
            </Button>
          </form>

          <p className="mt-6 flex items-start gap-2 rounded-md border border-border bg-secondary/50 p-3 text-[13px] text-muted-foreground">
            <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            Demo workspace — any listed team email signs in. No credentials are stored in the frontend.
          </p>
        </div>
      </div>

      <aside className="hidden border-l border-border bg-card lg:flex lg:w-[48%] lg:flex-col lg:justify-center lg:px-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Operations control</p>
        <h2 className="mt-3 max-w-md text-2xl font-semibold leading-snug tracking-tight">
          One register for candidates, agents, documents and payments.
        </h2>
        <ul className="mt-8 space-y-4">
          {HIGHLIGHTS.map((item) =>
          <li key={item} className="flex gap-3 text-sm text-muted-foreground">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              {item}
            </li>
          )}
        </ul>
        <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
          <div>
            <dt className="text-xs text-muted-foreground">Candidates</dt>
            <dd className="num mt-1 text-xl font-semibold">1,248</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Deployed</dt>
            <dd className="num mt-1 text-xl font-semibold">417</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Agents</dt>
            <dd className="num mt-1 text-xl font-semibold">36</dd>
          </div>
        </dl>
      </aside>
    </div>);

}