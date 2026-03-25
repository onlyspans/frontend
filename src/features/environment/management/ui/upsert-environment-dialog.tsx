import { useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

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
import { getHexColorErrorKey } from '@/shared/lib/color/hex';

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
  onSubmit: (
    name: string,
    description: string,
    color:
      | { mode: 'unset' }
      | { mode: 'value'; value: string }
      | { mode: 'nochange' }
      | { mode: 'reset' }
  ) => Promise<void> | void;
  initial?: Environment;
  isPending?: boolean;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [colorDirty, setColorDirty] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initial) {
      setName(initial.name);
      setDescription(initial.description ?? '');
      setColor(initial.color ?? '');
      setColorDirty(false);
      return;
    }
    setName('');
    setDescription('');
    setColor('');
    setColorDirty(false);
  }, [initial, mode, open]);

  const canSubmit = name.trim().length > 0;
  const colorErrorKey = getHexColorErrorKey(color);
  const colorError = colorErrorKey ? t(colorErrorKey) : null;

  const title =
    mode === 'create'
      ? t('pages.environments.create.title')
      : t('pages.environments.edit.title');

  const submitLabel =
    mode === 'create'
      ? t('pages.environments.create.confirm')
      : t('pages.environments.edit.confirm');

  const canSubmitWithColor = canSubmit && !colorErrorKey;

  const buildColorPayload = () => {
    const trimmed = color.trim();
    if (mode === 'create') {
      if (!trimmed) return { mode: 'unset' } as const;
      return { mode: 'value', value: trimmed } as const;
    }

    if (!colorDirty) return { mode: 'nochange' } as const;
    if (!trimmed) return { mode: 'reset' } as const;
    return { mode: 'value', value: trimmed } as const;
  };

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
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('project.creation.colorOptional')}</label>
            <div className="flex flex-col gap-2">
              <div className="min-h-[120px] w-full">
                <HexColorPicker
                  color={color || '#000000'}
                  onChange={(next) => {
                    setColor(next);
                    setColorDirty(true);
                  }}
                  style={{ width: '100%', height: 120 }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    setColorDirty(true);
                  }}
                  placeholder={t('project.creation.colorPlaceholder')}
                  className="font-mono w-28"
                  aria-invalid={!!colorError}
                  aria-describedby={colorError ? 'env-color-error' : undefined}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setColor('');
                    setColorDirty(true);
                  }}
                >
                  {t('project.creation.clearEmoji')}
                </Button>
              </div>
              {colorError && (
                <p id="env-color-error" className="text-sm text-destructive">
                  {colorError}
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            disabled={!canSubmitWithColor || isPending}
            onClick={() => onSubmit(name, description, buildColorPayload())}
          >
            {isPending ? t('common.saving') : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
