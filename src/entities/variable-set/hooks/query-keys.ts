const VARIABLE_SETS_ROOT = ['variable-sets'] as const;

export const variableSetQueryKeys = {
  all: () => VARIABLE_SETS_ROOT,
  lists: () => [...VARIABLE_SETS_ROOT, 'list'] as const,
  list: () => [...VARIABLE_SETS_ROOT, 'list'] as const,
  details: () => [...VARIABLE_SETS_ROOT, 'detail'] as const,
  detail: (id: string) => [...VARIABLE_SETS_ROOT, 'detail', id] as const
} as const;
