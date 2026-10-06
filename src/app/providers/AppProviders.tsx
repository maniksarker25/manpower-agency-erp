import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { store } from '../store/store';
import { TooltipProvider } from '../../components/ui/tooltip';

export function AppProviders({ children }: {children: React.ReactNode;}) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <TooltipProvider delayDuration={250}>
          {children}
          <Toaster
            position="top-right"
            duration={3500}
            toastOptions={{
              classNames: {
                toast: 'rounded-md border border-border bg-card text-foreground shadow-md text-sm',
                description: 'text-muted-foreground'
              }
            }} />
          
        </TooltipProvider>
      </BrowserRouter>
    </Provider>);

}