import type { Environment } from '@/entities/environment';
import type { Project } from '@/entities/project';
import { cn } from '@/shared/lib/utils';

export function formatDashboardDateTimeShort(iso: string, invalidLabel: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return invalidLabel;
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  } catch {
    return invalidLabel;
  }
}

export function sortProjectsForDashboard(projects: Project[]): Project[] {
  return [...projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function sortEnvironmentsForDashboard(list: Environment[]): Environment[] {
  return [...list].sort((a, b) => a.position - b.position);
}

export type DashboardFlatRelease = {
  release: NonNullable<Project['releases']>[number];
  slug: string;
  projectName: string;
};

export function flattenRecentReleases(
  projects: Project[]
): { items: DashboardFlatRelease[]; hasNestedData: boolean } {
  let hasNestedData = false;
  const flat: DashboardFlatRelease[] = [];
  for (const p of projects) {
    const rel = p.releases;
    if (rel == null) continue;
    hasNestedData = true;
    if (rel.length === 0) continue;
    for (const r of rel) {
      flat.push({ release: r, slug: p.slug, projectName: p.name });
    }
  }
  if (!hasNestedData) {
    return { items: [], hasNestedData: false };
  }
  flat.sort(
    (a, b) => new Date(b.release.createdAt).getTime() - new Date(a.release.createdAt).getTime()
  );
  return { items: flat.slice(0, 6), hasNestedData: true };
}

export function dashboardListRowClassName(disabled?: boolean) {
  return cn(
    'flex min-h-9 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
    disabled ? 'text-muted-foreground' : 'hover:bg-muted/60'
  );
}
