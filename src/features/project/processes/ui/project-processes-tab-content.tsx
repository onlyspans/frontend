import { useEffect, useMemo, useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism.css';
import { toast } from 'sonner';
import { CheckCircle2, CircleAlert } from 'lucide-react';
import type { Project, ProjectEnvironmentRef } from '@/entities/project';
import type { ProcessResponse } from '@/entities/process';
import {
  useCreateProcess,
  useProcess,
  useProcessesByProject,
  useValidateProcess
} from '@/entities/process';
import { useEnvironments } from '@/entities/environment';
import { useReleases } from '@/entities/release';
import type { Release } from '@/entities/release';
import { handleApiError } from '@/shared/api';
import { useTranslation } from '@/shared/lib/i18n';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { ScrollArea } from '@/shared/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(iso));
}

function getFingerprint({
  projectId,
  environmentId,
  releaseVersion,
  yaml
}: {
  projectId: string;
  environmentId: string;
  releaseVersion: string;
  yaml: string;
}) {
  return [projectId, environmentId, releaseVersion, yaml].join('|');
}

function getSortedProjectEnvironments(
  project: Project,
  allEnvironments: ReturnType<typeof useEnvironments>['data']
): ProjectEnvironmentRef[] {
  const environmentsById = new Map((allEnvironments ?? []).map((env) => [env.id, env] as const));
  const environments: ProjectEnvironmentRef[] =
    project.environments?.length
      ? project.environments
      : (project.environmentIds ?? [])
          .map((id) => environmentsById.get(id))
          .filter(Boolean)
          .map((env) => ({
            id: env!.id,
            name: env!.name,
            description: env!.description,
            color: env!.color,
            position: env!.position
          }));

  return [...environments].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

function getLatestRelease(releases: Release[]): Release | undefined {
  return [...releases].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];
}

