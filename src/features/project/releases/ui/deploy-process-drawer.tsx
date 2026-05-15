import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import type { Project, ProjectEnvironmentRef } from '@/entities/project';
import type { Release } from '@/entities/release';
import type {
  DeploymentLogEntry,
  DeploymentLogsConnectionState,
  DeploymentResponse,
  ProcessResponse
} from '@/entities/process';
import {
  useDeployProcess,
  useDeploymentLogs,
  useDeploymentLogsStream,
  useProcess
} from '@/entities/process';
import { handleApiError } from '@/shared/api';
import { useTranslation, type TypedTFunction } from '@/shared/lib/i18n';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/shared/ui/drawer';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

const LOG_LIMIT = 3000;

interface DeployContext {
  release: Release;
  environment: ProjectEnvironmentRef;
  process: ProcessResponse;
  deploymentId?: string;
}

interface DeployProcessDrawerProps {
  project: Project;
  context: DeployContext | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeploymentResult: (result: DeploymentResponse) => void;
}

function getSnapshotKey(projectId: string, version: string): string {
  return `snapshots/${projectId}/${version}.json@${version}`;
}

function isErrorDeployment(status: string): boolean {
  return ['Failed', 'Cancelled', 'RolledBack'].includes(status);
}

function isSuccessDeployment(status: string): boolean {
  return status === 'Completed';
}

function getApiErrorDescription(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined;
    if (data?.error) return data.error;
  }
  return handleApiError(error);
}

function getConnectionLabel(t: TypedTFunction, state: DeploymentLogsConnectionState): string {
  switch (state) {
    case 'connecting':
      return t('project.releases.drawer.logs.connection.connecting');
    case 'connected':
      return t('project.releases.drawer.logs.connection.connected');
    case 'reconnecting':
      return t('project.releases.drawer.logs.connection.reconnecting');
    case 'disconnected':
      return t('project.releases.drawer.logs.connection.disconnected');
    case 'error':
      return t('project.releases.drawer.logs.connection.error');
    case 'idle':
    default:
      return t('project.releases.drawer.logs.connection.idle');
  }
}

function capEntries(entries: DeploymentLogEntry[]): DeploymentLogEntry[] {
  return entries.slice(Math.max(entries.length - LOG_LIMIT, 0));
}

function mergeEntries(
  current: DeploymentLogEntry[],
  incoming: DeploymentLogEntry[]
): DeploymentLogEntry[] {
  const keys = new Set(current.map((entry) => getLogKey(entry)));
  const merged = [...current];
  for (const entry of incoming) {
    const key = getLogKey(entry);
    if (!keys.has(key)) {
      keys.add(key);
      merged.push(entry);
    }
  }
  return capEntries(merged);
}

function getLogKey(entry: DeploymentLogEntry): string {
  return `${entry.timestamp}|${entry.level}|${entry.source ?? ''}|${entry.message}`;
}

