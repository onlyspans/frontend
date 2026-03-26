const VARIABLES_ROOT = ['variables'] as const;

export const variableQueryKeys = {
  all: () => VARIABLES_ROOT,
  projectLists: () => [...VARIABLES_ROOT, 'project'] as const,
  projectList: (projectId: string) => [...VARIABLES_ROOT, 'project', projectId] as const
} as const;
