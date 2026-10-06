import React from 'react';
import { FilterIcon, XIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface FilterPanelProps {
  activeCount: number;
  onClear: () => void;
  children: React.ReactNode;
  title?: string;
}

export function FilterPanel({ activeCount, onClear, children, title = 'Filters' }: FilterPanelProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <FilterIcon aria-hidden="true" />
          Filters
          {activeCount > 0 ?
          <span className="num ml-0.5 rounded bg-primary/10 px-1.5 text-xs font-semibold text-primary">
              {activeCount}
            </span> :
          null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">{title}</p>
          <Button variant="ghost" size="sm" onClick={onClear} disabled={activeCount === 0}>
            Clear all
          </Button>
        </div>
        <div className="thin-scroll max-h-[60vh] space-y-4 overflow-y-auto p-4">{children}</div>
      </PopoverContent>
    </Popover>);

}

interface ActiveFiltersProps {
  filters: [string, string][];
  labels: Record<string, string>;
  onRemove: (key: string) => void;
  onClearAll: () => void;
  /** Optional per-key display transform, e.g. agent id → agent name. */
  formatValue?: (key: string, value: string) => string;
}

export function ActiveFilters({
  filters,
  labels,
  onRemove,
  onClearAll,
  formatValue
}: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[13px] text-muted-foreground">Active:</span>
      {filters.map(([key, value]) =>
      <Badge key={key} variant="outline" className="gap-1 py-1 pl-2 pr-1">
          <span className="text-muted-foreground">{labels[key] ?? key}:</span>
          <span className="font-medium">{formatValue ? formatValue(key, value) : value}</span>
          <button
          type="button"
          onClick={() => onRemove(key)}
          aria-label={`Remove ${labels[key] ?? key} filter`}
          className="rounded p-0.5 transition-colors duration-150 ease-out hover:bg-secondary">
          
            <XIcon className="size-3" />
          </button>
        </Badge>
      )}
      <Button variant="link" size="sm" className="h-auto p-0 text-[13px]" onClick={onClearAll}>
        Clear filters
      </Button>
    </div>);

}