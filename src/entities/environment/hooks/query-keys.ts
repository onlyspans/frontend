const ENVIRONMENTS_ROOT = ['environments'] as const;

export const environmentQueryKeys = {
  all: () => ENVIRONMENTS_ROOT,
  lists: () => [...ENVIRONMENTS_ROOT, 'list'] as const,
  list: () => [...ENVIRONMENTS_ROOT, 'list'] as const,
  detail: (id: string) => [...ENVIRONMENTS_ROOT, 'detail', id] as const
} as const;
