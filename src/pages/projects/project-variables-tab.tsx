import { useOutletContext } from 'react-router-dom';
import type { Project } from '@/entities/project';
import { useTranslation } from '@/shared/lib/i18n';

export function ProjectVariablesTab() {
  const { project } = useOutletContext<{ project: Project }>();
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{t('pages.projectVariables.title')}</h2>
      <p className="text-muted-foreground">{t('pages.projectVariables.subtitle', { projectName: project.name })}</p>
    </div>
  );
}
