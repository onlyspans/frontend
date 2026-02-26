import { useOutletContext } from 'react-router-dom';
import type { Project } from '@/entities/project';
import { ProjectSettingsGeneralForm } from '@/features/project/settings';
import { useTranslation } from '@/shared/lib/i18n';

export function ProjectSettingsTab() {
  const { project } = useOutletContext<{ project: Project }>();
  const { t } = useTranslation();

  return (
    <div className="flex gap-8">
      <aside className="w-48 shrink-0">
        <nav className="space-y-1">
          <a
            href="#general"
            className="block rounded-md px-3 py-2 text-sm font-medium bg-muted text-foreground"
          >
            {t('pages.projectSettings.general')}
          </a>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <ProjectSettingsGeneralForm project={project} />
      </div>
    </div>
  );
}
