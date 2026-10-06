import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CompassIcon } from 'lucide-react';
import { Button } from '../ui/button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-secondary">
        <CompassIcon className="size-6 text-muted-foreground" aria-hidden="true" />
      </span>
      <p className="num text-sm font-semibold text-primary">404</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you are looking for doesn't exist or may have been moved.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link to="/dashboard">
            <ArrowLeftIcon aria-hidden="true" />
            Back to dashboard
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/candidates">Go to candidates</Link>
        </Button>
      </div>
    </div>);

}