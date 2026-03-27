import { useMemo, useState } from 'react';
import type { ExportEventsRequest } from '@/entities/event';
import { eventApi } from '@/entities/event';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { useTranslation } from '@/shared/lib/i18n';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function defaultFilename(): string {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  return `events-export_${ts}.csv`;
}

function normalizeValue(value: unknown) {
  if (value == null) return undefined;
  if (typeof value === 'string') {
    const t = value.trim();
    return t ? t : undefined;
  }
  return value;
}

function summarizeFilters(body: ExportEventsRequest): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  const add = (k: string, v: unknown) => {
    const nv = normalizeValue(v);
    if (nv == null) return;
    entries.push([k, String(nv)]);
  };
  add('entityId', body.entityId);
  add('entityName', body.entityName);
  add('action', body.action);
  add('userId', body.userId);
  add('tenant', body.tenant);
  add('startDate', body.startDate);
  add('endDate', body.endDate);
  add('sortBy', body.sortBy);
  add('sortOrder', body.sortOrder);
  return entries;
}

interface EventsExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  body: ExportEventsRequest;
}

export function EventsExportModal({ open, onOpenChange, body }: EventsExportModalProps) {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(() => summarizeFilters(body), [body]);

  const onDownload = async () => {
    setIsDownloading(true);
    setError(null);
    try {
      const { blob, filename } = await eventApi.exportCsv(body);
      downloadBlob(blob, filename ?? defaultFilename());
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('pages.events.export.failed'));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('pages.events.export.title')}</DialogTitle>
          <DialogDescription>{t('pages.events.export.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-md border bg-muted/30 p-3">
            <div className="text-sm font-medium">{t('pages.events.export.currentFilters')}</div>
            {summary.length === 0 ? (
              <div className="text-sm text-muted-foreground mt-2">{t('pages.events.export.noFilters')}</div>
            ) : (
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {summary.map(([k, v]) => (
                  <li key={k} className="flex gap-2 items-center">
                    <span className="font-mono text-xs text-foreground/80">{k}</span>
                    <span className="truncate">{v}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isDownloading}>
            {t('common.cancel')}
          </Button>
          <Button type="button" onClick={onDownload} disabled={isDownloading}>
            {isDownloading ? t('pages.events.export.downloading') : t('pages.events.export.download')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
