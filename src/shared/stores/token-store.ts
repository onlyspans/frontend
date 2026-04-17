import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string | null, refreshToken?: string | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  clearTokens: () => void;
  hasToken: () => boolean;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,

      setTokens: (accessToken: string | null, refreshToken?: string | null) => {
        set({ accessToken, refreshToken: refreshToken ?? null });
      },

      setAccessToken: (token: string | null) => {
        set({ accessToken: token });
      },

      setRefreshToken: (token: string | null) => {
        set({ refreshToken: token });
      },

      clearTokens: () => {
        set({ accessToken: null, refreshToken: null });
      },

      hasToken: () => {
        return !!get().accessToken;
      }
    }),
    {
      name: 'auth-tokens',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      })
    }
  )
);
