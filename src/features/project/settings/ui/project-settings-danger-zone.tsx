import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/shared/ui/alert-dialog';
import { useDeleteProject, useUpdateProject } from '@/entities/project';
import type { Project, ProjectStatus } from '@/entities/project';
import { toast } from 'sonner';
import { useTranslation } from '@/shared/lib/i18n';
import { Separator } from '@/shared/ui/separator.tsx';

const PROJECT_STATUSES: ProjectStatus[] = ['active', 'archived', 'suspended'];

interface ProjectSettingsDangerZoneProps {
  project: Project;
}

export function ProjectSettingsDangerZone({ project }: ProjectSettingsDangerZoneProps) {
  const { t } = useTranslation();
  const { spaceSlug } = useParams<{ spaceSlug: string }>();
  const navigate = useNavigate();
  const deleteMutation = useDeleteProject();
  const updateMutation = useUpdateProject();
  const [confirmName, setConfirmName] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(project.status);

  const canDelete = confirmName.trim() === project.name;
  const canChangeStatus = selectedStatus !== project.status;

  const handleDelete = async () => {
    if (!canDelete) return;
    try {
      await deleteMutation.mutateAsync(project.id);
      toast.success(t('project.settings.delete.success'));
      setDeleteOpen(false);
      setConfirmName('');
      if (spaceSlug) {
        navigate(`/${spaceSlug}/projects`, { replace: true });
      }
    } catch (error) {
      toast.error(t('project.settings.delete.failed'), {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  const handleDeleteOpenChange = (next: boolean) => {
    setDeleteOpen(next);
    if (!next) setConfirmName('');
  };

  const handleStatusChange = async () => {
    if (!canChangeStatus) return;
    try {
      await updateMutation.mutateAsync({
        id: project.id,
        data: { status: selectedStatus }
      });
      toast.success(t('project.settings.changeStatus.success'));
      setStatusOpen(false);
    } catch (error) {
      toast.error(t('project.settings.changeStatus.failed'), {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  const handleStatusOpenChange = (next: boolean) => {
    setStatusOpen(next);
    if (!next) setSelectedStatus(project.status);
  };

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">{t('project.settings.dangerZone.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-foreground text-sm font-medium">
              {t('project.settings.dangerZone.changeStatus.title')}
            </p>
            <p className="text-muted-foreground text-sm">
              {t('project.settings.dangerZone.changeStatus.description')}
            </p>
          </div>
          <AlertDialog open={statusOpen} onOpenChange={handleStatusOpenChange}>
            <div className="flex items-center gap-2">
              <Select
                value={selectedStatus}
                onValueChange={(v) => setSelectedStatus(v as ProjectStatus)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {t(`project.${status}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={!canChangeStatus}>
                  {t('project.settings.changeStatus.button')}
                </Button>
              </AlertDialogTrigger>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('project.settings.changeStatus.dialogTitle')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('project.settings.changeStatus.dialogDescription', {
                    status: t(`project.${selectedStatus}`)
                  })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t('project.settings.changeStatus.cancel')}
                </AlertDialogCancel>
                <Button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={handleStatusChange}
                >
                  {updateMutation.isPending
                    ? t('project.settings.changeStatus.updating')
                    : t('project.settings.changeStatus.confirm')}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <Separator />
        <div className="flex flex-row items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-foreground text-sm font-medium">
              {t('project.settings.dangerZone.deleteProject.title')}
            </p>
            <p className="text-muted-foreground text-sm">
              {t('project.settings.dangerZone.deleteProject.description')}
            </p>
          </div>
          <AlertDialog open={deleteOpen} onOpenChange={handleDeleteOpenChange}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">{t('project.settings.delete.button')}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('project.settings.delete.dialogTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('project.settings.delete.dialogDescription', { name: project.name })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-2">
                <label htmlFor="delete-confirm-name" className="text-muted-foreground mb-2 block text-sm">
                  {t('project.settings.delete.confirmLabel', { name: project.name })}
                </label>
                <Input
                  id="delete-confirm-name"
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  placeholder={project.name}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('project.settings.delete.cancel')}</AlertDialogCancel>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={!canDelete || deleteMutation.isPending}
                  onClick={handleDelete}
                >
                  {deleteMutation.isPending
                    ? t('project.settings.delete.deleting')
                    : t('project.settings.delete.confirm')}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
