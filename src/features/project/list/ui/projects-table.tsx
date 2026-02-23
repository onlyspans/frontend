import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import type { Project } from '@/entities/project';

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
  onProjectClick?: (projectId: string) => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ProjectsTable(
  {
    projects,
    isLoading,
    onProjectClick
  }: ProjectsTableProps
) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Stages</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                Loading projects...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Stages</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No projects yet
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Stages</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              className={onProjectClick ? 'cursor-pointer' : ''}
              onClick={() => onProjectClick?.(project.id)}
            >
              <TableCell className="w-[50px] flex items-center justify-center">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(project.name)}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {project.description ?? '—'}
              </TableCell>
              <TableCell>
                {project.lifecycleStages?.length ? (
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                    {project.lifecycleStages.join(', ')}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
