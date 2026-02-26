'use client';

import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/widgets/app-sidebar';
import { AppBreadcrumb } from '@/widgets/app-breadcrumb';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from '@/shared/ui/sidebar';
import { ThemeToggle } from '@/shared/ui/theme-toggle.tsx';
import { ColorSchemeToggle } from '@/shared/ui/color-scheme-toggle.tsx';
import { LanguageToggle } from '@/shared/ui/language-toggle.tsx';

export function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b px-4 justify-between bg-background/50 backdrop-blur-lg">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <AppBreadcrumb />
          </div>
          <div className="flex items-center">
            <LanguageToggle variant="ghost" />
            <ThemeToggle variant="ghost" />
            <ColorSchemeToggle variant="ghost" />
          </div>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
