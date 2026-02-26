import { useOutletContext } from 'react-router-dom';
import type { Project } from '@/entities/project';

export function ProjectReleasesTab() {
  useOutletContext<{ project: Project }>();

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-2">Releases</h2>
      <p className="text-muted-foreground">Release history will appear here.</p>
    </div>
  );
}
