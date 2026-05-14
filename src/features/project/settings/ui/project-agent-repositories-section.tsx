import { useState, type FormEvent } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Project } from '@/entities/project';
import type { AgentRepository } from '@/entities/agent-repository';
import {
  useDeleteAgentRepository,
  useProjectAgentRepositories,
  useRegisterAgentRepository,
  useUpdateAgentRepository
} from '@/entities/agent-repository';
import { handleApiError } from '@/shared/api';
import { useTranslation } from '@/shared/lib/i18n';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/shared/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';

interface ProjectAgentRepositoriesSectionProps {
  project: Project;
}

interface RepositoryFormState {
  url: string;
  branch: string;
  tagPattern: string;
  credentialId: string;
  pollIntervalSeconds: string;
  enabled: boolean;
}

const EMPTY_FORM: RepositoryFormState = {
  url: '',
  branch: 'main',
  tagPattern: '',
  credentialId: '',
  pollIntervalSeconds: '30',
  enabled: true
};

function repositoryToForm(repository: AgentRepository): RepositoryFormState {
  return {
    url: repository.url,
    branch: repository.branch,
    tagPattern: repository.tagPattern ?? '',
    credentialId: '',
    pollIntervalSeconds: String(repository.pollIntervalSeconds),
    enabled: repository.enabled
  };
}

function parsePollInterval(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '-';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(iso));
}

function RepositoryUrl({ url }: { url: string }) {
  return (
    <Button asChild variant="link" className="h-auto min-w-0 max-w-full justify-start p-0">
      <a href={url} target="_blank" rel="noreferrer" title={url}>
        <span className="block truncate">{url}</span>
      </a>
    </Button>
  );
}

