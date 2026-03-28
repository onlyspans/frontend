/**
 * Target URL when switching to another project.
 * Inside `/projects/:slug/...` (except create) — preserve tab segments after the slug.
 * Otherwise — open project overview.
 */
export function getProjectNavigationTarget(newSlug: string, pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'projects' && parts[1] && parts[1] !== 'create') {
    const suffix = parts.slice(2).filter(Boolean).join('/');
    return suffix ? `/projects/${newSlug}/${suffix}` : `/projects/${newSlug}`;
  }
  return `/projects/${newSlug}`;
}
