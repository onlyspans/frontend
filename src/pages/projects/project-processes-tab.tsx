import { useOutletContext } from 'react-router-dom';
import type { Project } from '@/entities/project';
import { ProjectProcessesTabContent } from '@/features/project/processes';

export function ProjectProcessesTab() {
  const { project } = useOutletContext<{ project: Project }>();

  return <ProjectProcessesTabContent project={project} />;
}
