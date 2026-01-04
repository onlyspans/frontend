'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus, Search, Loader2, PackageOpen } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

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

interface SpaceSwitcherSpace {
  id: string;
  slug: string;
  name: string;
  avatar?: string;
  description?: string;
}

export function SpaceSwitcher(
  {
    spaces,
    isLoading = false,
    onOpenCreateDialog
  }: {
    spaces: SpaceSwitcherSpace[];
    isLoading?: boolean;
    onOpenCreateDialog?: () => void;
  }
) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { isMobile } = useSidebar();
  const [activeSpace, setActiveSpace] = React.useState<SpaceSwitcherSpace | undefined>(
    spaces.find((s) => s.slug === params.spaceSlug) || spaces[0]
  );
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const spaceSlug = params.spaceSlug;
    if (spaceSlug) {
      const space = spaces.find((s) => s.slug === spaceSlug);
      if (space) {
        setActiveSpace(space);
      }
    } else if (spaces.length > 0) {
      // Redirect to first space if no spaceSlug in URL
      const firstSpace = spaces[0];
      setActiveSpace(firstSpace);
      const currentPath = window.location.pathname;
      // Only redirect if we're not already on a space route
      if (!currentPath.startsWith(`/${firstSpace.slug}`)) {
        navigate(`/${firstSpace.slug}${currentPath === '/' ? '/dashboard' : currentPath}`);
      }
    }
  }, [spaces, params.spaceSlug, navigate]);

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

      const spaceIndex = digit - 1;
      if (spaceIndex < spaces.length) {
        const space = spaces[spaceIndex];
        setActiveSpace(space);
        // Preserve current path when switching spaces
        const currentPath = location.pathname;
        const pathParts = currentPath.split('/').filter(Boolean);
        
        // Extract route after spaceSlug (skip the first part which is spaceSlug)
        if (pathParts.length > 1) {
          // Check if first part is a spaceSlug (not sign-in, sign-up, etc.)
          const firstPart = pathParts[0];
          if (firstPart !== 'sign-in' && firstPart !== 'sign-up') {
            // We're on a space route, extract everything after spaceSlug
            const routeAfterSpace = pathParts.slice(1).join('/');
            navigate(`/${space.slug}/${routeAfterSpace || 'dashboard'}`);
          } else {
            // We're on auth pages, go to dashboard
            navigate(`/${space.slug}/dashboard`);
          }
        } else {
          navigate(`/${space.slug}/dashboard`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [spaces, navigate, location.pathname]);

  const filteredSpaces = spaces.filter((space) =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSpaceClick = (space: SpaceSwitcherSpace) => {
    setActiveSpace(space);
    // Preserve current path when switching spaces
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    
    // Extract route after spaceSlug (skip the first part which is spaceSlug)
    if (pathParts.length > 1) {
      // Check if first part is a spaceSlug (not sign-in, sign-up, etc.)
      const firstPart = pathParts[0];
      if (firstPart !== 'sign-in' && firstPart !== 'sign-up') {
        // We're on a space route, extract everything after spaceSlug
        const routeAfterSpace = pathParts.slice(1).join('/');
        navigate(`/${space.slug}/${routeAfterSpace || 'dashboard'}`);
      } else {
        // We're on auth pages, go to dashboard
        navigate(`/${space.slug}/dashboard`);
      }
    } else {
      navigate(`/${space.slug}/dashboard`);
    }
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
                {activeSpace && activeSpace.avatar && (
                  <AvatarImage src={activeSpace.avatar} alt={activeSpace.name} />
                )}
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground rounded-lg">
                  {activeSpace ? getInitials(activeSpace.name) : <PackageOpen className="size-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span
                  className="truncate font-medium">{activeSpace ? activeSpace.name : 'Space not selected'}</span>
                {activeSpace && activeSpace.description && (
                  <span className="truncate text-xs text-muted-foreground">{activeSpace.description}</span>
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
              Spaces
            </DropdownMenuLabel>
            <div className="px-2 py-1.5">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-2 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search spaces..."
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
              ) : filteredSpaces.length > 0 ? (
                filteredSpaces.map((space, index) => (
                  <DropdownMenuItem
                    key={space.id}
                    onClick={() => handleSpaceClick(space)}
                    className="gap-2 p-2"
                  >
                    <Avatar className="size-6 rounded-lg">
                      {space.avatar && (
                        <AvatarImage src={space.avatar} alt={space.name} />
                      )}
                      <AvatarFallback className="text-xs rounded-lg">
                        {getInitials(space.name)}
                      </AvatarFallback>
                    </Avatar>
                    {space.name}
                    {index < 9 && <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                  No spaces found
                </div>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => onOpenCreateDialog?.()}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add space</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
