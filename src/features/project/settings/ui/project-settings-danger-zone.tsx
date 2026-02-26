import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
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
import { useDeleteProject } from '@/entities/project';
import type { Project } from '@/entities/project';
import { toast } from 'sonner';
import { useTranslation } from '@/shared/lib/i18n';

interface ProjectSettingsDangerZoneProps {
  project: Project;
}

export function ProjectSettingsDangerZone({ project }: ProjectSettingsDangerZoneProps) {
  const { t } = useTranslation();
  const { spaceSlug } = useParams<{ spaceSlug: string }>();
  const navigate = useNavigate();
  const deleteMutation = useDeleteProject();
  const [confirmName, setConfirmName] = useState('');
  const [open, setOpen] = useState(false);

  const canDelete = confirmName.trim() === project.name;

  const handleDelete = async () => {
    if (!canDelete) return;
    try {
      await deleteMutation.mutateAsync(project.id);
      toast.success(t('project.settings.delete.success'));
      setOpen(false);
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

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setConfirmName('');
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">{t('project.settings.dangerZone.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-foreground text-sm font-medium">
              {t('project.settings.dangerZone.deleteProject.title')}
            </p>
            <p className="text-muted-foreground text-sm">
              {t('project.settings.dangerZone.deleteProject.description')}
            </p>
          </div>
          <AlertDialog open={open} onOpenChange={handleOpenChange}>
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
