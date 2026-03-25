import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { ProjectIcon, type Project, type ProjectSortField, type SortOrder } from '@/entities/project';
import { useEnvironments } from '@/entities/environment';
import { useTranslation } from '@/shared/lib/i18n';

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
  onProjectClick?: (projectSlug: string) => void;
  sortBy?: ProjectSortField;
  sortOrder?: SortOrder;
  onSort?: (field: ProjectSortField) => void;
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
  const { t } = useTranslation();
  const isActive = currentSortBy === field;
  if (!onSort) return <TableHead>{label}</TableHead>;
  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex items-center gap-1 hover:underline font-medium"
        title={isActive ? undefined : `${t('project.sortBy')} ${label}`}
      >
        {label}
        {isActive && (
          <span className="text-muted-foreground text-xs" aria-label={sortOrder === 'asc' ? t('project.ascending') : t('project.descending')}>
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
  const { t } = useTranslation();
  const environmentsQuery = useEnvironments();

  const environmentsById = new Map(
    (environmentsQuery.data ?? []).map((env) => [env.id, env] as const)
  );

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">{t('project.table.icon')}</TableHead>
              <SortHeader label={t('project.table.name')} field="name" currentSortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
              <TableHead>{t('project.table.description')}</TableHead>
              <TableHead>{t('project.table.environments')}</TableHead>
              <TableHead>{t('project.table.tags')}</TableHead>
              <SortHeader label={t('project.table.status')} field="status" currentSortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                {t('project.table.loading')}
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
              <TableHead className="w-[60px]">{t('project.table.icon')}</TableHead>
              <TableHead>{t('project.table.name')}</TableHead>
              <TableHead>{t('project.table.description')}</TableHead>
              <TableHead>{t('project.table.environments')}</TableHead>
              <TableHead>{t('project.table.tags')}</TableHead>
              <TableHead>{t('project.table.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                {t('project.table.noProjects')}
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
            <SortHeader label={t('project.table.name')} field="name" currentSortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>{t('project.table.description')}</TableHead>
            <TableHead>{t('project.table.environments')}</TableHead>
            <TableHead>{t('project.table.tags')}</TableHead>
            <SortHeader label={t('project.table.status')} field="status" currentSortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              className={onProjectClick ? 'cursor-pointer' : ''}
              onClick={() => onProjectClick?.(project.slug)}
            >
              <TableCell className="w-[50px] flex items-center justify-center">
                <ProjectIcon project={project} />
              </TableCell>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell className="text-muted-foreground max-w-[250px] truncate">
                {project.description ?? '—'}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {project.environments?.length ? (
                    project.environments.map((env) => (
                      <Badge key={env.id} variant="secondary" className="text-xs font-normal">
                        {env.name}
                      </Badge>
                    ))
                  ) : project.environmentIds?.length ? (
                    project.environmentIds
                      .map((id) => environmentsById.get(id))
                      .filter(Boolean)
                      .map((env) => (
                        <Badge
                          key={env!.id}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {env!.name}
                        </Badge>
                      ))
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[250px]">
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
                <Badge
                  variant={
                    project.status === 'active'
                      ? 'default'
                      : project.status === 'archived'
                        ? 'secondary'
                        : 'outline'
                  }
                  className="capitalize font-normal"
                >
                  {t(`project.${project.status}` as 'project.active' | 'project.archived' | 'project.suspended')}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
