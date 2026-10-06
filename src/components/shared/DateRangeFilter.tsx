import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface DateRangeFilterProps {
  from?: string;
  to?: string;
  onChange: (key: 'dateFrom' | 'dateTo', value: string) => void;
  label?: string;
  idPrefix?: string;
}

export function DateRangeFilter({
  from,
  to,
  onChange,
  label = 'Date range',
  idPrefix = 'range'
}: DateRangeFilterProps) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="text-[13px] font-medium text-foreground">{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-from`} className="text-xs text-muted-foreground">
            From
          </Label>
          <Input
            id={`${idPrefix}-from`}
            type="date"
            value={from ?? ''}
            onChange={(event) => onChange('dateFrom', event.target.value)} />
          
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-to`} className="text-xs text-muted-foreground">
            To
          </Label>
          <Input
            id={`${idPrefix}-to`}
            type="date"
            value={to ?? ''}
            onChange={(event) => onChange('dateTo', event.target.value)} />
          
        </div>
      </div>
    </fieldset>);

}