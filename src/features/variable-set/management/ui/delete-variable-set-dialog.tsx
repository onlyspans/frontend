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
import type { VariableSetResponse } from '@/entities/variable-set';

export function DeleteVariableSetDialog({
  variableSet,
  open,
  onOpenChange,
  onConfirm,
  isPending
}: {
  variableSet: VariableSetResponse | null;
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
          <AlertDialogTitle>{t('pages.environmentsVariables.sets.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('pages.environmentsVariables.sets.delete.description', {
              name: variableSet?.name ?? ''
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={!variableSet || isPending}
            onClick={onConfirm}
          >
            {isPending
              ? t('pages.environmentsVariables.sets.delete.deleting')
              : t('pages.environmentsVariables.sets.delete.confirm')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
