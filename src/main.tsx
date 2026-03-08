import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/shared/lib/i18n';
import './index.css';
import { App } from '@/app';
import { loadAppConfig } from '@/shared/config';

loadAppConfig().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
