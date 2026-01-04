import { AuthLayout } from '@/widgets/auth-layout';
import { SignUpForm } from '@/features/auth';

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
