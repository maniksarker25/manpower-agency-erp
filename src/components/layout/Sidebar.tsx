import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronLeftIcon, LayersIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/navigation';
import { env } from '../../config/env';
import { cn } from '../../lib/utils';
import { initials } from '../../utils/format';
import { Avatar, AvatarFallback, Separator } from '../ui/misc';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import type { UserAccount } from '../../types/models';

interface SidebarProps {
  collapsed: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
  user: UserAccount | null;
  onLogout: () => void;
  /** Mobile drawer renders without the collapse control. */
  variant?: 'desktop' | 'drawer';
}

export function Sidebar({
  collapsed,
  onToggle,
  onNavigate,
  user,
  onLogout,
  variant = 'desktop'
}: SidebarProps) {
  const { pathname } = useLocation();
  const isCollapsed = variant === 'desktop' && collapsed;

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className={cn('flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4', isCollapsed && 'justify-center px-0')}>
        <Link
          to="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LayersIcon className="size-4" aria-hidden="true" />
          </span>
          {!isCollapsed ?
          <span className="min-w-0">
              <span className="block truncate text-sm font-semibold leading-tight">{env.appShortName}</span>
              <span className="block truncate text-[11px] text-muted-foreground">Manpower ERP</span>
            </span> :
          null}
        </Link>
      </div>

      <nav aria-label="Main navigation" className="thin-scroll flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const showChildren =
            Boolean(item.children) && !isCollapsed && pathname.startsWith(item.to);

            return (
              <li key={item.to}>
                {item.group && !isCollapsed ?
                <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground first:pt-1">
                    {item.group}
                  </p> :
                null}
                {item.group && isCollapsed ? <Separator className="my-2 bg-sidebar-border" /> : null}

                <SidebarLink
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  collapsed={isCollapsed}
                  onNavigate={onNavigate}
                  end={item.to === '/dashboard'} />
                

                {showChildren ?
                <ul className="mb-1 ml-[1.4rem] mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                    {item.children?.map((child) =>
                  <li key={child.to}>
                        <NavLink
                      to={child.to}
                      end
                      onClick={onNavigate}
                      className={({ isActive }) =>
                      cn(
                        'block rounded-md px-2.5 py-1.5 text-[13px] transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isActive ?
                        'bg-sidebar-accent font-medium text-primary' :
                        'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                      )
                      }>
                      
                          {child.label}
                        </NavLink>
                      </li>
                  )}
                  </ul> :
                null}
              </li>);

          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <SidebarLink
          to="/profile"
          label={user?.name ?? 'Profile'}
          icon={UserIcon}
          collapsed={isCollapsed}
          onNavigate={onNavigate}
          renderContent={
          !isCollapsed ?
          <span className="flex min-w-0 items-center gap-2.5">
                <Avatar className="size-7">
                  <AvatarFallback className="text-[11px]">{initials(user?.name ?? 'User')}</AvatarFallback>
                </Avatar>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium leading-tight">
                    {user?.name ?? 'Profile'}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">{user?.role ?? '—'}</span>
                </span>
              </span> :
          undefined
          } />
        

        {isCollapsed ?
        <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="mt-1 w-full" onClick={onLogout} aria-label="Log out">
                <LogOutIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip> :

        <Button
          variant="ghost"
          className="mt-1 w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={onLogout}>
          
            <LogOutIcon aria-hidden="true" />
            Log out
          </Button>
        }

        {variant === 'desktop' && onToggle ?
        <Button
          variant="ghost"
          className={cn('mt-1 w-full text-muted-foreground', isCollapsed ? 'justify-center' : 'justify-start')}
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          
            <ChevronLeftIcon
            className={cn('transition-transform duration-200 ease-out', collapsed && 'rotate-180')}
            aria-hidden="true" />
          
            {!isCollapsed ? 'Collapse' : null}
          </Button> :
        null}
      </div>
    </div>);

}

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: React.ComponentType<{className?: string;}>;
  collapsed: boolean;
  onNavigate?: () => void;
  end?: boolean;
  renderContent?: React.ReactNode;
}

function SidebarLink({ to, label, icon: Icon, collapsed, onNavigate, end, renderContent }: SidebarLinkProps) {
  const link =
  <NavLink
    to={to}
    end={end}
    onClick={onNavigate}
    className={({ isActive }) =>
    cn(
      'group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      collapsed && 'justify-center px-0',
      isActive ?
      'bg-sidebar-accent text-primary' :
      'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground'
    )
    }>
    
      {({ isActive }) =>
    <>
          <span
        aria-hidden="true"
        className={cn(
          'absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary transition-opacity duration-150 ease-out',
          isActive ? 'opacity-100' : 'opacity-0'
        )} />
      
          {renderContent ??
      <>
              <Icon className="size-[18px] shrink-0" aria-hidden="true" />
              {!collapsed ? <span className="truncate">{label}</span> : null}
            </>
      }
        </>
    }
    </NavLink>;


  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>);

}