'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus, Search, Loader2, PackageOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/shared/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Input } from '@/shared/ui/input';

interface ProjectSwitcherProject {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
}

export function ProjectSwitcher(
  {
    projects,
    isLoading = false
  }: {
    projects: ProjectSwitcherProject[];
    isLoading?: boolean;
  }
) {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const [activeProject, setActiveProject] = React.useState<ProjectSwitcherProject | undefined>(
    projects[0]
  );
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    if (projects.length > 0 && !activeProject) {
      setActiveProject(projects[0]);
    }
  }, [projects, activeProject]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const isModifierPressed = event.metaKey || event.ctrlKey;
      if (!isModifierPressed) {
        return;
      }

      const digit = parseInt(event.key, 10);
      if (isNaN(digit) || digit < 1 || digit > 9) {
        return;
      }

      event.preventDefault();

      const projectIndex = digit - 1;
      if (projectIndex < projects.length) {
        setActiveProject(projects[projectIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [projects]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                {activeProject && activeProject.avatar && (
                  <AvatarImage src={activeProject.avatar} alt={activeProject.name} />
                )}
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground rounded-lg">
                  {activeProject ? getInitials(activeProject.name) : <PackageOpen className="size-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span
                  className="truncate font-medium">{activeProject ? activeProject.name : 'Project not selected'}</span>
                {activeProject && activeProject.description && (
                  <span className="truncate text-xs text-muted-foreground">{activeProject.description}</span>
                )}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Projects
            </DropdownMenuLabel>
            <div className="px-2 py-1.5">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-2 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <DropdownMenuItem
                    key={project.id}
                    onClick={() => setActiveProject(project)}
                    className="gap-2 p-2"
                  >
                    <Avatar className="size-6 rounded-lg">
                      {project.avatar && (
                        <AvatarImage src={project.avatar} alt={project.name} />
                      )}
                      <AvatarFallback className="text-xs rounded-lg">
                        {getInitials(project.name)}
                      </AvatarFallback>
                    </Avatar>
                    {project.name}
                    {index < 9 && <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                  No projects found
                </div>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => navigate('/projects/create')}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add project</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
