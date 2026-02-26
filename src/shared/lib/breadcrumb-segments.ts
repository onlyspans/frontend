/**
 * Rules for building app breadcrumb segments from pathname.
 * Path examples:
 *   /default → Home
 *   /default/projects → Home > Projects
 *   /default/projects/mobile-sdk → Home > Projects > [Project Name]
 *   /default/projects/mobile-sdk/settings → Home > Projects > [Project Name]
 */

export interface BreadcrumbSegment {
  label: string;
  href: string | null;
  isCurrent: boolean;
}

export function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function getProjectSlugFromPathname(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length >= 3 && parts[1] === 'projects' && parts[2] !== 'create') {
    return parts[2];
  }
  return null;
}

/**
 * Returns breadcrumb segments for the app based on pathname.
 * Project name (third segment) should be resolved separately (e.g. from useProjectBySlug).
 */
export function getAppBreadcrumbSegments(pathname: string): BreadcrumbSegment[] {
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) {
    return [{ label: 'Home', href: '/', isCurrent: true }];
  }

  const spaceSlug = parts[0];
  const baseUrl = `/${spaceSlug}`;
  const segments: BreadcrumbSegment[] = [
    { label: 'Home', href: baseUrl, isCurrent: parts.length === 1 }
  ];

  if (parts.length >= 2 && parts[1] === 'projects') {
    const projectsUrl = `${baseUrl}/projects`;
    segments.push({
      label: 'Projects',
      href: projectsUrl,
      isCurrent: parts.length === 2
    });

    if (parts.length >= 3) {
      const slug = parts[2];
      if (slug === 'create') {
        segments.push({ label: 'New Project', href: null, isCurrent: true });
      } else {
        segments.push({
          label: humanizeSlug(slug),
          href: `${projectsUrl}/${slug}`,
          isCurrent: true
        });
      }
    }
  }

  return segments;
}