export function ProjectAgentRepositoriesSection({
  project
}: ProjectAgentRepositoriesSectionProps) {
  const { t } = useTranslation();
  const repositoriesQuery = useProjectAgentRepositories(project.id);
  const registerMutation = useRegisterAgentRepository();
  const updateMutation = useUpdateAgentRepository();
  const deleteMutation = useDeleteAgentRepository();
  const [createForm, setCreateForm] = useState<RepositoryFormState>(EMPTY_FORM);
  const [editingRepository, setEditingRepository] = useState<AgentRepository | null>(null);
  const [editForm, setEditForm] = useState<RepositoryFormState>(EMPTY_FORM);
  const [deletingRepository, setDeletingRepository] = useState<AgentRepository | null>(null);

  const repositories = repositoriesQuery.data?.items ?? [];

  const updateCreateField = <K extends keyof RepositoryFormState>(
    key: K,
    value: RepositoryFormState[K]
  ) => setCreateForm((current) => ({ ...current, [key]: value }));

  const updateEditField = <K extends keyof RepositoryFormState>(
    key: K,
    value: RepositoryFormState[K]
  ) => setEditForm((current) => ({ ...current, [key]: value }));

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await registerMutation.mutateAsync({
        projectId: project.id,
        url: createForm.url.trim(),
        branch: createForm.branch.trim() || undefined,
        tagPattern: createForm.tagPattern.trim() || null,
        credentialId: createForm.credentialId.trim() || null,
        pollIntervalSeconds: parsePollInterval(createForm.pollIntervalSeconds)
      });
      toast.success(t('project.repositories.toast.created'));
      setCreateForm(EMPTY_FORM);
    } catch (error) {
      toast.error(t('project.repositories.toast.createFailed'), {
        description: handleApiError(error)
      });
    }
  };

  const openEditDialog = (repository: AgentRepository) => {
    setEditingRepository(repository);
    setEditForm(repositoryToForm(repository));
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingRepository) return;

    try {
      await updateMutation.mutateAsync({
        id: editingRepository.id,
        projectId: project.id,
        data: {
          branch: editForm.branch.trim() || null,
          tagPattern: editForm.tagPattern.trim() || null,
          credentialId: editForm.credentialId.trim() || null,
          pollIntervalSeconds: parsePollInterval(editForm.pollIntervalSeconds) || null,
          enabled: editForm.enabled
        }
      });
      toast.success(t('project.repositories.toast.updated'));
      setEditingRepository(null);
    } catch (error) {
      toast.error(t('project.repositories.toast.updateFailed'), {
        description: handleApiError(error)
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingRepository) return;
    try {
      await deleteMutation.mutateAsync({
        id: deletingRepository.id,
        projectId: project.id
      });
      toast.success(t('project.repositories.toast.deleted'));
      setDeletingRepository(null);
    } catch (error) {
      toast.error(t('project.repositories.toast.deleteFailed'), {
        description: handleApiError(error)
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('project.repositories.title')}</CardTitle>
        <CardDescription>{t('project.repositories.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleCreate}>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="repository-url">{t('project.repositories.form.url')}</Label>
            <Input
              id="repository-url"
              value={createForm.url}
              onChange={(event) => updateCreateField('url', event.target.value)}
              placeholder={t('project.repositories.form.urlPlaceholder')}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="repository-branch">{t('project.repositories.form.branch')}</Label>
            <Input
              id="repository-branch"
              value={createForm.branch}
              onChange={(event) => updateCreateField('branch', event.target.value)}
              placeholder="main"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="repository-tag-pattern">
              {t('project.repositories.form.tagPattern')}
            </Label>
            <Input
              id="repository-tag-pattern"
              value={createForm.tagPattern}
              onChange={(event) => updateCreateField('tagPattern', event.target.value)}
              placeholder="v*"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="repository-credential">
              {t('project.repositories.form.credentialId')}
            </Label>
            <Input
              id="repository-credential"
              value={createForm.credentialId}
              onChange={(event) => updateCreateField('credentialId', event.target.value)}
              placeholder={t('project.repositories.form.credentialPlaceholder')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="repository-poll-interval">
              {t('project.repositories.form.pollIntervalSeconds')}
            </Label>
            <Input
              id="repository-poll-interval"
              type="number"
              min={0}
              value={createForm.pollIntervalSeconds}
              onChange={(event) => updateCreateField('pollIntervalSeconds', event.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={registerMutation.isPending}>
              {registerMutation.isPending
                ? t('project.repositories.create.creating')
                : t('project.repositories.create.action')}
            </Button>
          </div>
        </form>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead>{t('project.repositories.table.url')}</TableHead>
                <TableHead>{t('project.repositories.table.branch')}</TableHead>
                <TableHead>{t('project.repositories.table.enabled')}</TableHead>
                <TableHead>{t('project.repositories.table.interval')}</TableHead>
                <TableHead>{t('project.repositories.table.lastPolledAt')}</TableHead>
                <TableHead className="text-right">
                  {t('project.repositories.table.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repositoriesQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    {t('project.repositories.table.loading')}
                  </TableCell>
                </TableRow>
              ) : repositoriesQuery.isError ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-destructive">
                    {t('project.repositories.table.error')}
                  </TableCell>
                </TableRow>
              ) : repositories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    {t('project.repositories.table.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                repositories.map((repository) => (
                  <TableRow key={repository.id}>
                    <TableCell className="max-w-[320px]">
                      <RepositoryUrl url={repository.url} />
                    </TableCell>
                    <TableCell>{repository.branch}</TableCell>
                    <TableCell>
                      <Badge variant={repository.enabled ? 'default' : 'secondary'}>
                        {repository.enabled
                          ? t('project.repositories.status.enabled')
                          : t('project.repositories.status.disabled')}
                      </Badge>
                    </TableCell>
                    <TableCell>{repository.pollIntervalSeconds}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(repository.lastPolledAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={t('project.repositories.edit.action')}
                          onClick={() => openEditDialog(repository)}
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          aria-label={t('project.repositories.delete.action')}
                          onClick={() => setDeletingRepository(repository)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={!!editingRepository} onOpenChange={(open) => !open && setEditingRepository(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('project.repositories.edit.title')}</DialogTitle>
            <DialogDescription>{editingRepository?.url}</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div className="grid gap-2">
              <Label htmlFor="edit-repository-branch">
                {t('project.repositories.form.branch')}
              </Label>
              <Input
                id="edit-repository-branch"
                value={editForm.branch}
                onChange={(event) => updateEditField('branch', event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-repository-tag-pattern">
                {t('project.repositories.form.tagPattern')}
              </Label>
              <Input
                id="edit-repository-tag-pattern"
                value={editForm.tagPattern}
                onChange={(event) => updateEditField('tagPattern', event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-repository-credential">
                {t('project.repositories.form.credentialId')}
              </Label>
              <Input
                id="edit-repository-credential"
                value={editForm.credentialId}
                onChange={(event) => updateEditField('credentialId', event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-repository-poll-interval">
                {t('project.repositories.form.pollIntervalSeconds')}
              </Label>
              <Input
                id="edit-repository-poll-interval"
                type="number"
                min={0}
                value={editForm.pollIntervalSeconds}
                onChange={(event) => updateEditField('pollIntervalSeconds', event.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox
                checked={editForm.enabled}
                onCheckedChange={(checked) => updateEditField('enabled', checked === true)}
              />
              {t('project.repositories.form.enabled')}
            </label>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingRepository(null)}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending
                  ? t('project.repositories.edit.saving')
                  : t('project.repositories.edit.confirm')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingRepository}
        onOpenChange={(open) => !open && setDeletingRepository(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('project.repositories.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('project.repositories.delete.description', {
                url: deletingRepository?.url ?? ''
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
            >
              {deleteMutation.isPending
                ? t('project.repositories.delete.deleting')
                : t('project.repositories.delete.confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
