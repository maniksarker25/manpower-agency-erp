import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface SelectOption {
  value: string;
  label: string;
}

interface OptionSelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: SelectOption[] | readonly string[];
  placeholder?: string;
  /** Adds an "All" entry with the value `all` — used by filters. */
  allLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  id?: string;
  className?: string;
  ariaLabel?: string;
}

function normalize(options: SelectOption[] | readonly string[]): SelectOption[] {
  return options.map((option) =>
  typeof option === 'string' ? { value: option, label: option } : option
  );
}

/** Shared select used by every filter and form dropdown in the app. */
export function OptionSelect({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  allLabel,
  disabled,
  loading,
  id,
  className,
  ariaLabel
}: OptionSelectProps) {
  const items = normalize(options);

  return (
    <Select value={value ?? undefined} onValueChange={onChange} disabled={disabled || loading}>
      <SelectTrigger id={id} className={className} aria-label={ariaLabel}>
        <SelectValue placeholder={loading ? 'Loading…' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allLabel ? <SelectItem value="all">{allLabel}</SelectItem> : null}
        {items.map((option) =>
        <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        )}
      </SelectContent>
    </Select>);

}