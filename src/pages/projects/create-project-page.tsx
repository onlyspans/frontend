import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CreateProjectForm } from '@/features/project/creation';
import { useTranslation } from '@/shared/lib/i18n';

export function CreateProjectPage() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <CreateProjectForm />
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>{t('pages.projectsCreate.aboutTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('pages.projectsCreate.aboutDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
