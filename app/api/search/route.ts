import { NextResponse, type NextRequest } from 'next/server';
import { search } from '@/lib/aggregator';
import { parseSearchQuery } from '@/lib/query';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

/**
 * GET /api/search?q=shoes&providers=myntra,ajio&minPrice=1000&sort=price_asc
 * Returns matched cross-store products with facets and pagination.
 */
export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = parseSearchQuery(params);
    const result = await search(query);
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (err) {
    logger.error('GET /api/search failed', {
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: 'search_failed' }, { status: 500 });
  }
}
