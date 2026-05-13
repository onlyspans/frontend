/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECTS_API_URL?: string;
  readonly VITE_EVENTS_API_URL?: string;
  readonly VITE_VARIABLES_API_URL?: string;

  readonly VITE_AUTH_ENABLED?: string;

  readonly VITE_OIDC_ISSUER?: string;
  readonly VITE_OIDC_CLIENT_ID?: string;
  readonly VITE_OIDC_REDIRECT_URI?: string;
  readonly VITE_OIDC_SILENT_REDIRECT_URI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
