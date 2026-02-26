import type { Project } from '../model/project';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { cn } from '@/shared/lib/utils';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface ProjectIconProps {
  project: Pick<Project, 'name' | 'imageUrl' | 'emoji'>;
  className?: string;
}

export function ProjectIcon({ project, className }: ProjectIconProps) {
  return (
    <Avatar className={cn('size-8', className)}>
      {project.imageUrl ? (
        <AvatarImage src={project.imageUrl} alt="" className="object-cover" />
      ) : null}
      <AvatarFallback
        className={cn('font-medium', project.emoji ? 'text-xl' : 'text-xs')}
        aria-hidden
      >
        {project.emoji ?? getInitials(project.name)}
      </AvatarFallback>
    </Avatar>
  );
}
