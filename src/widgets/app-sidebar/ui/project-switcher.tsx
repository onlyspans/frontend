'use client';

import * as React from 'react';
import {
  ChevronsUpDown,
  Loader2,
  PackageOpen,
  Plus,
  Search
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '@/shared/lib/i18n';
import {
  ProjectIcon,
  useProjectBySlug,
  useProjects,
  type Project
} from '@/entities/project';
import {
  getProjectNavigationTarget
} from '@/shared/lib/project-navigation';
import {
  getRecentProjectSlugs,
  pruneRecentProjectSlugs,
  recordProjectVisit
} from '@/shared/lib/project-recent-storage';
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
import { Input } from '@/shared/ui/input';
import { Link } from 'react-router-dom';

function useRouteProjectSlug(): string | null {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'projects' && parts[1] && parts[1] !== 'create') {
    return parts[1];
  }
  return null;
}

function matchesSearch(project: Project, q: string): boolean {
  if (!q) return true;
  const n = q.toLowerCase();
  return (
    project.name.toLowerCase().includes(n) ||
    project.slug.toLowerCase().includes(n)
  );
}

export function ProjectSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useSidebar();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [recentSlugs, setRecentSlugs] = React.useState(() => getRecentProjectSlugs());

  const routeSlug = useRouteProjectSlug();
  const { data: routeProject, isLoading: routeProjectLoading } = useProjectBySlug(
    routeSlug ?? ''
  );

  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  React.useEffect(() => {
    if (!projects.length) return;
    const valid = new Set(projects.map((p) => p.slug));
    pruneRecentProjectSlugs(valid);
    setRecentSlugs(getRecentProjectSlugs());
  }, [projects]);

  const projectBySlug = React.useMemo(() => {
    const m = new Map<string, Project>();
    for (const p of projects) {
      m.set(p.slug, p);
    }
    return m;
  }, [projects]);

  const q = searchQuery.trim().toLowerCase();

  const recentProjects = React.useMemo(() => {
    const list: Project[] = [];
    for (const slug of recentSlugs) {
      const p = projectBySlug.get(slug);
      if (p && matchesSearch(p, q)) {
        list.push(p);
      }
    }
    return list;
  }, [recentSlugs, projectBySlug, q]);

  const recentSlugSet = React.useMemo(
    () => new Set(recentSlugs),
    [recentSlugs]
  );

  const allProjects = React.useMemo(() => {
    return projects
      .filter((p) => !recentSlugSet.has(p.slug) && matchesSearch(p, q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [projects, recentSlugSet, q]);

  const hotkeyTargets = React.useMemo(
    () => [...recentProjects, ...allProjects].slice(0, 9),
    [recentProjects, allProjects]
  );

  const hotkeyShortcut = React.useCallback(
    (project: Project) => {
      const i = hotkeyTargets.findIndex((p) => p.id === project.id);
      if (i < 0 || i > 8) return null;
      return `⌘${i + 1}`;
    },
    [hotkeyTargets]
  );

  const navigateToProject = React.useCallback(
    (slug: string) => {
      const target = getProjectNavigationTarget(slug, location.pathname);
      navigate(target);
      recordProjectVisit(slug);
      setRecentSlugs(getRecentProjectSlugs());
    },
    [navigate, location.pathname]
  );

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
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

      const idx = digit - 1;
      const project = hotkeyTargets[idx];
      if (!project) {
        return;
      }

      event.preventDefault();
      navigateToProject(project.slug);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hotkeyTargets, navigateToProject]);

  const triggerTitle = routeSlug
    ? routeProjectLoading
      ? '…'
      : routeProject?.name ?? routeSlug
    : t('sidebar.projects.selectProject');

  const triggerSubtitle =
    routeSlug && routeProject?.description
      ? routeProject.description
      : undefined;

  const showRecent = recentProjects.length > 0;
  const showAll = allProjects.length > 0;
  const empty =
    !projectsLoading &&
    !showRecent &&
    !showAll &&
    projects.length === 0;
  const emptySearch =
    !projectsLoading && !showRecent && !showAll && projects.length > 0;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {routeSlug && routeProject ? (
                <ProjectIcon project={routeProject} />
              ) : routeSlug && routeProjectLoading ? (
                <div className="bg-sidebar-primary/80 flex size-8 shrink-0 items-center justify-center rounded-lg">
                  <Loader2 className="text-sidebar-primary-foreground size-4 animate-spin" />
                </div>
              ) : (
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
                  <PackageOpen className="size-4" />
                </div>
              )}
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{triggerTitle}</span>
                {triggerSubtitle ? (
                  <span className="text-muted-foreground truncate text-xs">
                    {triggerSubtitle}
                  </span>
                ) : null}
              </div>
              <ChevronsUpDown className="ml-auto shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t('sidebar.projects.title')}
            </DropdownMenuLabel>
            <div className="px-2 py-1.5">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-2 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  type="search"
                  placeholder={t('sidebar.projects.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {projectsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="text-muted-foreground size-4 animate-spin" />
                </div>
              ) : empty ? (
                <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                  {t('sidebar.projects.noProjectsFound')}
                </div>
              ) : emptySearch ? (
                <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                  {t('sidebar.projects.noProjectsFound')}
                </div>
              ) : (
                <>
                  {showRecent ? (
                    <>
                      <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-xs font-normal">
                        {t('sidebar.projects.recent')}
                      </DropdownMenuLabel>
                      {recentProjects.map((project) => {
                        const sc = hotkeyShortcut(project);
                        return (
                          <DropdownMenuItem
                            key={project.id}
                            onClick={() => navigateToProject(project.slug)}
                            className="gap-2 p-2"
                          >
                            <ProjectIcon project={project} size='sm' />
                            <span className="min-w-0 flex-1 truncate">{project.name}</span>
                            {sc ? (
                              <DropdownMenuShortcut>{sc}</DropdownMenuShortcut>
                            ) : null}
                          </DropdownMenuItem>
                        );
                      })}
                    </>
                  ) : null}
                  {showRecent && showAll ? (
                    <DropdownMenuSeparator />
                  ) : null}
                  {showAll ? (
                    <>
                      <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-xs font-normal">
                        {t('sidebar.projects.allProjects')}
                      </DropdownMenuLabel>
                      {allProjects.map((project) => {
                        const sc = hotkeyShortcut(project);
                        return (
                          <DropdownMenuItem
                            key={project.id}
                            onClick={() => navigateToProject(project.slug)}
                            className="gap-2 p-2"
                          >
                            <ProjectIcon project={project} size='sm' />
                            <span className="min-w-0 flex-1 truncate">{project.name}</span>
                            {sc ? (
                              <DropdownMenuShortcut>{sc}</DropdownMenuShortcut>
                            ) : null}
                          </DropdownMenuItem>
                        );
                      })}
                    </>
                  ) : null}
                </>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/projects/create"
                className="text-muted-foreground flex cursor-pointer items-center gap-2 p-2 font-medium"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                {t('sidebar.projects.addProject')}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
