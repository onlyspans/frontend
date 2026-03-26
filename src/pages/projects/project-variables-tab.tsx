import { useOutletContext } from 'react-router-dom';
import type { Project } from '@/entities/project';
import { ProjectVariablesTabContent } from '@/features/project/variables';

export function ProjectVariablesTab() {
  const { project } = useOutletContext<{ project: Project }>();

  return <ProjectVariablesTabContent project={project} />;
}
