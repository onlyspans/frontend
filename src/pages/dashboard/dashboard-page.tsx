import { useTranslation } from '@/shared/lib/i18n';

export function DashboardPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">{t('pages.dashboard.title')}</h2>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-1 w-full bg-chart-1 h-40 rounded-lg"/>
        <div className="col-span-1 w-full bg-chart-2 h-40 rounded-lg"/>
        <div className="col-span-1 w-full bg-chart-3 h-40 rounded-lg"/>
        <div className="col-span-1 w-full bg-chart-4 h-40 rounded-lg"/>
        <div className="col-span-1 w-full bg-chart-5 h-40 rounded-lg"/>
      </div>
    </div>
  );
}
