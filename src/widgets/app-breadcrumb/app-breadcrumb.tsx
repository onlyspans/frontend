import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/shared/ui/breadcrumb';
import {
  getAppBreadcrumbSegments,
  getProjectSlugFromPathname
} from '@/shared/lib/breadcrumb-segments';
import { useProjectBySlug } from '@/entities/project';

function AppBreadcrumbContent() {
  const location = useLocation();
  const segments = getAppBreadcrumbSegments(location.pathname);
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
