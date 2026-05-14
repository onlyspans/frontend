import { api } from '@/shared/api';
import type {
  AgentRepository,
  AgentRepositoryList,
  AgentRepositoryListParams,
  RegisterRepositoryRequest,
  TriggerAgentRepositoryPollResult,
  UpdateRepositoryRequest
} from '../model/agent-repository';

const AGENTS_BASE = '/api/agents';
const REPOSITORIES_BASE = `${AGENTS_BASE}/repositories`;

const agentRepositoryEndpoints = {
  list: REPOSITORIES_BASE,
  byId: (id: string) => `${REPOSITORIES_BASE}/${id}`,
  polls: (id: string) => `${REPOSITORIES_BASE}/${id}/polls`
} as const;

export const agentRepositoryApi = {
  getList: (params?: AgentRepositoryListParams) =>
    api.agents
      .get<AgentRepositoryList>(agentRepositoryEndpoints.list, { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.agents
      .get<AgentRepository>(agentRepositoryEndpoints.byId(id))
      .then((r) => r.data),

  register: (body: RegisterRepositoryRequest) =>
    api.agents
      .post<AgentRepository>(agentRepositoryEndpoints.list, body)
      .then((r) => r.data),

  update: (id: string, body: UpdateRepositoryRequest) =>
    api.agents
      .put<AgentRepository>(agentRepositoryEndpoints.byId(id), body)
      .then((r) => r.data),

  delete: (id: string) =>
    api.agents.delete(agentRepositoryEndpoints.byId(id)).then(() => undefined),

  triggerPoll: (id: string) =>
    api.agents
      .post<TriggerAgentRepositoryPollResult>(agentRepositoryEndpoints.polls(id))
      .then((r) => r.data)
};
