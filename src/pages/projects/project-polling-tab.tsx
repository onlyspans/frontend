import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'sonner';
import type { Project } from '@/entities/project';
import {
  type AgentRepository,
  useProjectAgentRepositories,
  useTriggerAgentRepositoryPoll
} from '@/entities/agent-repository';
import {
  pollingHistoryQueryKeys,
  useRepositoryPollingHistory,
  type PollingHistoryStatus
} from '@/entities/polling-history';
import { handleApiError } from '@/shared/api';
import { useTranslation } from '@/shared/lib/i18n';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';

const EMPTY_REPOSITORIES: AgentRepository[] = [];

function formatDateTime(iso: string | null): string {
  if (!iso) return '-';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(iso));
}

function shortSha(value: string | null): string {
  return value ? value.slice(0, 8) : '-';
}

function getStatusVariant(status: PollingHistoryStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'completed') return 'default';
  if (status === 'failed' || status === 'uploaded_notify_failed') return 'destructive';
  if (status === 'running') return 'secondary';
  return 'outline';
}

export function ProjectPollingTab() {
  const { project } = useOutletContext<{ project: Project }>();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const repositoriesQuery = useProjectAgentRepositories(project.id);
  const triggerPollMutation = useTriggerAgentRepositoryPoll();
  const [explicitRepositoryId, setExplicitRepositoryId] = useState('');
  const repositories = repositoriesQuery.data?.items ?? EMPTY_REPOSITORIES;
  const selectedRepositoryId =
    explicitRepositoryId && repositories.some((repository) => repository.id === explicitRepositoryId)
      ? explicitRepositoryId
      : repositories.length === 1
        ? repositories[0].id
        : '';
  const selectedRepository = repositories.find(
    (repository) => repository.id === selectedRepositoryId
  );
  const historyQuery = useRepositoryPollingHistory(selectedRepositoryId, {
    enabled: !!selectedRepositoryId
  });
  const history = historyQuery.data?.items ?? [];

  const handleTriggerPoll = async () => {
    if (!selectedRepositoryId) return;
    try {
      await triggerPollMutation.mutateAsync({
        repositoryId: selectedRepositoryId,
        projectId: project.id
      });
      await queryClient.invalidateQueries({
        queryKey: pollingHistoryQueryKeys.repository(selectedRepositoryId)
      });
      toast.success(t('pages.projectPolling.toast.pollStarted'));
    } catch (error) {
      toast.error(t('pages.projectPolling.toast.pollFailed'), {
        description: handleApiError(error)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          {t('pages.projectPolling.title')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('pages.projectPolling.subtitle')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('pages.projectPolling.repository.title')}</CardTitle>
          <CardDescription>
            {t('pages.projectPolling.repository.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={selectedRepositoryId}
            onValueChange={setExplicitRepositoryId}
            disabled={repositoriesQuery.isLoading || repositories.length === 0}
          >
            <SelectTrigger className="w-full sm:w-[420px]">
              <SelectValue placeholder={t('pages.projectPolling.repository.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {repositories.map((repository) => (
                <SelectItem key={repository.id} value={repository.id}>
                  <span className="block max-w-[360px] truncate">
                    {repository.url} ({repository.branch})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            disabled={!selectedRepositoryId || triggerPollMutation.isPending}
            onClick={handleTriggerPoll}
          >
            {triggerPollMutation.isPending
              ? t('pages.projectPolling.repository.polling')
              : t('pages.projectPolling.repository.poll')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('pages.projectPolling.history.title')}</CardTitle>
          <CardDescription>
            {selectedRepository
              ? (
                  <>
                    {t('pages.projectPolling.history.descriptionSelectedPrefix')}{' '}
                    <Button asChild variant="link" className="h-auto p-0 align-baseline">
                      <a href={selectedRepository.url} target="_blank" rel="noreferrer">
                        {selectedRepository.url}
                      </a>
                    </Button>
                    .
                  </>
                )
              : t('pages.projectPolling.history.descriptionEmpty')}
          </CardDescription>
          <CardAction>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!selectedRepositoryId || historyQuery.isFetching}
              onClick={() => void historyQuery.refetch()}
            >
              {historyQuery.isFetching
                ? t('pages.projectPolling.history.refreshing')
                : t('pages.projectPolling.history.refresh')}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>{t('pages.projectPolling.history.table.startedAt')}</TableHead>
                  <TableHead>{t('pages.projectPolling.history.table.status')}</TableHead>
                  <TableHead>{t('pages.projectPolling.history.table.ref')}</TableHead>
                  <TableHead>{t('pages.projectPolling.history.table.commit')}</TableHead>
                  <TableHead>{t('pages.projectPolling.history.table.artifact')}</TableHead>
                  <TableHead>{t('pages.projectPolling.history.table.completedAt')}</TableHead>
                  <TableHead>{t('pages.projectPolling.history.table.error')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!selectedRepositoryId ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      {repositories.length === 0 && !repositoriesQuery.isLoading
                        ? t('pages.projectPolling.history.noRepositories')
                        : t('pages.projectPolling.history.selectRepository')}
                    </TableCell>
                  </TableRow>
                ) : historyQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      {t('pages.projectPolling.history.loading')}
                    </TableCell>
                  </TableRow>
                ) : historyQuery.isError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-destructive">
                      {t('pages.projectPolling.history.error')}
                    </TableCell>
                  </TableRow>
                ) : history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      {t('pages.projectPolling.history.empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(item.startedAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{item.detectedRef ?? '-'}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {shortSha(item.commitSha)}
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-[220px] truncate">
                        {item.artifactVersion ?? item.artifactKey ?? '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(item.completedAt)}
                      </TableCell>
                      <TableCell className="max-w-[260px] truncate text-muted-foreground">
                        {item.errorMessage ?? '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
