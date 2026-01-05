export const spaceQueryKeys = {
  all: ['spaces'] as const,
  detail: (slug: string) => ['space', slug] as const
} as const;
