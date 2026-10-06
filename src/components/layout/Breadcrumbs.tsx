import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';
import { ROUTE_LABELS } from '../../constants/navigation';

function labelFor(segment: string): string {
  if (ROUTE_LABELS[segment]) return ROUTE_LABELS[segment];
  // Record ids such as CAN-00012 are shown verbatim.
  if (/^[A-Z]{3}-\d+$/.test(segment)) return segment;
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-[13px]">
        <li className="shrink-0">
          <Link
            to="/dashboard"
            className="rounded text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            
            Home
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          return (
            <li key={href} className="flex min-w-0 items-center gap-1.5">
              <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground/60" aria-hidden="true" />
              {isLast ?
              <span className="truncate font-medium text-foreground" aria-current="page">
                  {labelFor(segment)}
                </span> :

              <Link
                to={href}
                className="truncate rounded text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                
                  {labelFor(segment)}
                </Link>
              }
            </li>);

        })}
      </ol>
    </nav>);

}