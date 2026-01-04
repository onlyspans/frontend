'use client';

import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/widgets/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from '@/shared/ui/sidebar';
import { ThemeToggle } from '@/shared/ui/theme-toggle.tsx';

export function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">Developer Platform</h1>
            </div>
          </div>
          <ThemeToggle variant="ghost" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
