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
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreateSpaceDialog } from '@/features/space/creation/ui/create-space-dialog';
import { useSpaces, useCreateSpace, type CreateSpaceFormData } from '@/entities/space';
import { sidebarConfig } from '../config/sidebar-config';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  
  const { data: spaces = [], isLoading } = useSpaces();
  const createSpaceMutation = useCreateSpace();

  const handleCreateSpace = React.useCallback(async (data: CreateSpaceFormData) => {
    try {
      const newSpace = await createSpaceMutation.mutateAsync(data);
      
      const currentPath = location.pathname;
      const pathParts = currentPath.split('/').filter(Boolean);
      
      if (pathParts.length > 1 && pathParts[0] !== 'sign-in' && pathParts[0] !== 'sign-up') {
        const routeAfterSpace = pathParts.slice(1).join('/');
        navigate(`/${newSpace.slug}/${routeAfterSpace}`);
      } else {
        navigate(`/${newSpace.slug}`);
      }
      
      toast.success('Space created', {
        description: `Created "${newSpace.name}"`
      });
    } catch (error) {
      toast.error('Failed to create space', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, [navigate, location.pathname, createSpaceMutation]);

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SpaceSwitcher 
            spaces={spaces} 
            isLoading={isLoading}
            onOpenCreateDialog={() => setIsCreateDialogOpen(true)}
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
      <CreateSpaceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSpace}
      />
    </>
  );
}
