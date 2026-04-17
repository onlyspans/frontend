import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { appConfig } from '@/shared/config';

function getAppOrigin(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
}

function getPostLogoutRedirectUri(): string | undefined {
  const origin = getAppOrigin();
  if (!origin) return undefined;
  return `${origin}/sign-in`;
}

function getSessionStorageStore(): WebStorageStateStore | undefined {
  if (typeof window === 'undefined') return undefined;
  return new WebStorageStateStore({ store: window.sessionStorage });
}

export const oidcUserManager = new UserManager({
  authority: appConfig.oidc.issuer,
  client_id: appConfig.oidc.clientId,
  redirect_uri: appConfig.oidc.redirectUri,
  silent_redirect_uri: appConfig.oidc.silentRedirectUri,
  post_logout_redirect_uri: getPostLogoutRedirectUri(),
  response_type: 'code',
  // No `offline_access` => no refresh token in the SPA.
  scope: 'openid profile email',
  loadUserInfo: true,
  automaticSilentRenew: false,
  userStore: getSessionStorageStore()
});
