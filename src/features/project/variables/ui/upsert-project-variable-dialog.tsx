import { useEffect, useState } from 'react';
import { useTranslation } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import type { VariableResponse } from '@/entities/variable';

export function UpsertProjectVariableDialog({
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
  const [keyValue, setKeyValue] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initial) {
      setKeyValue(initial.key ?? '');
      setValue(initial.value ?? '');
      return;
    }
    setKeyValue('');
    setValue('');
  }, [initial, mode, open]);

  const canSubmit = keyValue.trim().length > 0 && value.trim().length > 0;

  const title =
    mode === 'create'
      ? t('pages.projectVariables.direct.create.title')
      : t('pages.projectVariables.direct.edit.title');

  const confirmLabel =
    mode === 'create'
      ? t('pages.projectVariables.direct.create.confirm')
      : t('pages.projectVariables.direct.edit.confirm');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('pages.projectVariables.direct.form.key')}</label>
            <Input value={keyValue} onChange={(e) => setKeyValue(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('pages.projectVariables.direct.form.value')}</label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
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