function ProcessDetails({
  process,
  environmentName
}: {
  process: ProcessResponse | undefined;
  environmentName: string | undefined;
}) {
  const { t } = useTranslation();

  if (!process) {
    return (
      <div className="text-sm text-muted-foreground">
        {t('pages.projectProcesses.details.empty')}
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <div className="text-muted-foreground">{t('pages.projectProcesses.details.status')}</div>
          <Badge variant="outline">{process.status}</Badge>
        </div>
        <div>
          <div className="text-muted-foreground">{t('pages.projectProcesses.details.environment')}</div>
          <div>{environmentName ?? process.environmentId}</div>
        </div>
        <div>
          <div className="text-muted-foreground">{t('pages.projectProcesses.details.release')}</div>
          <div className="font-mono">{process.releaseVersion}</div>
        </div>
        <div>
          <div className="text-muted-foreground">{t('pages.projectProcesses.details.createdAt')}</div>
          <div>{formatDateTime(process.createdAt)}</div>
        </div>
      </div>

      <div>
        <div className="font-medium">{t('pages.projectProcesses.details.steps')}</div>
        <div className="mt-2 space-y-2">
          {process.steps.length === 0 ? (
            <div className="text-muted-foreground">{t('pages.projectProcesses.details.noSteps')}</div>
          ) : (
            process.steps.map((step) => (
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
            ))
          )}
        </div>
      </div>

      <div>
        <div className="font-medium">{t('pages.projectProcesses.details.variables')}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {process.variables.length === 0 ? (
            <span className="text-muted-foreground">
              {t('pages.projectProcesses.details.noVariables')}
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

export function ProjectProcessesTabContent({ project }: { project: Project }) {
  const { t } = useTranslation();
  const environmentsQuery = useEnvironments();
  const releasesQuery = useReleases(project.id, { page: 1, pageSize: 100 });
  const processesQuery = useProcessesByProject(project.id);
  const validateMutation = useValidateProcess();
  const createMutation = useCreateProcess(project.id);

  const environments = useMemo(
    () => getSortedProjectEnvironments(project, environmentsQuery.data),
    [project, environmentsQuery.data]
  );
  const latestRelease = useMemo(
    () => getLatestRelease(releasesQuery.data?.items ?? []),
    [releasesQuery.data?.items]
  );

  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [environmentId, setEnvironmentId] = useState('');
  const [releaseVersion, setReleaseVersion] = useState('');
  const [yaml, setYaml] = useState('');
  const [validatedFingerprint, setValidatedFingerprint] = useState<string | null>(null);

  const sortedProcesses = useMemo(
    () =>
      [...(processesQuery.data ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [processesQuery.data]
  );

  useEffect(() => {
    if (!selectedProcessId && sortedProcesses[0]) {
      setSelectedProcessId(sortedProcesses[0].id);
    }
  }, [selectedProcessId, sortedProcesses]);

  useEffect(() => {
    if (!environmentId && environments[0]) {
      setEnvironmentId(environments[0].id);
    }
  }, [environmentId, environments]);

  useEffect(() => {
    if (!releaseVersion && latestRelease) {
      setReleaseVersion(latestRelease.version);
    }
  }, [latestRelease, releaseVersion]);

  const selectedProcessQuery = useProcess(selectedProcessId);
  const currentProcess =
    selectedProcessQuery.data ?? sortedProcesses.find((process) => process.id === selectedProcessId);
  const environmentNameById = new Map(environments.map((env) => [env.id, env.name] as const));
  const currentFingerprint = getFingerprint({
    projectId: project.id,
    environmentId,
    releaseVersion,
    yaml
  });
  const hasValidSnapshot =
    validateMutation.data?.isValid === true && validatedFingerprint === currentFingerprint;
  const canSubmit = Boolean(environmentId && releaseVersion && yaml.trim() && hasValidSnapshot);

  const resetValidation = () => {
    setValidatedFingerprint(null);
    validateMutation.reset();
  };

  const handleValidate = async () => {
    try {
      const result = await validateMutation.mutateAsync({
        yaml,
        projectId: project.id,
        environmentId
      });
      if (result.isValid) {
        setValidatedFingerprint(currentFingerprint);
        toast.success(t('pages.projectProcesses.toast.validated'));
      } else {
        setValidatedFingerprint(null);
        toast.error(t('pages.projectProcesses.toast.validationFailed'));
      }
    } catch (error) {
      setValidatedFingerprint(null);
      toast.error(t('pages.projectProcesses.toast.validationFailed'), {
        description: handleApiError(error)
      });
    }
  };

  const handleCreate = async () => {
    try {
      const process = await createMutation.mutateAsync({
        projectId: project.id,
        environmentId,
        releaseVersion,
        yaml
      });
      toast.success(t('pages.projectProcesses.toast.created'));
      setSelectedProcessId(process.id);
      setValidatedFingerprint(null);
      validateMutation.reset();
    } catch (error) {
      toast.error(t('pages.projectProcesses.toast.createFailed'), {
        description: handleApiError(error)
      });
      setValidatedFingerprint(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('pages.projectProcesses.title')}</h2>
        <p className="text-muted-foreground">
          {t('pages.projectProcesses.subtitle', { projectName: project.name })}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
        <Card>
          <CardHeader>
            <CardTitle>{t('pages.projectProcesses.list.title')}</CardTitle>
            <CardDescription>{t('pages.projectProcesses.list.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[620px] pr-3">
              <div className="space-y-2">
                {processesQuery.isLoading ? (
                  <div className="text-sm text-muted-foreground">
                    {t('pages.projectProcesses.list.loading')}
                  </div>
                ) : processesQuery.isError ? (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {t('pages.projectProcesses.list.error')}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void processesQuery.refetch()}
                    >
                      {t('pages.projectProcesses.list.retry')}
                    </Button>
                  </div>
                ) : sortedProcesses.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    {t('pages.projectProcesses.list.empty')}
                  </div>
                ) : (
                  sortedProcesses.map((process) => (
                    <button
                      key={process.id}
                      type="button"
                      className={[
                        'w-full rounded-md border p-3 text-left transition-colors hover:bg-muted/50',
                        selectedProcessId === process.id ? 'border-primary bg-muted/50' : ''
                      ].join(' ')}
                      onClick={() => setSelectedProcessId(process.id)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{process.releaseVersion}</span>
                        <Badge variant="outline">{process.status}</Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {environmentNameById.get(process.environmentId) ?? process.environmentId}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {formatDateTime(process.createdAt)}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('pages.projectProcesses.details.title')}</CardTitle>
              <CardDescription>{t('pages.projectProcesses.details.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ProcessDetails
                process={currentProcess}
                environmentName={
                  currentProcess ? environmentNameById.get(currentProcess.environmentId) : undefined
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('pages.projectProcesses.create.title')}</CardTitle>
              <CardDescription>{t('pages.projectProcesses.create.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('pages.projectProcesses.form.environment')}</Label>
                  <Select
                    value={environmentId}
                    onValueChange={(value) => {
                      setEnvironmentId(value);
                      resetValidation();
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('pages.projectProcesses.form.environmentPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {environments.map((env) => (
                        <SelectItem key={env.id} value={env.id}>
                          {env.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('pages.projectProcesses.form.releaseVersion')}</Label>
                  <Select
                    value={releaseVersion}
                    onValueChange={(value) => {
                      setReleaseVersion(value);
                      resetValidation();
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('pages.projectProcesses.form.releasePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {(releasesQuery.data?.items ?? []).map((release) => (
                        <SelectItem key={release.id} value={release.version}>
                          {release.version}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('pages.projectProcesses.form.yaml')}</Label>
                <div className="min-h-[280px] overflow-hidden rounded-md border bg-background font-mono text-sm">
                  <Editor
                    value={yaml}
                    onValueChange={(value) => {
                      setYaml(value);
                      resetValidation();
                    }}
                    highlight={(code) => Prism.highlight(code, Prism.languages.yaml, 'yaml')}
                    padding={12}
                    textareaClassName="outline-none"
                    className="min-h-[280px]"
                  />
                </div>
              </div>

              {validateMutation.data ? (
                <div className="space-y-3 rounded-md border p-3 text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    {validateMutation.data.isValid ? (
                      <CheckCircle2 className="size-4 text-green-600" />
                    ) : (
                      <CircleAlert className="size-4 text-destructive" />
                    )}
                    {validateMutation.data.isValid
                      ? t('pages.projectProcesses.validation.valid')
                      : t('pages.projectProcesses.validation.invalid')}
                  </div>

                  {validateMutation.data.errors.length > 0 ? (
                    <div>
                      <div className="font-medium">{t('pages.projectProcesses.validation.errors')}</div>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                        {validateMutation.data.errors.map((error) => (
                          <li key={error}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {validateMutation.data.warnings.length > 0 ? (
                    <div>
                      <div className="font-medium">{t('pages.projectProcesses.validation.warnings')}</div>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                        {validateMutation.data.warnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {validateMutation.data.unresolvedVariables.length > 0 ? (
                    <div>
                      <div className="font-medium">
                        {t('pages.projectProcesses.validation.unresolvedVariables')}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {validateMutation.data.unresolvedVariables.map((name) => (
                          <Badge key={name} variant="outline">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {validateMutation.data.steps?.length ? (
                    <div>
                      <div className="font-medium">{t('pages.projectProcesses.validation.steps')}</div>
                      <div className="mt-1 space-y-1 text-muted-foreground">
                        {validateMutation.data.steps.map((step) => (
                          <div key={`${step.order}-${step.name}`}>
                            {step.order}. {step.name} ({step.type})
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleValidate()}
                  disabled={!environmentId || !yaml.trim() || validateMutation.isPending}
                >
                  {validateMutation.isPending
                    ? t('pages.projectProcesses.validation.validating')
                    : t('pages.projectProcesses.validation.action')}
                </Button>
                <Button
                  type="button"
                  onClick={() => void handleCreate()}
                  disabled={!canSubmit || createMutation.isPending}
                >
                  {createMutation.isPending
                    ? t('pages.projectProcesses.create.creating')
                    : t('pages.projectProcesses.create.action')}
                </Button>
                {!hasValidSnapshot ? (
                  <span className="text-sm text-muted-foreground">
                    {t('pages.projectProcesses.validation.requiredHint')}
                  </span>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
