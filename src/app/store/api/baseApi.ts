import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { env } from '../../../config/env';
import { handleMockRequest, type ApiRequest } from '../../../mocks/mockService';

export interface ApiArgs extends ApiRequest {
  /** GET for reads, POST for writes — matches the Apps Script contract. */
  method?: 'GET' | 'POST';
}

export interface ApiError {
  status: number;
  message: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toQueryString(args: ApiArgs): string {
  const search = new URLSearchParams({ action: args.action });
  if (args.id) search.set('id', args.id);
  Object.entries(args.params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== 'all') search.set(key, String(value));
  });
  return search.toString();
}

/**
 * Single transport for the whole application.
 *
 * - Mock mode resolves against the in-memory service.
 * - Live mode talks to the Google Apps Script Web App:
 *     GET  {BASE}/exec?action=getCandidates&page=1
 *     POST {BASE}/exec  { action, id, data }
 *
 * Flipping between them is configuration only (see config/env.ts); no feature
 * code changes. Apps Script is sent as text/plain to avoid a CORS preflight.
 */
const appsScriptBaseQuery: BaseQueryFn<ApiArgs, unknown, ApiError> = async (args) => {
  if (env.useMockApi) {
    await delay(env.mockLatency);
    try {
      return { data: handleMockRequest(args) };
    } catch (error) {
      return {
        error: { status: 400, message: error instanceof Error ? error.message : 'Request failed' }
      };
    }
  }

  try {
    const isRead = (args.method ?? 'GET') === 'GET';
    const url = isRead ?
    `${env.apiBaseUrl}/exec?${toQueryString(args)}` :
    `${env.apiBaseUrl}/exec`;

    const response = await fetch(url, {
      method: isRead ? 'GET' : 'POST',
      ...(isRead ?
      {} :
      {
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: args.action, id: args.id, data: args.data })
      })
    });

    if (!response.ok) {
      return { error: { status: response.status, message: `Request failed (${response.status})` } };
    }

    const payload = (await response.json()) as {success?: boolean;data?: unknown;message?: string;};
    if (payload.success === false) {
      return { error: { status: 400, message: payload.message ?? 'Request failed' } };
    }
    return { data: payload.data ?? payload };
  } catch (error) {
    return {
      error: { status: 0, message: error instanceof Error ? error.message : 'Network error' }
    };
  }
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: appsScriptBaseQuery,
  tagTypes: [
  'Candidate',
  'Agent',
  'Country',
  'Payment',
  'Document',
  'User',
  'Activity',
  'Dashboard',
  'Profile'],

  refetchOnMountOrArgChange: false,
  endpoints: () => ({})
});

/** Normalizes an RTK Query error into a displayable message. */
export function apiErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as {message?: unknown;}).message;
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
}