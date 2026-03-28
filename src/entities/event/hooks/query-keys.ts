const EVENTS_ROOT = ['events'] as const;

export const eventQueryKeys = {
  all: () => EVENTS_ROOT,
  searches: () => [...EVENTS_ROOT, 'search'] as const,
  search: (params: unknown) => [...EVENTS_ROOT, 'search', params] as const,
  settings: () => [...EVENTS_ROOT, 'settings'] as const
} as const;
