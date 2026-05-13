import { Link } from 'react-router-dom';
import { Check, CircleX } from 'lucide-react';
import type { Environment } from '@/entities/environment';
import type { RecentReleaseItem, RecentReleaseProject } from '@/entities/release';
import type { ProjectEnvironmentRef } from '@/entities/project';
import { ProjectIcon } from '@/entities/project';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { useTranslation } from '@/shared/lib/i18n';
import { getContrastTextColor } from '@/shared/lib/color/get-contrast-text-color';
import type { StubDeploymentsMap } from '@/features/project/releases';
import { cn } from '@/shared/lib';

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(iso));
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeStyle: 'short'
  }).format(new Date(iso));
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short'
  }).format(new Date(iso));
}

function getStubKey(releaseId: string, environmentId: string): string {
  return `${releaseId}:${environmentId}`;
}

function canDeployStage(
  releaseId: string,
  stageIndex: number,
  pipeline: ProjectEnvironmentRef[],
  stubDeployments: StubDeploymentsMap
): boolean {
  if (stageIndex === 0) return true;
  const prevEnv = pipeline[stageIndex - 1];
  const prevKey = getStubKey(releaseId, prevEnv.id);
  return stubDeployments[prevKey]?.status === 'success';
}

/** Цепочка деплоя проекта: порядок этапов по данным API / справочнику окружений */
function buildRecentReleasePipeline(
  project: RecentReleaseProject,
  environmentsById: Map<string, Environment>
): ProjectEnvironmentRef[] {
  if (project.environments?.length) {
    return [...project.environments]
      .sort((a, b) => a.position - b.position)
      .map((e) => ({
        id: e.id,
        name: e.name,
        description: e.description,
        color: e.color,
        position: e.position
      }));
  }
  return (project.environmentIds ?? [])
    .map((id) => environmentsById.get(id))
    .filter(Boolean)
    .map((env) => ({
      id: env!.id,
      name: env!.name,
      description: env!.description,
      color: env!.color,
      position: env!.position
    }))
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

export interface RecentReleasesTableProps {
  className?: string;
  headerClassName?: string;
  items: RecentReleaseItem[];
  columnEnvironments: Environment[];
  environmentsById: Map<string, Environment>;
  isLoading: boolean;
  stubDeployments: StubDeploymentsMap;
  onDeploy: (releaseId: string, environmentId: string) => void;
  maxRows?: number;
  showTagsColumn?: boolean;
}

export function RecentReleasesTable({
  className,
  headerClassName,
  items,
  columnEnvironments,
  environmentsById,
  isLoading,
  stubDeployments,
  onDeploy,
  maxRows,
  showTagsColumn = true
}: RecentReleasesTableProps) {
  const { t } = useTranslation();
  const rows = maxRows != null ? items.slice(0, maxRows) : items;
  const tagCol = showTagsColumn ? 1 : 0;
  const colCount = 3 + tagCol + columnEnvironments.length + 1;

  const headerRow = (
    <TableRow>
      <TableHead className="w-10"></TableHead>
      <TableHead>{t('pages.releases.table.project')}</TableHead>
      {showTagsColumn ? (
        <TableHead className="min-w-[140px]">{t('project.table.tags')}</TableHead>
      ) : null}
      <TableHead>{t('pages.releases.table.version')}</TableHead>
      {columnEnvironments.map((env) => (
        <TableHead key={env.id}>{env.name}</TableHead>
      ))}
      <TableHead>{t('pages.releases.table.createdAt')}</TableHead>
    </TableRow>
  );

  if (isLoading) {
    return (
      <div className={cn('rounded-md border bg-card', className)}>
        <Table>
          <TableHeader className={cn('bg-secondary', headerClassName)}>
            {headerRow}
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={colCount} className="text-center py-8 text-muted-foreground">
                {t('pages.releases.table.loading')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className={cn('rounded-md border bg-card', className)}>
        <Table>
          <TableHeader className={cn('bg-secondary', headerClassName)}>
            {headerRow}
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={colCount} className="text-center py-8 text-muted-foreground">
                {t('pages.releases.table.empty')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className={cn('rounded-md border bg-card', className)}>
      <Table>
        <TableHeader className={cn('bg-secondary', headerClassName)}>
          {headerRow}
        </TableHeader>
        <TableBody>
          {rows.map((item) => {
            const pipeline = buildRecentReleasePipeline(item.project, environmentsById);
            const iconProject = {
              name: item.project.name,
              imageUrl: item.project.imageUrl,
              emoji: item.project.emoji
            };
            return (
              <TableRow key={item.id}>
                <TableCell className="w-10">
                  <ProjectIcon project={iconProject} size="sm" />
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    to={`/projects/${item.project.slug}/releases`}
                    className="hover:underline"
                  >
                    {item.project.name}
                  </Link>
                </TableCell>
                {showTagsColumn ? (
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {(item.project.tags ?? []).length > 0
                        ? (item.project.tags ?? []).map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="secondary"
                              className="text-xs font-normal"
                              style={
                                tag.color
                                  ? {
                                      backgroundColor: tag.color,
                                      color: getContrastTextColor(tag.color),
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
                ) : null}
                <TableCell>{item.version}</TableCell>
                {columnEnvironments.map((colEnv) => {
                  const stageIndex = pipeline.findIndex((p) => p.id === colEnv.id);
                  if (stageIndex < 0) {
                    return (
                      <TableCell key={colEnv.id} className="text-muted-foreground">
                        —
                      </TableCell>
                    );
                  }
                  const key = getStubKey(item.id, colEnv.id);
                  const stub = stubDeployments[key];
                  const deployAllowed = canDeployStage(
                    item.id,
                    stageIndex,
                    pipeline,
                    stubDeployments
                  );
                  if (stub) {
                    return (
                      <TableCell key={colEnv.id} className="text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Button
                            variant={stub.status === 'success' ? 'default' : 'destructive'}
                            size="icon"
                            aria-label={
                              stub.status === 'success'
                                ? t('project.releases.table.deployedSuccess')
                                : t('project.releases.table.deployedFailed')
                            }
                          >
                            {stub.status === 'success' ? (
                              <Check className="h-4 w-4" aria-hidden />
                            ) : (
                              <CircleX className="h-4 w-4" aria-hidden />
                            )}
                          </Button>
                          <div className="flex flex-col">
                            <span className="text-xs">{formatTime(stub.deployedAt)}</span>
                            <span className="text-xs">{formatDate(stub.deployedAt)}</span>
                          </div>
                        </span>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={colEnv.id}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!deployAllowed}
                        title={
                          !deployAllowed
                            ? t('project.releases.table.deployDisabledHint')
                            : undefined
                        }
                        onClick={() => deployAllowed && onDeploy(item.id, colEnv.id)}
                      >
                        {t('project.releases.table.deploy')}
                      </Button>
                    </TableCell>
                  );
                })}
                <TableCell className="text-muted-foreground">
                  {formatDateTime(item.createdAt)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
