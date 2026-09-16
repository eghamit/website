import type { ProviderId, SearchQuery, SortKey } from './types';
import { ALL_PROVIDERS } from './config';

type Raw = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function num(v: string | string[] | undefined): number | undefined {
  const s = first(v);
  if (s == null || s === '') return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

const SORTS: SortKey[] = ['relevance', 'price_asc', 'price_desc', 'rating_desc', 'discount_desc'];

/** Parse loosely-typed request params (page searchParams or URLSearchParams) into a validated SearchQuery. */
export function parseSearchQuery(raw: Raw): SearchQuery {
  const providersRaw = first(raw.providers);
  const providers = providersRaw
    ? (providersRaw
        .split(',')
        .map((p) => p.trim().toLowerCase())
        .filter((p): p is ProviderId => (ALL_PROVIDERS as string[]).includes(p)))
    : undefined;

  const sortRaw = first(raw.sort) as SortKey | undefined;
  const sort = sortRaw && SORTS.includes(sortRaw) ? sortRaw : undefined;

  return {
    q: (first(raw.q) ?? '').slice(0, 120),
    providers: providers && providers.length ? providers : undefined,
    category: first(raw.category) || undefined,
    brand: first(raw.brand) || undefined,
    minPrice: num(raw.minPrice),
    maxPrice: num(raw.maxPrice),
    minRating: num(raw.minRating),
    sort,
    page: num(raw.page) ?? 1,
    pageSize: num(raw.pageSize),
  };
}
