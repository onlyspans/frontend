import { Button } from '@/shared/ui/button';
import { Field } from '@/shared/ui/field';
import { oidcLogin } from '@/shared/auth/oidc';

export function SocialAuthButtons() {
  return (
    <Field>
      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => void oidcLogin()}
        >
          Continue with Authentik
        </Button>
      </div>
    </Field>
  );
}
