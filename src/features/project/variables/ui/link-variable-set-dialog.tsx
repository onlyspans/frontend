import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import type { VariableSetResponse } from '@/entities/variable-set';

export function LinkVariableSetDialog({
  open,
  onOpenChange,
  availableSets,
  isPending,
  onSubmit
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableSets: VariableSetResponse[];
  isPending?: boolean;
  onSubmit: (setId: string) => Promise<void> | void;
}) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    if (!open) return;
    setSelectedId('');
  }, [open]);

  const canSubmit = selectedId.length > 0;
  const selectedLabel = useMemo(
    () => availableSets.find((s) => s.id === selectedId)?.name,
    [availableSets, selectedId]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('pages.projectVariables.linked.link.title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('pages.projectVariables.linked.link.form.set')}</label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('pages.projectVariables.linked.link.form.placeholder')}>
                {selectedLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableSets.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="button" disabled={!canSubmit || isPending} onClick={() => onSubmit(selectedId)}>
            {isPending ? t('common.saving') : t('pages.projectVariables.linked.link.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
