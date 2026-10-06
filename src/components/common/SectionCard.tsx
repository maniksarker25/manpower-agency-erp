import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

interface SectionCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName
}: SectionCardProps) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className={cn('flex-1 pt-4', contentClassName)}>{children}</CardContent>
    </Card>);

}

interface DetailListProps {
  items: {label: string;value: React.ReactNode;}[];
  columns?: 1 | 2;
}

/** Label/value grid used across detail and profile screens. */
export function DetailList({ items, columns = 2 }: DetailListProps) {
  return (
    <dl className={cn('grid gap-x-6 gap-y-4', columns === 2 ? 'sm:grid-cols-2' : '')}>
      {items.map((item) =>
      <div key={item.label} className="min-w-0">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 break-words text-sm text-foreground">{item.value || '—'}</dd>
        </div>
      )}
    </dl>);

}