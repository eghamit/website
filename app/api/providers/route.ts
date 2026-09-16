import { NextResponse } from 'next/server';
import { enabledAdapters } from '@/lib/providers';
import { config, ALL_PROVIDERS } from '@/lib/config';
import type { ProviderInfo } from '@/lib/types';

/** GET /api/providers — which stores are wired up and in what mode. */
export async function GET() {
  const enabled = new Set(config.enabledProviders);
  const byId = new Map(enabledAdapters().map((a) => [a.id, a] as const));

  const providers: ProviderInfo[] = ALL_PROVIDERS.map((id) => ({
    id,
    name: byId.get(id)?.name ?? id,
    enabled: enabled.has(id),
    mode: config.providerMode,
  }));

  return NextResponse.json({ providers, mode: config.providerMode });
}
