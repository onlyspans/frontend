import { useTranslation } from '@/shared/lib/i18n';
import { EventsLog } from '@/features/event/log';
import { EventsSettingsCard } from '@/features/event/log';

export function EventsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('pages.events.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('pages.events.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <EventsLog />
        </div>
        <div className="lg:col-span-1">
          <EventsSettingsCard />
        </div>
      </div>
    </div>
  );
}
