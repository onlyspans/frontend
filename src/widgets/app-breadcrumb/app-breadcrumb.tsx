import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/shared/ui/breadcrumb';
import { useProjectBySlug } from '@/entities/project';

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

type Segment = { label: string; href: string | null; isCurrent: boolean };

function useBreadcrumbSegments(): Segment[] {
  const location = useLocation();
  const pathname = location.pathname;
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) {
    return [{ label: 'Home', href: '/', isCurrent: true }];
  }

  const spaceSlug = parts[0];
  const baseUrl = `/${spaceSlug}`;
  const segments: Segment[] = [{ label: 'Home', href: baseUrl, isCurrent: parts.length === 1 }];

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

function getProjectSlugFromPathname(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length >= 3 && parts[1] === 'projects' && parts[2] !== 'create') {
    return parts[2];
  }
  return null;
}

function AppBreadcrumbContent() {
  const location = useLocation();
  const segments = useBreadcrumbSegments();
  const projectSlug = getProjectSlugFromPathname(location.pathname);
  const { data: project } = useProjectBySlug(projectSlug ?? '');

  const resolvedSegments = segments.map((seg, i) => {
    if (i === 2 && project?.name && projectSlug) {
      return { ...seg, label: project.name };
    }
    return seg;
  });

  if (resolvedSegments.length === 1) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{resolvedSegments[0].label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {resolvedSegments.flatMap((seg, index) => {
          const item = (
            <BreadcrumbItem key={index}>
              {seg.isCurrent ? (
                <BreadcrumbPage>{seg.label}</BreadcrumbPage>
              ) : seg.href ? (
                <BreadcrumbLink asChild>
                  <Link to={seg.href}>{seg.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{seg.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
          const separator =
            index < resolvedSegments.length - 1 ? (
              <BreadcrumbSeparator key={`sep-${index}`} />
            ) : null;
          return separator ? [item, separator] : [item];
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function AppBreadcrumb() {
  return <AppBreadcrumbContent />;
}
