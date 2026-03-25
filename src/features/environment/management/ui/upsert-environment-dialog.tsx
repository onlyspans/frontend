import { useEffect, useState } from 'react';

import type { Environment } from '@/entities/environment';
import { useTranslation } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

export function UpsertEnvironmentDialog({
  mode,
  open,
  onOpenChange,
  onSubmit,
  initial,
  isPending
}: {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, description: string) => Promise<void> | void;
  initial?: Environment;
  isPending?: boolean;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initial) {
      setName(initial.name);
      setDescription(initial.description ?? '');
      return;
    }
    setName('');
    setDescription('');
  }, [initial, mode, open]);

  const canSubmit = name.trim().length > 0;

  const title =
    mode === 'create'
      ? t('pages.environments.create.title')
      : t('pages.environments.edit.title');

  const submitLabel =
    mode === 'create'
      ? t('pages.environments.create.confirm')
      : t('pages.environments.edit.confirm');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('pages.environments.form.name')}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('pages.environments.form.description')}</label>
            <Textarea
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
            onClick={() => onSubmit(name, description)}
          >
            {isPending ? t('common.saving') : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
