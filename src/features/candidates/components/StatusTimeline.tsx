import React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { CANDIDATE_PIPELINE } from '../../../constants/statusConfig';
import { cn } from '../../../lib/utils';
import type { CandidateStatus } from '../../../types/models';

const STEP_LABELS: Record<string, string> = {
  New: 'Registered'
};

export function StatusTimeline({ status }: {status: CandidateStatus;}) {
  const rejected = status === 'Rejected';
  const currentIndex = rejected ? -1 : CANDIDATE_PIPELINE.indexOf(status);

  return (
    <ol className="space-y-0">
      {CANDIDATE_PIPELINE.map((step, index) => {
        const isComplete = !rejected && index < currentIndex;
        const isCurrent = !rejected && index === currentIndex;
        const isLast = index === CANDIDATE_PIPELINE.length - 1;

        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold',
                  isComplete && 'border-emerald-500 bg-emerald-500 text-white',
                  isCurrent && 'border-primary bg-primary text-primary-foreground',
                  !isComplete && !isCurrent && 'border-border bg-card text-muted-foreground'
                )}
                aria-hidden="true">
                
                {isComplete ? <CheckIcon className="size-3.5" strokeWidth={3} /> : index + 1}
              </span>
              {!isLast ?
              <span
                className={cn('my-1 w-px flex-1', isComplete ? 'bg-emerald-500' : 'bg-border')}
                aria-hidden="true" /> :

              null}
            </div>
            <div className={cn('pb-6', isLast && 'pb-0')}>
              <p
                className={cn(
                  'text-sm font-medium',
                  isCurrent ? 'text-foreground' : isComplete ? 'text-foreground' : 'text-muted-foreground'
                )}>
                
                {STEP_LABELS[step] ?? step}
              </p>
              <p className="text-xs text-muted-foreground">
                {isComplete ? 'Completed' : isCurrent ? 'Current stage' : 'Upcoming'}
              </p>
            </div>
          </li>);

      })}

      {rejected ?
      <li className="mt-2 flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive text-white">
            <XIcon className="size-3.5" strokeWidth={3} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-red-800">Rejected</p>
            <p className="text-xs text-red-700">This candidate has left the pipeline.</p>
          </div>
        </li> :
      null}
    </ol>);

}