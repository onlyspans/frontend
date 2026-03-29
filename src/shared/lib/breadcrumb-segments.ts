/**
 * Rules for building app breadcrumb segments from pathname.
 * Path examples:
 *   / → Home
 *   /projects → Home > Projects
 *   /projects/mobile-sdk → Home > Projects > [Project Name]
 *   /projects/mobile-sdk/settings → Home > Projects > [Project Name] > Settings
 *   /events → Home > Events
 *   /releases → Home > Releases
 */

export interface BreadcrumbSegment {
  /** Translation key for static labels (e.g. breadcrumb.home). Use in component with t(labelKey). */
  labelKey?: string;
  /** Dynamic label (e.g. project name). When set, display as-is without translation. */
  label?: string;
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
  if (parts[0] === 'projects' && parts[1] && parts[1] !== 'create') {
    return parts[1];
  }
  return null;
}

/** Breadcrumb `href` for the project root tab (`/projects/:slug`). */
export function getProjectDetailHref(projectSlug: string): string {
  return `/projects/${projectSlug}`;
}

/**
 * Returns breadcrumb segments for the app based on pathname (no leading space segment).
 * The project title segment uses `href` === `getProjectDetailHref(slug)`; resolve the display
 * name with `useProjectBySlug` in the breadcrumb widget.
 */
export function getAppBreadcrumbSegments(pathname: string): BreadcrumbSegment[] {
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) {
    return [{ labelKey: 'breadcrumb.home', href: '/', isCurrent: true }];
  }

  const home: BreadcrumbSegment = {
    labelKey: 'breadcrumb.home',
    href: '/',
    isCurrent: false
  };

  if (parts[0] === 'environments') {
    const segments: BreadcrumbSegment[] = [
      home,
      {
        labelKey: 'breadcrumb.environments',
        href: '/environments',
        isCurrent: parts.length === 1
      }
    ];
    if (parts[1] === 'variables') {
      segments[1].isCurrent = false;
      segments.push({
        labelKey: 'breadcrumb.variables',
        href: null,
        isCurrent: true
      });
    }
    return segments;
  }

  if (parts[0] === 'events') {
    return [
      home,
      {
        labelKey: 'breadcrumb.events',
        href: null,
        isCurrent: true
      }
    ];
  }

  if (parts[0] === 'releases' && parts.length === 1) {
    return [
      home,
      {
        labelKey: 'breadcrumb.releases',
        href: null,
        isCurrent: true
      }
    ];
  }

  if (parts[0] === 'projects') {
    const segments: BreadcrumbSegment[] = [
      home,
      {
        labelKey: 'breadcrumb.projects',
        href: '/projects',
        isCurrent: parts.length === 1
      }
    ];

    if (parts.length >= 2) {
      const slug = parts[1];
      if (slug === 'create') {
        segments[1].isCurrent = false;
        segments.push({ labelKey: 'breadcrumb.newProject', href: null, isCurrent: true });
      } else {
        const projectUrl = getProjectDetailHref(slug);
        segments[1].isCurrent = false;
        segments.push({
          label: humanizeSlug(slug),
          href: projectUrl,
          isCurrent: parts.length === 2
        });

        if (parts.length >= 3) {
          const tab = parts[2];
          const tabLabelKeys: Record<string, string> = {
            settings: 'breadcrumb.settings',
            releases: 'breadcrumb.releases',
            variables: 'breadcrumb.variables'
          };

          segments[2].isCurrent = false;
          const labelKey = tabLabelKeys[tab];
          if (labelKey) {
            segments.push({ labelKey, href: null, isCurrent: true });
          } else {
            segments.push({ label: humanizeSlug(tab), href: null, isCurrent: true });
          }
        }
      }
    }

    return segments;
  }

  return [{ labelKey: 'breadcrumb.home', href: '/', isCurrent: true }];
}