function ProcessTab({
  process,
  selectedReleaseVersion
}: {
  process: ProcessResponse | undefined;
  selectedReleaseVersion: string;
}) {
  const { t } = useTranslation();

  if (!process) {
    return <div className="text-sm text-muted-foreground">{t('project.releases.drawer.process.loading')}</div>;
  }

  const isFallback = process.releaseVersion !== selectedReleaseVersion;

  return (
    <div className="space-y-4 text-sm">
      {isFallback ? (
        <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 p-3">
          <div className="font-medium">{t('project.releases.drawer.process.fallbackTitle')}</div>
          <div className="text-muted-foreground">
            {t('project.releases.drawer.process.fallbackDescription')}
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <div className="text-muted-foreground">{t('project.releases.drawer.process.id')}</div>
          <div className="break-all font-mono">{process.id}</div>
        </div>
        <div>
          <div className="text-muted-foreground">{t('project.releases.drawer.process.status')}</div>
          <Badge variant="outline">{process.status}</Badge>
        </div>
        <div>
          <div className="text-muted-foreground">{t('project.releases.drawer.process.releaseVersion')}</div>
          <div className="font-mono">{process.releaseVersion}</div>
        </div>
        <div>
          <div className="text-muted-foreground">{t('project.releases.drawer.process.environmentId')}</div>
          <div className="break-all font-mono">{process.environmentId}</div>
        </div>
      </div>

      <div>
        <div className="font-medium">{t('project.releases.drawer.process.steps')}</div>
        <div className="mt-2 space-y-2">
          {process.steps.map((step) => (
            <div key={step.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">
                  {step.order}. {step.name}
                </span>
                <Badge variant="secondary">{step.status}</Badge>
              </div>
              <div className="mt-1 text-muted-foreground">
                {step.type}
                {step.description ? ` · ${step.description}` : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="font-medium">{t('project.releases.drawer.process.variables')}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {process.variables.length === 0 ? (
            <span className="text-muted-foreground">
              {t('project.releases.drawer.process.noVariables')}
            </span>
          ) : (
            process.variables.map((variable) => (
              <Badge key={variable.name} variant="outline">
                {variable.name}: {variable.hasValue ? t('common.yes') : t('common.no')}
              </Badge>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function LogsTab({
  deploymentId,
  open,
  active
}: {
  deploymentId: string | null;
  open: boolean;
  active: boolean;
}) {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<DeploymentLogEntry[]>([]);
  const trimNotifiedRef = useRef(false);
  const logsQuery = useDeploymentLogs(deploymentId);

  useEffect(() => {
    setEntries([]);
    trimNotifiedRef.current = false;
  }, [deploymentId]);

  useEffect(() => {
    if (logsQuery.data?.entries) {
      setEntries((current) => mergeEntries(current, logsQuery.data.entries));
    }
  }, [logsQuery.data?.entries]);

  const appendLog = useCallback((entry: DeploymentLogEntry) => {
    setEntries((current) => {
      const next = mergeEntries(current, [entry]);
      if (next.length === LOG_LIMIT && current.length >= LOG_LIMIT && !trimNotifiedRef.current) {
        trimNotifiedRef.current = true;
        toast.info(t('project.releases.drawer.logs.trimmed'));
      }
      return next;
    });
  }, [t]);

  const stream = useDeploymentLogsStream({
    deploymentId,
    enabled: open && active && !!deploymentId,
    onLog: appendLog
  });

  const logText = useMemo(
    () =>
      entries
        .map(
          (entry) =>
            `${entry.timestamp} [${entry.level}]${entry.source ? ` [${entry.source}]` : ''} ${entry.message}`
        )
        .join('\n'),
    [entries]
  );

  if (!deploymentId) {
    return <div className="text-sm text-muted-foreground">{t('project.releases.drawer.logs.empty')}</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="outline">
          {getConnectionLabel(t, stream.state)}
        </Badge>
        {stream.error ? <span className="text-muted-foreground">{stream.error}</span> : null}
        {logsQuery.isFetching ? (
          <span className="text-muted-foreground">{t('project.releases.drawer.logs.loading')}</span>
        ) : null}
      </div>

      <div className="h-[520px] overflow-auto rounded-md border bg-muted/30 p-3">
        {entries.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            {t('project.releases.drawer.logs.noEntries')}
          </div>
        ) : (
          <pre className="min-w-full w-max select-text whitespace-pre font-mono text-xs leading-relaxed">
            {logText}
          </pre>
        )}
      </div>
    </div>
  );
}

export function DeployProcessDrawer({
  project,
  context,
  open,
  onOpenChange,
  onDeploymentResult
}: DeployProcessDrawerProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState('deploy');
  const [targetId, setTargetId] = useState('');
  const [targetType, setTargetType] = useState('');
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const deployMutation = useDeployProcess();
  const processQuery = useProcess(context?.process.id);

  const snapshotKey = context
    ? getSnapshotKey(project.id, context.release.version)
    : '';
  const process = processQuery.data ?? context?.process;

  useEffect(() => {
    if (open) {
      setTab(context?.deploymentId ? 'logs' : 'deploy');
      setDeploymentId(context?.deploymentId ?? null);
      setTargetId('');
      setTargetType('');
    }
  }, [context, open]);

  const handleDeploy = async () => {
    if (!context) return;

    try {
      const result = await deployMutation.mutateAsync({
        processId: context.process.id,
        targetId: targetId.trim(),
        targetType: targetType.trim(),
        snapshotKey
      });

      if (isSuccessDeployment(result.status)) {
        toast.success(t('project.releases.drawer.toast.completed'), {
          description: result.summary ?? undefined
        });
      } else if (isErrorDeployment(result.status)) {
        toast.error(t('project.releases.drawer.toast.failed'), {
          description: result.errorMessage ?? result.errorType ?? result.summary ?? undefined
        });
      } else {
        toast.info(t('project.releases.drawer.toast.started'), {
          description: result.summary ?? result.status
        });
      }

      setDeploymentId(result.deploymentId);
      setTab('logs');
      onDeploymentResult(result);
    } catch (error) {
      toast.error(t('project.releases.drawer.toast.startFailed'), {
        description: getApiErrorDescription(error)
      });
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="sm:max-w-3xl">
        <DrawerHeader>
          <DrawerTitle>{t('project.releases.drawer.title')}</DrawerTitle>
          <DrawerDescription>
            {context
              ? t('project.releases.drawer.description', {
                  version: context.release.version,
                  environment: context.environment.name
                })
              : t('project.releases.drawer.noContext')}
          </DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4">
          <Tabs value={tab} onValueChange={setTab} className="h-full">
            <TabsList>
              <TabsTrigger value="deploy">{t('project.releases.drawer.tabs.deploy')}</TabsTrigger>
              <TabsTrigger value="process">{t('project.releases.drawer.tabs.process')}</TabsTrigger>
              <TabsTrigger value="logs">{t('project.releases.drawer.tabs.logs')}</TabsTrigger>
            </TabsList>

            <TabsContent value="deploy" className="space-y-4 pt-3">
              <div className="space-y-2">
                <Label htmlFor="deploy-target-id">{t('project.releases.drawer.deploy.targetId')}</Label>
                <Input
                  id="deploy-target-id"
                  value={targetId}
                  onChange={(event) => setTargetId(event.target.value)}
                  placeholder={t('project.releases.drawer.deploy.targetIdPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deploy-target-type">{t('project.releases.drawer.deploy.targetType')}</Label>
                <Input
                  id="deploy-target-type"
                  value={targetType}
                  onChange={(event) => setTargetType(event.target.value)}
                  placeholder={t('project.releases.drawer.deploy.targetTypePlaceholder')}
                />
                <div className="text-xs text-muted-foreground">
                  {t('project.releases.drawer.deploy.targetTypeHint')}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('project.releases.drawer.deploy.snapshotKey')}</Label>
                <div className="break-all rounded-md border bg-muted/50 p-3 font-mono text-xs">
                  {snapshotKey}
                </div>
              </div>
              <Button
                type="button"
                onClick={() => void handleDeploy()}
                disabled={!context || !targetId.trim() || !targetType.trim() || deployMutation.isPending}
              >
                {deployMutation.isPending
                  ? t('project.releases.drawer.deploy.starting')
                  : t('project.releases.drawer.deploy.start')}
              </Button>
            </TabsContent>

            <TabsContent value="process" className="pt-3">
              <ProcessTab process={process} selectedReleaseVersion={context?.release.version ?? ''} />
            </TabsContent>

            <TabsContent value="logs" className="pt-3">
              <LogsTab deploymentId={deploymentId} open={open} active={tab === 'logs'} />
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
