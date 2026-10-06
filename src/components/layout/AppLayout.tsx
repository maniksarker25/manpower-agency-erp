import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { mobileNavClosed, mobileNavOpened, sidebarToggled } from '../../features/ui/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import { useGetActivityQuery } from '../../features/activity-log/activityApi';
import { cn } from '../../lib/utils';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';
import { LoadingState } from '../common/States';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const dispatch = useAppDispatch();
  const { sidebarCollapsed, mobileNavOpen } = useAppSelector((state) => state.ui);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  // Recent activity doubles as the notification feed.
  const { data: activity } = useGetActivityQuery({ page: 1, pageSize: 5 });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside
        className={cn(
          'sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border transition-[width] duration-200 ease-out lg:block',
          sidebarCollapsed ? 'w-[68px]' : 'w-[248px]'
        )}>
        
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => dispatch(sidebarToggled())}
          user={user}
          onLogout={logout} />
        
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={(open) => dispatch(open ? mobileNavOpened() : mobileNavClosed())}>
        <SheetContent side="left" className="p-0" hideClose>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar
            collapsed={false}
            variant="drawer"
            user={user}
            onLogout={logout}
            onNavigate={() => dispatch(mobileNavClosed())} />
          
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={user}
          unreadCount={activity?.items.length ?? 0}
          onToggleSidebar={() => dispatch(sidebarToggled())}
          onOpenMobileNav={() => dispatch(mobileNavOpened())}
          onLogout={logout} />
        
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Suspense key={pathname} fallback={<LoadingState rows={8} columns={4} />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>);

}