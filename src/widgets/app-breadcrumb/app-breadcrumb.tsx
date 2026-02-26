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
import { useTranslation } from '@/shared/lib/i18n';
import type { TranslationKey } from '@/shared/lib/i18n';

function AppBreadcrumbContent() {
  const location = useLocation();
  const { t } = useTranslation();
  const segments = getAppBreadcrumbSegments(location.pathname);
  const projectSlug = getProjectSlugFromPathname(location.pathname);
  const { data: project } = useProjectBySlug(projectSlug ?? '');

  const resolvedSegments = segments.map((seg, i) => {
    if (i === 2 && project?.name && projectSlug) {
      return { ...seg, label: project.name };
    }
    return seg;
  });

  const segmentLabel = (seg: (typeof resolvedSegments)[0]) =>
    seg.label != null ? seg.label : (seg.labelKey ? t(seg.labelKey as TranslationKey) : '');

  if (resolvedSegments.length === 1) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold">{segmentLabel(resolvedSegments[0])}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {resolvedSegments.flatMap((seg, index) => {
          const label = segmentLabel(seg);
          const item = (
            <BreadcrumbItem key={index}>
              {seg.isCurrent ? (
                <BreadcrumbPage className="font-semibold">{label}</BreadcrumbPage>
              ) : seg.href ? (
                <BreadcrumbLink asChild>
                  <Link to={seg.href} className="font-semibold">{label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-semibold">{label}</BreadcrumbPage>
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
