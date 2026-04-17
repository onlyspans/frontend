import { useEffect } from 'react';
import { handleOidcSilentRenewCallback } from '@/shared/auth/oidc';

export default function SilentRenewPage() {
  useEffect(() => {
    void handleOidcSilentRenewCallback();
  }, []);

  return null;
}
