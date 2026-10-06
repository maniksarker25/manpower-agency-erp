import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { CheckIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

/* --------------------------------- avatar --------------------------------- */

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>>(
  ({ className, ...props }, ref) =>
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex size-9 shrink-0 overflow-hidden rounded-full', className)}
    {...props} />

);
Avatar.displayName = 'Avatar';

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>>(
  ({ className, ...props }, ref) =>
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex size-full items-center justify-center bg-primary/10 text-[13px] font-semibold text-primary',
      className
    )}
    {...props} />

);
AvatarFallback.displayName = 'AvatarFallback';

/* -------------------------------- checkbox -------------------------------- */

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(
  ({ className, ...props }, ref) =>
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer size-4 shrink-0 rounded-[4px] border border-input bg-card shadow-xs transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary',
      className
    )}
    {...props}>
    
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-primary-foreground">
      <CheckIcon className="size-3.5" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);
Checkbox.displayName = 'Checkbox';

/* -------------------------------- separator ------------------------------- */

export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) =>
  <SeparatorPrimitive.Root
    ref={ref}
    orientation={orientation}
    decorative={decorative}
    className={cn('bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
    {...props} />

);
Separator.displayName = 'Separator';

/* --------------------------------- switch --------------------------------- */

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>>(
  ({ className, ...props }, ref) =>
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-300',
      className
    )}
    {...props}>
    
    <SwitchPrimitive.Thumb className="pointer-events-none block size-4 rounded-full bg-white shadow-xs transition-transform duration-150 ease-out data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
  </SwitchPrimitive.Root>
);
Switch.displayName = 'Switch';

/* -------------------------------- skeleton -------------------------------- */

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-slate-200/80', className)} {...props} />;
}