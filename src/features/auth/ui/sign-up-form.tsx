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
import { signUpSchema, type SignupFormData, SocialAuthButtons } from '@/features/auth';
import type { ComponentProps } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '@/shared/lib/i18n';

export function SignUpForm({ className, ...props }: ComponentProps<'div'>) {
  const { t } = useTranslation();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: SignupFormData) => {
    // TODO: Implement signup API call
    toast.success(t('pages.auth.signUp'), { description: JSON.stringify(data, null, 2) });
  };

  return (
    <Card className={className} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t('pages.auth.createAccountTitle')}</CardTitle>
        <CardDescription>
          {t('pages.auth.createAccountDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FormLabel>{t('pages.auth.fullName')}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('pages.auth.fullNamePlaceholder')}
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
              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Field>
                          <FormLabel>{t('pages.auth.password')}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </Field>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <Field>
                          <FormLabel>{t('pages.auth.confirmPassword')}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </Field>
                      </FormItem>
                    )}
                  />
                </div>
                <FieldDescription>
                  {t('pages.auth.passwordHint')}
                </FieldDescription>
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? t('pages.auth.creatingAccount')
                    : t('pages.auth.createAccount')}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                {t('pages.auth.orContinueWith')}
              </FieldSeparator>
              <SocialAuthButtons />
              <Field>
                <FieldDescription className="text-center">
                  {t('pages.auth.alreadyHaveAccount')}{' '}
                  <Link
                    to="/sign-in"
                    className="underline-offset-4 hover:underline"
                  >
                    {t('pages.auth.signInLink')}
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
