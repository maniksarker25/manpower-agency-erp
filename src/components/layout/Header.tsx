import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BellIcon,
  LogOutIcon,
  MenuIcon,
  PanelLeftIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon } from
'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
'../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/misc';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Breadcrumbs } from './Breadcrumbs';
import { initials } from '../../utils/format';
import type { UserAccount } from '../../types/models';

interface HeaderProps {
  user: UserAccount | null;
  unreadCount: number;
  onToggleSidebar: () => void;
  onOpenMobileNav: () => void;
  onLogout: () => void;
}

export function Header({
  user,
  unreadCount,
  onToggleSidebar,
  onOpenMobileNav,
  onLogout
}: HeaderProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/candidates?q=${encodeURIComponent(trimmed)}`);
    setQuery('');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onOpenMobileNav}
        aria-label="Open navigation">
        
        <MenuIcon />
      </Button>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden lg:inline-flex"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar">
            
            <PanelLeftIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Toggle sidebar</TooltipContent>
      </Tooltip>

      <div className="hidden min-w-0 flex-1 md:block">
        <Breadcrumbs />
      </div>

      <form onSubmit={submitSearch} className="relative ml-auto hidden w-64 sm:block" role="search">
        <SearchIcon
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true" />
        
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search candidates…"
          aria-label="Search candidates"
          className="h-8 bg-secondary/60 pl-9" />
        
      </form>

      <Button variant="ghost" size="icon-sm" className="relative ml-auto sm:ml-0" asChild>
        <Link to="/notifications" aria-label={`Notifications (${unreadCount} unread)`}>
          <BellIcon />
          {unreadCount > 0 ?
          <span className="num absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
              {unreadCount}
            </span> :
          null}
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-md py-1 pl-1 pr-2 transition-colors duration-150 ease-out hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open profile menu">
            
            <Avatar className="size-8">
              <AvatarFallback>{initials(user?.name ?? 'User')}</AvatarFallback>
            </Avatar>
            <span className="hidden text-left lg:block">
              <span className="block text-[13px] font-medium leading-tight">{user?.name ?? 'User'}</span>
              <span className="block text-[11px] text-muted-foreground">{user?.role ?? '—'}</span>
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="text-foreground">
            <span className="block text-sm font-medium">{user?.name ?? 'User'}</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">{user?.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile">
              <UserIcon aria-hidden="true" />
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">
              <SettingsIcon aria-hidden="true" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onSelect={onLogout}>
            <LogOutIcon aria-hidden="true" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>);

}