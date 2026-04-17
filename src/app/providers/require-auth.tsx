import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTokenStore } from '@/shared/stores';
import { restoreOidcSession, oidcLogin } from '@/shared/auth/oidc';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hasToken = useTokenStore((s) => Boolean(s.accessToken));
  const [checked, setChecked] = useState(false);

  const returnTo = useMemo(() => {
    return location.pathname + location.search + location.hash;
  }, [location.hash, location.pathname, location.search]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        await restoreOidcSession();
      } finally {
        if (!cancelled) setChecked(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!checked) return;
    if (hasToken) return;
    void oidcLogin(returnTo);
  }, [checked, hasToken, returnTo]);

  if (!checked) return null;

  if (!hasToken) return null;

  return children;
}
