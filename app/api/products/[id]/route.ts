import { NextResponse, type NextRequest } from 'next/server';
import { getProductById } from '@/lib/aggregator';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

/** GET /api/products/:id — a single matched product with all its store offers. */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    logger.error('GET /api/products/:id failed', {
      id: params.id,
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: 'lookup_failed' }, { status: 500 });
  }
}
