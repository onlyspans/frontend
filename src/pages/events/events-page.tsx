import { useTranslation } from '@/shared/lib/i18n';
import {
  EventsExportModal,
  EventsLog,
  EventsSettingsModal,
  useEventsLog
} from '@/features/event/log';
import { Button } from '@/shared/ui/button.tsx';
import { Download, Settings } from 'lucide-react';
import { useState } from 'react';

export function EventsPage() {
  const { t } = useTranslation();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const log = useEventsLog();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('pages.events.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('pages.events.subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => setIsExportOpen(true)}>
            <Download className="size-4 mr-2" />
            {t('pages.events.export.open')}
          </Button>
          <Button type="button" variant="default" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="size-4 mr-2" />
            {t('pages.events.settings.title')}
          </Button>
        </div>
      </div>

      <EventsLog log={log} />

      <EventsExportModal open={isExportOpen} onOpenChange={setIsExportOpen} body={log.exportRequest} />
      <EventsSettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}
