import type { AgentRepositoryListParams } from '../model/agent-repository';

export const agentRepositoryQueryKeys = {
  all: () => ['agent-repositories'] as const,
  lists: () => ['agent-repositories', 'list'] as const,
  list: (params?: AgentRepositoryListParams) =>
    ['agent-repositories', 'list', params] as const,
  project: (projectId: string) =>
    ['agent-repositories', 'list', 'project', projectId] as const,
  projectList: (projectId: string, params?: Omit<AgentRepositoryListParams, 'projectId'>) =>
    ['agent-repositories', 'list', 'project', projectId, params] as const,
  detail: (id: string) => ['agent-repositories', 'detail', id] as const
} as const;
