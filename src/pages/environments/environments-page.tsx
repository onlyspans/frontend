import { useTranslation } from '@/shared/lib/i18n';
import { EnvironmentsManagement } from '@/features/environment/management';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';

export function EnvironmentsPage() {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('pages.environments.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('pages.environments.subtitle')}</p>
        </div>
        <Button type="button" onClick={() => setCreateOpen(true)}>
          {t('pages.environments.createEnvironment')}
        </Button>
      </div>
      <EnvironmentsManagement
        createOpen={createOpen}
        onCreateOpenChange={setCreateOpen}
      />
    </div>
  );
}
