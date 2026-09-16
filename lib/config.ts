import type { ProviderId } from './types';

const ALL_PROVIDERS: ProviderId[] = ['myntra', 'ajio', 'meesho'];

function parseProviders(raw: string | undefined): ProviderId[] {
  if (!raw) return [...ALL_PROVIDERS];
  const wanted = raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const valid = wanted.filter((p): p is ProviderId =>
    (ALL_PROVIDERS as string[]).includes(p),
  );
  return valid.length ? valid : [...ALL_PROVIDERS];
}

function parseInt10(raw: string | undefined, fallback: number): number {
  const n = Number.parseInt(raw ?? '', 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export type ProviderMode = 'dataset' | 'live';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface AppConfig {
  enabledProviders: ProviderId[];
  providerMode: ProviderMode;
  searchCacheTtlMs: number;
  providerTimeoutMs: number;
  logLevel: LogLevel;
}

/**
 * Reads configuration from the environment once. Central place so nothing else
 * needs to touch `process.env` directly.
 */
export const config: AppConfig = {
  enabledProviders: parseProviders(process.env.ENABLED_PROVIDERS),
  providerMode:
    process.env.PROVIDER_MODE === 'live' ? 'live' : 'dataset',
  searchCacheTtlMs: parseInt10(process.env.SEARCH_CACHE_TTL_SECONDS, 120) * 1000,
  providerTimeoutMs: parseInt10(process.env.PROVIDER_TIMEOUT_MS, 8000),
  logLevel: (process.env.LOG_LEVEL as LogLevel) || 'info',
};

export { ALL_PROVIDERS };
