import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { signInSchema, type LoginFormData, SocialAuthButtons } from '@/features/auth';
import type { ComponentProps } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '@/shared/lib/i18n';

export function SignInForm({ className, ...props }: ComponentProps<'div'>) {
  const { t } = useTranslation();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    // TODO: Implement login API call
    toast.success(t('pages.auth.signIn'), { description: JSON.stringify(data, null, 2) });
  };

  return (
    <Card className={className} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t('pages.auth.welcomeBack')}</CardTitle>
        <CardDescription>
          {t('pages.auth.enterEmail')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FormLabel>{t('pages.auth.email')}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('pages.auth.emailPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </Field>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <div className="flex items-center">
                        <FormLabel>{t('pages.auth.password')}</FormLabel>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          {t('pages.auth.forgotPassword')}
                        </a>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </Field>
                  </FormItem>
                )}
              />
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? t('pages.auth.loggingIn') : t('pages.auth.login')}
                </Button>
              </Field>
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
