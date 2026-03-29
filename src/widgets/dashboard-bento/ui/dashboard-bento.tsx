import { useEventsSearch } from '@/entities/event';
import { useEnvironments } from '@/entities/environment';
import { useProjects } from '@/entities/project';
import { useTranslation } from '@/shared/lib/i18n';
import {
  flattenRecentReleases,
  sortEnvironmentsForDashboard,
  sortProjectsForDashboard,
  type DashboardFlatRelease
} from '../lib/dashboard-bento-utils';
import { DashboardComingSoonTile } from './dashboard-coming-soon-tile';
import { DashboardEnvironmentsTile } from './dashboard-environments-tile';
import { DashboardEventsTile } from './dashboard-events-tile';
import { DashboardProjectsTile } from './dashboard-projects-tile';
import { DashboardReleasesTile } from './dashboard-releases-tile';

export function DashboardBento() {
  const { t } = useTranslation();
  const projectsQuery = useProjects();
  const environmentsQuery = useEnvironments();
  const eventsQuery = useEventsSearch({
    page: 1,
    size: 20,
    sortBy: 'timestamp',
    sortOrder: 'desc'
  });

  const projects = projectsQuery.data;
  const sortedProjects = projects ? sortProjectsForDashboard(projects).slice(0, 8) : [];
  const environments = environmentsQuery.data;
  const sortedEnvironments = environments ? sortEnvironmentsForDashboard(environments) : [];
  const events = eventsQuery.data?.events ?? [];

  const releaseInfo = projects
    ? flattenRecentReleases(projects)
    : { items: [] as DashboardFlatRelease[], hasNestedData: false };

  const invalidDate = t('pages.events.table.invalidTimestamp');

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-10 md:gap-4 md:auto-rows-min">
      <DashboardProjectsTile
        className="md:col-span-4 md:row-start-1 md:row-end-2"
        projects={sortedProjects}
        isLoading={projectsQuery.isLoading}
        isError={projectsQuery.isError}
      />

      <DashboardEnvironmentsTile
        className="md:col-span-3 md:row-start-1 md:row-end-2"
        environments={sortedEnvironments}
        isLoading={environmentsQuery.isLoading}
        isError={environmentsQuery.isError}
      />

      <DashboardEventsTile
        className="md:col-span-3 md:row-start-1 md:row-end-3"
        events={events}
        isLoading={eventsQuery.isLoading}
        isError={eventsQuery.isError}
        invalidDateLabel={invalidDate}
      />

      <DashboardReleasesTile
        className="md:col-span-7 md:row-start-2 md:row-end-4"
        flatReleases={releaseInfo.items}
        showPlaceholder={projectsQuery.isSuccess && !releaseInfo.hasNestedData}
        isLoadingProjects={projectsQuery.isLoading}
        isErrorProjects={projectsQuery.isError}
      />

      <DashboardComingSoonTile
        className="md:col-span-3 md:row-start-3 md:row-end-5"
        title={t('pages.dashboard.placeholders.monitoring.title')}
        description={t('pages.dashboard.placeholders.monitoring.subtitle')}
      />
      <DashboardComingSoonTile
        className="md:col-span-3 min-h-40"
        title={t('pages.dashboard.placeholders.deploys.title')}
        description={t('pages.dashboard.placeholders.deploys.subtitle')}
      />
      <DashboardComingSoonTile
        className="md:col-span-4"
        title={t('pages.dashboard.placeholders.integrations.title')}
        description={t('pages.dashboard.placeholders.integrations.subtitle')}
      />
    </div>
  );
}
