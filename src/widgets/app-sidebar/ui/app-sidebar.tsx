'use client';

import * as React from 'react';
import { NavMain } from './nav-main';
import { NavActivity } from './nav-activity';
import { NavUser } from './nav-user';
import { SpaceSwitcher } from './space-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/shared/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import { useSpaces } from '@/entities/space';
import { sidebarConfig } from '../config/sidebar-config';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { data: spaces = [], isLoading } = useSpaces();

  const handleOpenCreateSpace = React.useCallback(() => {
    navigate('/spaces/create');
  }, [navigate]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SpaceSwitcher 
          spaces={spaces} 
          isLoading={isLoading}
          onOpenCreateDialog={handleOpenCreateSpace}
        />
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
