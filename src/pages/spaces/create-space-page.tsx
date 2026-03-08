import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CreateSpaceForm } from '@/features/space/creation';
import { useTranslation } from '@/shared/lib/i18n';

export function CreateSpacePage() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <CreateSpaceForm />
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>{t('pages.spacesCreate.aboutTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('pages.spacesCreate.aboutDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
