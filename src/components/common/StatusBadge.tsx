import React from 'react';
import { cn } from '../../lib/utils';
import {
  CANDIDATE_STATUS_TONES,
  DOCUMENT_STATUS_TONES,
  PAYMENT_STATUS_TONES,
  RECORD_STATUS_TONES,
  USER_ROLE_TONES,
  type StatusTone } from
'../../constants/statusConfig';

export type StatusKind = 'candidate' | 'payment' | 'document' | 'record' | 'role';

const REGISTRY: Record<StatusKind, Record<string, StatusTone>> = {
  candidate: CANDIDATE_STATUS_TONES,
  payment: PAYMENT_STATUS_TONES,
  document: DOCUMENT_STATUS_TONES,
  record: RECORD_STATUS_TONES,
  role: USER_ROLE_TONES
};

const FALLBACK: StatusTone = {
  label: 'Unknown',
  className: 'bg-slate-100 text-slate-700 ring-slate-200',
  dot: 'bg-slate-400'
};

interface StatusBadgeProps {
  kind: StatusKind;
  value: string;
  withDot?: boolean;
  className?: string;
}

/** The only place a status is turned into color anywhere in the app. */
export function StatusBadge({ kind, value, withDot = true, className }: StatusBadgeProps) {
  const tone = REGISTRY[kind][value] ?? { ...FALLBACK, label: value || FALLBACK.label };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        tone.className,
        className
      )}>
      
      {withDot ? <span className={cn('size-1.5 rounded-full', tone.dot)} aria-hidden="true" /> : null}
      {tone.label}
    </span>);

}