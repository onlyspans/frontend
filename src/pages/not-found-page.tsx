import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useTranslation } from '@/shared/lib/i18n';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-8xl font-bold text-muted-foreground/20">404</div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">{t('pages.notFound.title')}</h1>
            <p className="text-muted-foreground">
              {t('pages.notFound.description')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
          <Button asChild variant="default" size="lg">
            <Link to="/" className="flex items-center gap-2">
              <Home className="size-4" />
              {t('pages.notFound.goHome')}
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            {t('pages.notFound.goBack')}
          </Button>
        </div>
      </div>
    </div>
  );
}
