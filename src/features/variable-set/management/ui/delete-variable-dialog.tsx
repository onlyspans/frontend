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
import type { VariableResponse } from '@/entities/variable';

export function DeleteVariableDialog({
  variable,
  open,
  onOpenChange,
  onConfirm,
  isPending
}: {
  variable: VariableResponse | null;
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
          <AlertDialogTitle>{t('pages.environmentsVariables.variables.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('pages.environmentsVariables.variables.delete.description', {
              key: variable?.key ?? ''
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={!variable || isPending}
            onClick={onConfirm}
          >
            {isPending
              ? t('pages.environmentsVariables.variables.delete.deleting')
              : t('pages.environmentsVariables.variables.delete.confirm')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
