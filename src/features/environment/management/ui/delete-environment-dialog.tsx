import type { Environment } from '@/entities/environment';
import { useTranslation } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/shared/ui/alert-dialog';

export function DeleteEnvironmentDialog({
  environment,
  open,
  onOpenChange,
  onConfirm,
  isPending
}: {
  environment: Environment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('pages.environments.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('pages.environments.delete.description', {
              name: environment?.name ?? ''
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={!environment || isPending}
            onClick={onConfirm}
          >
            {isPending ? t('pages.environments.delete.deleting') : t('pages.environments.delete.confirm')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
