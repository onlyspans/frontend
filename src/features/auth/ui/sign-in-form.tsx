import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator
} from '@/shared/ui/field';
import type { ComponentProps } from 'react';
import { useTranslation } from '@/shared/lib/i18n';
import { SocialAuthButtons } from '@/features/auth';

export function SignInForm({ className, ...props }: ComponentProps<'div'>) {
  const { t } = useTranslation();

  return (
    <Card className={className} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t('pages.auth.welcomeBack')}</CardTitle>
        <CardDescription>
          {t('pages.auth.enterEmail')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            {t('pages.auth.orContinueWith')}
          </FieldSeparator>
          <SocialAuthButtons />
          <Field>
            <FieldDescription className="text-center">
              {t('pages.auth.dontHaveAccount')}{' '}
              <Link
                to="/sign-up"
                className="underline-offset-4 hover:underline"
              >
                {t('pages.auth.signUp')}
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
