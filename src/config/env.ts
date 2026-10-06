/**
 * Centralized environment / API configuration.
 *
 * The future backend is a Google Apps Script Web App:
 *   GET  {BASE}/exec?action=getCandidates
 *   POST {BASE}/exec  { action, id?, data? }
 *
 * Switching from the mock service to the live Apps Script API is a
 * configuration change only — no page or component is aware of it.
 * Set VITE_API_BASE_URL and VITE_USE_MOCK_API=false in the environment.
 */

type ViteEnv = Record<string, string | undefined>;

function readEnv(): ViteEnv {
  try {
    // import.meta.env is injected by Vite at build time.
    return ((import.meta as unknown as {env?: ViteEnv;}).env ?? {}) as ViteEnv;
  } catch {
    return {};
  }
}

const raw = readEnv();

export const env = {
  /** Apps Script deployment URL, e.g. https://script.google.com/macros/s/XXX */
  apiBaseUrl: raw.VITE_API_BASE_URL ?? '',
  /** When true the in-memory mock service answers all requests. */
  useMockApi: raw.VITE_USE_MOCK_API ? raw.VITE_USE_MOCK_API === 'true' : true,
  /** Artificial latency for the mock service, in milliseconds. */
  mockLatency: Number(raw.VITE_MOCK_LATENCY ?? 350),
  appName: 'Meridian Manpower',
  appShortName: 'Meridian'
} as const;

/** No secrets are ever read here — Drive/service-account credentials stay server-side. */
export type Env = typeof env;