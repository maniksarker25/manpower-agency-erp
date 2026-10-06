import React from "react";
import { AlertTriangleIcon, InboxIcon, RefreshCwIcon, BoxIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/misc";
import { cn } from "../../lib/utils";
/* -------------------------------- loading --------------------------------- */

export function LoadingState({
  rows = 6,
  columns = 5



}: {rows?: number;columns?: number;}) {
  return <div className="p-4" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading data</span>
      <div className="space-y-3">
        {Array.from({
        length: rows
      }).map((_, rowIndex) => <div key={rowIndex} className="flex items-center gap-4">
            {Array.from({
          length: columns
        }).map((__, colIndex) => <Skeleton key={colIndex} className={cn('h-4 flex-1', colIndex === 0 && 'max-w-[110px]', colIndex === columns - 1 && 'max-w-[80px]')} />)}
          </div>)}
      </div>
    </div>;
}
export function CardSkeleton({
  className


}: {className?: string;}) {
  return <div className={cn('space-y-3 p-5', className)} role="status" aria-busy="true">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>;
}

/* --------------------------------- empty ---------------------------------- */

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: BoxIcon;
  action?: React.ReactNode;
  className?: string;
}
export function EmptyState({
  title,
  description,
  icon: Icon = InboxIcon,
  action,
  className
}: EmptyStateProps) {
  return <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-secondary">
        <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>;
}

/* --------------------------------- error ---------------------------------- */

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}
export function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load this data.",
  onRetry,
  className
}: ErrorStateProps) {
  return <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)} role="alert">
      <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-red-50">
        <AlertTriangleIcon className="size-5 text-destructive" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry ? <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          <RefreshCwIcon aria-hidden="true" />
          Try again
        </Button> : null}
    </div>;
}