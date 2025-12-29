import { requestClient } from '#/api/request';

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

export interface AiRun {
  id: string;
  userId: string;
  username: string;
  scene: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens?: number;
  cost?: number;
  currency?: string;
  status: 'success' | 'failed' | 'blocked' | 'timeout';
  latencyMs: number;
  fallbackUsed?: boolean;
  createdAt: string;
  traceId?: string;
  metadata?: Record<string, any>;
}

export interface AiRunQuery {
  page?: number;
  page_size?: number;
  user_id?: string;
  scene?: string;
  status?: string;
  model?: string;
  date_from?: string;
  date_to?: string;
}

export interface AiOverview {
  todayTokens: number;
  todayRequests: number;
  todayCost?: number;
  currency?: string;
  fallbackRate?: number;
  interceptRate?: number;
  costTrend?: Array<{ date: string; cost: number; tokens: number }>;
}

export async function fetchAiOverview() {
  return requestClient.get<AiOverview>('/admin/ai/overview');
}

export async function listAiRuns(params: AiRunQuery) {
  return requestClient.get<PaginatedResult<AiRun>>('/admin/ai/runs', {
    params,
  });
}

export async function getAiRunDetail(runId: string) {
  return requestClient.get<AiRun>(`/admin/ai/runs/${runId}`);
}
