import { useOutletContext } from 'react-router-dom';
import type { Project } from '@/entities/project';
import { useTranslation } from '@/shared/lib/i18n';

export function ProjectOverviewTab() {
  const { project } = useOutletContext<{ project: Project }>();
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-2">{t('pages.projectOverview.title')}</h2>
      <p className="text-muted-foreground">
        {project.description ?? t('pages.projectOverview.noDescription')}
      </p>
      <p className="text-muted-foreground text-sm mt-4">
        {t('pages.projectOverview.moreDetails')}
      </p>
    </div>
  );
}
