import { useTranslation } from '@/shared/lib/i18n';

export function EventsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('pages.events.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('pages.events.subtitle')}</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">{t('pages.events.comingSoonTitle')}</h2>
        <p className="text-muted-foreground mt-2">{t('pages.events.comingSoonDescription')}</p>
      </div>
    </div>
  );
}
