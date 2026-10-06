import React, { Suspense } from 'react';
import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/router/AppRouter';
import { LoadingState } from './components/common/States';

export function App() {
  return (
    <AppProviders>
      <Suspense
        fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <LoadingState rows={4} columns={3} />
          </div>
        }>
        
        <AppRouter />
      </Suspense>
    </AppProviders>);

}