import { useOutletContext } from 'react-router-dom';
import type { Project } from '@/entities/project';

export function ProjectOverviewTab() {
  const { project } = useOutletContext<{ project: Project }>();

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-2">Overview</h2>
      <p className="text-muted-foreground">
        {project.description ?? 'No description provided.'}
      </p>
      <p className="text-muted-foreground text-sm mt-4">
        More details and activity will appear here soon.
      </p>
    </div>
  );
}
