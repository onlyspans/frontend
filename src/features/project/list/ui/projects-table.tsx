import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import type { Project, ProjectSortField, SortOrder } from '@/entities/project';

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
  onProjectClick?: (projectId: string) => void;
  sortBy?: ProjectSortField;
  sortOrder?: SortOrder;
  onSort?: (field: ProjectSortField) => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function SortHeader({
  label,
  field,
  currentSortBy,
  sortOrder,
  onSort
}: {
  label: string;
  field: ProjectSortField;
  currentSortBy?: ProjectSortField;
  sortOrder?: SortOrder;
  onSort?: (field: ProjectSortField) => void;
}) {
  const isActive = currentSortBy === field;
  if (!onSort) return <TableHead>{label}</TableHead>;
  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex items-center gap-1 hover:underline font-medium"
      >
        {label}
        {isActive && (
          <span className="text-muted-foreground text-xs">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </button>
    </TableHead>
  );
}

export function ProjectsTable(
  {
    projects,
    isLoading,
    onProjectClick,
    sortBy,
    sortOrder,
    onSort
  }: ProjectsTableProps
) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Icon</TableHead>
              <SortHeader label="Name" field="name" currentSortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
              <TableHead>Description</TableHead>
              <TableHead>Stages</TableHead>
              <TableHead>Tags</TableHead>
              <SortHeader label="Status" field="status" currentSortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
              <SortHeader label="Created" field="createdAt" currentSortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
              <TableHead>Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
            <SortHeader label="Name" field="name" currentSortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Description</TableHead>
            <TableHead>Stages</TableHead>
            <TableHead>Tags</TableHead>
            <SortHeader label="Status" field="status" currentSortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader label="Created" field="createdAt" currentSortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
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
              <TableCell className="text-muted-foreground max-w-[200px] truncate">
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
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[180px]">
                  {project.tags?.length
                    ? project.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="text-xs font-normal"
                          style={
                            tag.color
                              ? {
                                  backgroundColor: tag.color,
                                  color: '#fff',
                                  borderColor: 'transparent'
                                }
                              : undefined
                          }
                        >
                          {tag.name}
                        </Badge>
                      ))
                    : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                </div>
              </TableCell>
              <TableCell>
                <span className="capitalize text-sm">{project.status}</span>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {project.createdAt
                  ? new Date(project.createdAt).toLocaleDateString()
                  : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
