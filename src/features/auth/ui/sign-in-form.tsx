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

export function SignInForm({ className, ...props }: ComponentProps<'div'>) {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    // TODO: Implement login API call
    toast.success('Sign in', { description: JSON.stringify(data, null, 2) });

  };

  return (
    <Card className={className} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in with your Apple or Google account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <SocialAuthButtons />
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
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
                        <FormLabel>Password</FormLabel>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
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
                  {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{' '}
                  <Link
                    to="/signup"
                    className="underline-offset-4 hover:underline"
                  >
                    Sign up
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
