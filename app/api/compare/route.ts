import { NextResponse, type NextRequest } from 'next/server';
import { search } from '@/lib/aggregator';
import { parseSearchQuery } from '@/lib/query';
import { formatINR } from '@/lib/text';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

/**
 * GET /api/compare?q=shoes
 * Returns only products carried by more than one store — i.e. the ones actually
 * worth comparing — with a compact best/worst price summary per product.
 */
export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = parseSearchQuery({ ...params, pageSize: '60' });
    const result = await search(query);

    const comparisons = result.products
      .filter((p) => p.storeCount > 1)
      .map((p) => ({
        id: p.id,
        title: p.title,
        brand: p.brand,
        storeCount: p.storeCount,
        lowestPrice: p.lowestPrice,
        highestPrice: p.highestPrice,
        maxSavings: p.maxSavings,
        maxSavingsFormatted: formatINR(p.maxSavings),
        cheapestStore: p.bestOffer.provider,
        offers: p.offers.map((o) => ({
          provider: o.provider,
          price: o.price,
          priceFormatted: formatINR(o.price),
          inStock: o.inStock,
          url: o.url,
        })),
      }));

    return NextResponse.json({
      query: query.q,
      count: comparisons.length,
      comparisons,
    });
  } catch (err) {
    logger.error('GET /api/compare failed', {
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: 'compare_failed' }, { status: 500 });
  }
}
