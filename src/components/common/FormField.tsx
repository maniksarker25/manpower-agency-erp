import React from 'react';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

/** Presentational field row — label, control, hint and validation message. */
export function FormField({ id, label, required, error, hint, className, children }: FormFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {React.isValidElement(children) ?
      React.cloneElement(children as React.ReactElement, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy
      }) :
      children}
      {error ?
      <p id={`${id}-error`} className="text-[13px] font-medium text-destructive">
          {error}
        </p> :
      hint ?
      <p id={`${id}-hint`} className="text-[13px] text-muted-foreground">
          {hint}
        </p> :
      null}
    </div>);

}

export function FormSection({
  title,
  description,
  children




}: {title: string;description?: string;children: React.ReactNode;}) {
  return (
    <section className="grid gap-5 border-b border-border px-5 py-6 last:border-0 lg:grid-cols-[240px_1fr] lg:gap-8">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description ? <p className="mt-1 text-[13px] text-muted-foreground">{description}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>);

}