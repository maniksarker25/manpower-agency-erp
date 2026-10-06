import React from "react";
import { type LucideIcon } from "lucide-react";
import { Card } from "../ui/card";
import { CardSkeleton } from "./States";
import { cn } from "../../lib/utils";
import { formatNumber } from "../../utils/format";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  change?: number;
  comparison?: string;
  emphasis?: boolean;
  loading?: boolean;
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  emphasis = false,
  loading = false,
  className
}: StatsCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardSkeleton />
      </Card>
    );
  }

  return (
    <Card className={cn('flex flex-col justify-between gap-3 p-5', emphasis && 'border-primary/25 bg-primary/[0.04]', className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium text-muted-foreground">{label}</span>
        <span className={cn('flex size-8 items-center justify-center rounded-md', emphasis ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground')}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>

      <p className={cn('num font-semibold tracking-tight', emphasis ? 'text-3xl' : 'text-2xl')}>
        {formatNumber(value)}
      </p>
    </Card>
  );
}