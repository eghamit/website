import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

/** GET /api/health — liveness/readiness probe for load balancers. */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    mode: config.providerMode,
    providers: config.enabledProviders,
    time: new Date().toISOString(),
  });
}
