const PROJECT_VARIABLE_SETS_ROOT = ['project-variable-sets'] as const;

export const projectVariableSetsQueryKeys = {
  all: () => PROJECT_VARIABLE_SETS_ROOT,
  lists: () => [...PROJECT_VARIABLE_SETS_ROOT, 'list'] as const,
  list: (projectId: string) => [...PROJECT_VARIABLE_SETS_ROOT, 'list', projectId] as const
} as const;
