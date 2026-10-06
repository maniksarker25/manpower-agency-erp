import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

const SIDE_CLASSES = {
  left: 'inset-y-0 left-0 h-full w-[280px] border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left',
  right:
  'inset-y-0 right-0 h-full w-[min(420px,calc(100vw-2rem))] border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right'
} as const;

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: keyof typeof SIDE_CLASSES;
    hideClose?: boolean;
  }>(
  ({ className, children, side = 'right', hideClose = false, ...props }, ref) =>
  <SheetPrimitive.Portal>
    <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-900/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 duration-200 ease-out" />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 flex flex-col bg-card shadow-lg border-border data-[state=open]:animate-in data-[state=closed]:animate-out duration-200 ease-out',
        SIDE_CLASSES[side],
        className
      )}
      {...props}>
      
      {children}
      {hideClose ? null :
      <SheetPrimitive.Close
        className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors duration-150 ease-out hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Close panel">
        
          <XIcon className="size-4" />
        </SheetPrimitive.Close>
      }
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
);
SheetContent.displayName = 'SheetContent';

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1 border-b border-border px-5 py-4 pr-12', className)} {...props} />;
}

export function SheetBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('thin-scroll flex-1 overflow-y-auto px-5 py-4', className)} {...props} />;
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex gap-2 border-t border-border px-5 py-3.5', className)} {...props} />;
}

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>>(
  ({ className, ...props }, ref) =>
  <SheetPrimitive.Title ref={ref} className={cn('text-base font-semibold', className)} {...props} />
);
SheetTitle.displayName = 'SheetTitle';

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>>(
  ({ className, ...props }, ref) =>
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props} />

);
SheetDescription.displayName = 'SheetDescription';