import { useTranslation } from '@/shared/lib/i18n';
import { DashboardBento } from '@/widgets/dashboard-bento';

export function DashboardPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">{t('pages.dashboard.title')}</h2>
      <DashboardBento />
    </div>
  );
}
