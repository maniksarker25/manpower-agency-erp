import React from 'react';
import { formatNumber } from '../../../utils/format';

interface CountryDistributionProps {
  data: {country: string;candidates: number;deployed: number;}[];
  limit?: number;
}

/** A ranked bar list reads faster than a pie chart for distribution by country. */
export function CountryDistribution({ data, limit = 7 }: CountryDistributionProps) {
  const rows = data.slice(0, limit);
  const max = Math.max(1, ...rows.map((row) => row.candidates));

  return (
    <ul className="space-y-3.5">
      {rows.map((row) =>
      <li key={row.country}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate text-[13px] font-medium text-foreground">{row.country}</span>
            <span className="num shrink-0 text-[13px] text-muted-foreground">
              <span className="font-medium text-foreground">{formatNumber(row.candidates)}</span> ·{' '}
              {formatNumber(row.deployed)} deployed
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${row.candidates / max * 100}%` }}
            role="presentation" />
          
          </div>
        </li>
      )}
    </ul>);

}