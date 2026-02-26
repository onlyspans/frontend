import { Outlet, useParams, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useProjectBySlug, ProjectIcon } from '@/entities/project';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsList } from '@/shared/ui/tabs';
import { useSpaceUrl } from '@/shared/hooks/use-space-url';
import { cn } from '@/shared/lib/utils';

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium'
  }).format(new Date(iso));
}

const tabLinkClass = (isActive: boolean) =>
  cn(
    'inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-color',
    isActive
      ? 'bg-background text-foreground border-input shadow-sm'
      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
  );

export function ProjectDetailLayout() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { getSpaceUrl } = useSpaceUrl();
  const { data: project, isLoading, isError, error } = useProjectBySlug(slug ?? '');

  const tabValue =
    location.pathname.endsWith('/settings')
      ? 'settings'
      : location.pathname.endsWith('/releases')
        ? 'releases'
        : 'overview';

  if (!slug) {
    return (
      <div className="text-muted-foreground py-8">
        <p>Project slug is missing.</p>
        <Button variant="link" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="h-9 w-[400px] bg-muted animate-pulse rounded-lg" />
        <div className="h-32 bg-muted/50 animate-pulse rounded" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4 py-8">
        <p className="text-destructive">
          {error instanceof Error ? error.message : 'Failed to load project'}
        </p>
        <Button variant="outline" onClick={() => navigate(getSpaceUrl('/projects'))}>
          Back to projects
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-4 py-8">
        <p className="text-muted-foreground">Project not found.</p>
        <Button variant="outline" onClick={() => navigate(getSpaceUrl('/projects'))}>
          Back to projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <ProjectIcon project={project} className="size-12" />
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            {project.description ? (
              <p className="text-muted-foreground max-w-2xl">{project.description}</p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge
                variant={
                  project.status === 'active'
                    ? 'default'
                    : project.status === 'archived'
                      ? 'secondary'
                      : 'outline'
                }
                className="capitalize font-normal"
              >
                {project.status}
              </Badge>
              <span className="text-muted-foreground text-sm">
                Created {formatDate(project.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={tabValue} className="w-fit">
        <TabsList className="w-fit">
          <NavLink to="." end className={({ isActive }) => tabLinkClass(isActive)}>
            Overview
          </NavLink>
          <NavLink to="releases" className={({ isActive }) => tabLinkClass(isActive)}>
            Releases
          </NavLink>
          <NavLink to="settings" className={({ isActive }) => tabLinkClass(isActive)}>
            Settings
          </NavLink>
        </TabsList>
      </Tabs>

      <Outlet context={{ project }} />
    </div>
  );
}
