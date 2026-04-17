import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOidcCallback } from '@/shared/auth/oidc';

export default function OidcCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const returnTo = await handleOidcCallback();
        if (!cancelled) navigate(returnTo, { replace: true });
      } catch {
        if (!cancelled) navigate('/sign-in', { replace: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return null;
}
