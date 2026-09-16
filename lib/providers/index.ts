import type { ProviderId } from '../types';
import { config } from '../config';
import type { ProviderAdapter } from './base';
import { myntra } from './myntra';
import { ajio } from './ajio';
import { meesho } from './meesho';

const REGISTRY: Record<ProviderId, ProviderAdapter> = {
  myntra,
  ajio,
  meesho,
};

/** All adapters that are enabled via configuration. */
export function enabledAdapters(): ProviderAdapter[] {
  return config.enabledProviders.map((id) => REGISTRY[id]);
}

/** Resolve a subset of adapters, honouring the enabled set. */
export function resolveAdapters(ids?: ProviderId[]): ProviderAdapter[] {
  const enabled = new Set(config.enabledProviders);
  const wanted = ids?.length ? ids.filter((id) => enabled.has(id)) : config.enabledProviders;
  return wanted.map((id) => REGISTRY[id]);
}

export function getAdapter(id: ProviderId): ProviderAdapter | undefined {
  return config.enabledProviders.includes(id) ? REGISTRY[id] : undefined;
}

export type { ProviderAdapter };
