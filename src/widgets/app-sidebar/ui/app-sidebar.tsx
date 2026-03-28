'use client';

import * as React from 'react';
import { NavMain } from './nav-main';
import { NavActivity } from './nav-activity';
import { NavUser } from './nav-user';
import { ProjectSwitcher } from './project-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/shared/ui/sidebar';
import { sidebarConfig } from '../config/sidebar-config';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarConfig.navMain} />
        <NavActivity activities={sidebarConfig.activities} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarConfig.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
