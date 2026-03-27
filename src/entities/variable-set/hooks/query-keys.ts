const VARIABLE_SETS_ROOT = ['variable-sets'] as const;
const VARIABLE_SETS_LIST_KEY = [...VARIABLE_SETS_ROOT, 'list'] as const;

export const variableSetQueryKeys = {
  all: () => VARIABLE_SETS_ROOT,
  lists: () => VARIABLE_SETS_LIST_KEY,
  list: () => VARIABLE_SETS_LIST_KEY,
  details: () => [...VARIABLE_SETS_ROOT, 'detail'] as const,
  detail: (id: string) => [...VARIABLE_SETS_ROOT, 'detail', id] as const
} as const;
