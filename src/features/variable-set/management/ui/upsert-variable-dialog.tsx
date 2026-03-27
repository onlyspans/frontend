import { useId, useState } from 'react';
import { useTranslation } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import type { VariableResponse } from '@/entities/variable';

export function UpsertVariableDialog({
  mode,
  open,
  onOpenChange,
  initial,
  isPending,
  onSubmit
}: {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: VariableResponse | null;
  isPending?: boolean;
  onSubmit: (data: { key: string; value: string }) => Promise<void> | void;
}) {
  const { t } = useTranslation();
  const keyInputId = useId();
  const valueInputId = useId();
  const [keyValue, setKeyValue] = useState(() =>
    mode === 'edit' && initial ? (initial.key ?? '') : ''
  );
  const [value, setValue] = useState(() =>
    mode === 'edit' && initial ? (initial.value ?? '') : ''
  );

  const canSubmit = keyValue.trim().length > 0 && value.trim().length > 0;

  const title =
    mode === 'create'
      ? t('pages.environmentsVariables.variables.create.title')
      : t('pages.environmentsVariables.variables.edit.title');

  const confirmLabel =
    mode === 'create'
      ? t('pages.environmentsVariables.variables.create.confirm')
      : t('pages.environmentsVariables.variables.edit.confirm');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={keyInputId}>
              {t('pages.environmentsVariables.variables.form.key')}
            </label>
            <Input id={keyInputId} value={keyValue} onChange={(e) => setKeyValue(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={valueInputId}>
              {t('pages.environmentsVariables.variables.form.value')}
            </label>
            <Input id={valueInputId} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            disabled={!canSubmit || isPending}
            onClick={() => onSubmit({ key: keyValue, value })}
          >
            {isPending ? t('common.saving') : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
