import { useId, useState } from 'react';
import { useTranslation } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import type { VariableSetResponse } from '@/entities/variable-set';

export function UpsertVariableSetDialog({
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
  initial?: VariableSetResponse | null;
  isPending?: boolean;
  onSubmit: (data: { name: string; description: string }) => Promise<void> | void;
}) {
  const { t } = useTranslation();
  const nameInputId = useId();
  const descriptionInputId = useId();
  const [name, setName] = useState(() => (mode === 'edit' && initial ? (initial.name ?? '') : ''));
  const [description, setDescription] = useState(() =>
    mode === 'edit' && initial ? (initial.description ?? '') : ''
  );

  const canSubmit = name.trim().length > 0;

  const title =
    mode === 'create'
      ? t('pages.environmentsVariables.sets.create.title')
      : t('pages.environmentsVariables.sets.edit.title');

  const confirmLabel =
    mode === 'create'
      ? t('pages.environmentsVariables.sets.create.confirm')
      : t('pages.environmentsVariables.sets.edit.confirm');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={nameInputId}>
              {t('pages.environmentsVariables.sets.form.name')}
            </label>
            <Input id={nameInputId} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={descriptionInputId}>
              {t('pages.environmentsVariables.sets.form.description')}
            </label>
            <Textarea
              id={descriptionInputId}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            disabled={!canSubmit || isPending}
            onClick={() => onSubmit({ name, description })}
          >
            {isPending ? t('common.saving') : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
