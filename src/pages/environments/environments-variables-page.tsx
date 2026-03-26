import { useTranslation } from '@/shared/lib/i18n';

export function EnvironmentsVariablesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">{t('pages.environmentsVariables.title')}</h1>
      <p className="text-muted-foreground">{t('pages.environmentsVariables.subtitle')}</p>
    </div>
  );
}
