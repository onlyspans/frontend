export const projectQueryKeys = {
  all: (spaceId: string) => ['projects', spaceId] as const,
  detail: (spaceId: string, projectId: string) => ['project', spaceId, projectId] as const
} as const;
