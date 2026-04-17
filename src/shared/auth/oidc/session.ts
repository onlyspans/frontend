import type { User } from 'oidc-client-ts';
import { oidcUserManager } from './user-manager';
import { useTokenStore } from '@/shared/stores';
import { appConfig } from '@/shared/config';

const RETURN_TO_KEY = 'oidc:returnTo';

function syncTokensFromUser(user: User | null): void {
  const tokenStore = useTokenStore.getState();
  if (!user?.access_token) {
    tokenStore.clearTokens();
    return;
  }

  tokenStore.setTokens(user.access_token, user.refresh_token ?? null);
}

export async function restoreOidcSession(): Promise<void> {
  const user = await oidcUserManager.getUser();
  syncTokensFromUser(user);
}

export async function oidcLogin(returnTo?: string): Promise<void> {
  if (typeof window !== 'undefined') {
    const next = returnTo || window.location.pathname + window.location.search + window.location.hash;
    window.sessionStorage.setItem(RETURN_TO_KEY, next);
  }
  await oidcUserManager.signinRedirect();
}

export async function handleOidcCallback(): Promise<string> {
  const user = await oidcUserManager.signinRedirectCallback();
  syncTokensFromUser(user);

  if (typeof window === 'undefined') return '/';
  const stored = window.sessionStorage.getItem(RETURN_TO_KEY);
  window.sessionStorage.removeItem(RETURN_TO_KEY);
  return stored || '/';
}

export async function handleOidcSilentRenewCallback(): Promise<void> {
  await oidcUserManager.signinSilentCallback();
}

export async function renewOidcTokens(): Promise<User | null> {
  if (!appConfig.oidc.silentRedirectUri) return null;
  const user = await oidcUserManager.signinSilent();
  syncTokensFromUser(user);
  return user;
}

export async function oidcLogout(): Promise<void> {
  useTokenStore.getState().clearTokens();
  await oidcUserManager.signoutRedirect();
}
