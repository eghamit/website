import type {
  Listing,
  Product,
  ProviderId,
  SearchQuery,
  SearchResult,
  SortKey,
} from './types';
import { config } from './config';
import { logger } from './logger';
import { TtlCache } from './cache';
import { matchListings } from './matcher';
import { resolveAdapters, getAdapter } from './providers';
import { normalize } from './text';

const searchCache = new TtlCache<SearchResult>(config.searchCacheTtlMs);

const DEFAULT_PAGE_SIZE = 24;

function cacheKey(q: SearchQuery): string {
  return JSON.stringify({
    q: normalize(q.q),
    providers: [...(q.providers ?? config.enabledProviders)].sort(),
    category: q.category ?? '',
    brand: q.brand ?? '',
    minPrice: q.minPrice ?? '',
    maxPrice: q.maxPrice ?? '',
    minRating: q.minRating ?? '',
    sort: q.sort ?? 'relevance',
    page: q.page ?? 1,
    pageSize: q.pageSize ?? DEFAULT_PAGE_SIZE,
  });
}

/** Run one adapter with a hard timeout so a slow store can't stall the page. */
async function runAdapter(
  adapter: ReturnType<typeof resolveAdapters>[number],
  query: SearchQuery,
): Promise<{ listings: Listing[]; error?: { provider: ProviderId; message: string } }> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), config.providerTimeoutMs),
  );
  try {
    const listings = await Promise.race([adapter.search(query), timeout]);
    return { listings };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn('provider search failed', { provider: adapter.id, message });
    return { listings: [], error: { provider: adapter.id, message } };
  }
}

function applyFilters(products: Product[], q: SearchQuery): Product[] {
  return products.filter((p) => {
    if (q.brand && normalize(p.brand) !== normalize(q.brand)) return false;
    if (q.category && normalize(p.category) !== normalize(q.category)) return false;
    if (q.minPrice != null && p.lowestPrice < q.minPrice) return false;
    if (q.maxPrice != null && p.lowestPrice > q.maxPrice) return false;
    if (q.minRating != null && p.avgRating < q.minRating) return false;
    return true;
  });
}

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products];
  switch (sort) {
    case 'price_asc':
      return copy.sort((a, b) => a.lowestPrice - b.lowestPrice);
    case 'price_desc':
      return copy.sort((a, b) => b.lowestPrice - a.lowestPrice);
    case 'rating_desc':
      return copy.sort((a, b) => b.avgRating - a.avgRating || b.totalRatingCount - a.totalRatingCount);
    case 'discount_desc':
      return copy.sort((a, b) => b.bestOffer.discountPercent - a.bestOffer.discountPercent);
    case 'relevance':
    default:
      // Relevance ordering is preserved from adapter scoring; nudge multi-store
      // matches up since they are the most useful comparisons.
      return copy.sort((a, b) => b.storeCount - a.storeCount);
  }
}

function buildFacets(products: Product[]) {
  const brands = new Map<string, number>();
  const categories = new Map<string, number>();
  const providers = new Map<ProviderId, number>();
  let min = Number.POSITIVE_INFINITY;
  let max = 0;

  for (const p of products) {
    brands.set(p.brand, (brands.get(p.brand) ?? 0) + 1);
    categories.set(p.category, (categories.get(p.category) ?? 0) + 1);
    for (const o of p.offers) {
      providers.set(o.provider, (providers.get(o.provider) ?? 0) + 1);
    }
    min = Math.min(min, p.lowestPrice);
    max = Math.max(max, p.highestPrice);
  }

  const sortByCount = <T>(m: Map<T, number>) =>
    [...m.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);

  return {
    brands: sortByCount(brands),
    categories: sortByCount(categories),
    providers: sortByCount(providers),
    priceRange: {
      min: Number.isFinite(min) ? min : 0,
      max,
    },
  };
}

/**
 * The core comparison pipeline: fan out to every enabled provider in parallel,
 * match the raw listings into cross-store products, then filter, facet, sort and
 * paginate. Results are cached by a normalized query key.
 */
export async function search(query: SearchQuery): Promise<SearchResult> {
  const key = cacheKey(query);
  const cached = searchCache.get(key);
  if (cached) {
    return { ...cached, cached: true };
  }

  const started = Date.now();
  const adapters = resolveAdapters(query.providers);

  const settled = await Promise.all(adapters.map((a) => runAdapter(a, query)));

  const allListings: Listing[] = [];
  const providersQueried: ProviderId[] = [];
  const providerErrors: { provider: ProviderId; message: string }[] = [];

  settled.forEach((res, i) => {
    const adapter = adapters[i]!;
    if (res.error) providerErrors.push(res.error);
    else providersQueried.push(adapter.id);
    allListings.push(...res.listings);
  });

  const matched = matchListings(allListings);
  const filtered = applyFilters(matched, query);
  const facets = buildFacets(filtered);
  const sorted = sortProducts(filtered, query.sort ?? 'relevance');

  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(60, Math.max(1, query.pageSize ?? DEFAULT_PAGE_SIZE));
  const start = (page - 1) * pageSize;
  const pageItems = sorted.slice(start, start + pageSize);

  const result: SearchResult = {
    query,
    products: pageItems,
    total: sorted.length,
    page,
    pageSize,
    providersQueried,
    providerErrors,
    facets,
    tookMs: Date.now() - started,
    cached: false,
  };

  searchCache.set(key, result);
  logger.info('search completed', {
    q: query.q,
    total: result.total,
    providers: providersQueried,
    errors: providerErrors.length,
    tookMs: result.tookMs,
  });
  return result;
}

/**
 * Build a single cross-store product from a canonical product id by re-searching
 * the offers' native ids across providers. Returns null when nothing matches.
 */
export async function getProductById(id: string): Promise<Product | null> {
  // The canonical id embeds a hash of the offers, not the offer ids themselves,
  // so we reconstruct by scanning each provider's catalog for listings that,
  // once matched, produce this id. This is cheap against the dataset and, in
  // live mode, would be replaced by a persisted mapping.
  const adapters = resolveAdapters();
  const listings: Listing[] = [];
  for (const adapter of adapters) {
    const found = await adapter.search({ q: '' });
    listings.push(...found);
  }
  const products = matchListings(listings);
  return products.find((p) => p.id === id) ?? null;
}

/** Fetch a single provider listing directly by native id. */
export async function getListing(provider: ProviderId, providerProductId: string) {
  const adapter = getAdapter(provider);
  if (!adapter) return null;
  return adapter.getListing(providerProductId);
}

/** Test/introspection helper. */
export function clearSearchCache(): void {
  searchCache.clear();
}
