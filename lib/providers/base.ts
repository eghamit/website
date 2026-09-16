import type { Listing, ProviderId, SearchQuery } from '../types';
import { CATALOG, imageFor, type BaseProduct, type ProviderEntry } from '../data/catalog';
import { normalize, tokenize } from '../text';

/**
 * The contract every store adapter implements. Add a new store by dropping in a
 * file that exports one of these and registering it in `providers/index.ts` —
 * nothing else in the app needs to change.
 */
export interface ProviderAdapter {
  readonly id: ProviderId;
  readonly name: string;
  /** Return this store's listings matching the query. Must not throw for
   *  "no results"; throw only on genuine upstream failure. */
  search(query: SearchQuery): Promise<Listing[]>;
  /** Fetch a single listing by this store's native product id, or null. */
  getListing(providerProductId: string): Promise<Listing | null>;
}

function buildListing(base: BaseProduct, entry: ProviderEntry): Listing {
  return {
    provider: entry.provider,
    providerProductId: entry.pid,
    title: entry.title ?? base.title,
    brand: base.brand,
    category: base.category,
    gender: base.gender,
    color: base.color,
    imageUrl: imageFor(base.key),
    url: storeUrl(entry.provider, entry.pid),
    price: entry.price,
    mrp: entry.mrp,
    inStock: entry.inStock ?? true,
    rating: entry.rating,
    ratingCount: entry.ratingCount,
    deliveryEta: entry.deliveryEta,
    description: base.description,
  };
}

function storeUrl(provider: ProviderId, pid: string): string {
  switch (provider) {
    case 'myntra':
      return `https://www.myntra.com/product/${encodeURIComponent(pid)}`;
    case 'ajio':
      return `https://www.ajio.com/p/${encodeURIComponent(pid)}`;
    case 'meesho':
      return `https://www.meesho.com/product/${encodeURIComponent(pid)}`;
  }
}

/** Simple relevance score of a listing against a free-text query. */
function relevance(listing: Listing, query: string): number {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return 1;
  const haystack = tokenize(
    `${listing.title} ${listing.brand} ${listing.category} ${listing.color ?? ''}`,
  );
  const hay = new Set(haystack);
  let hits = 0;
  for (const t of qTokens) if (hay.has(t)) hits++;
  // Also reward substring hits on the raw (normalized) title for partial words.
  const normTitle = normalize(`${listing.title} ${listing.brand} ${listing.category}`);
  const substringBonus = qTokens.some((t) => normTitle.includes(t)) ? 0.25 : 0;
  return hits / qTokens.length + substringBonus;
}

/**
 * Shared dataset-backed adapter. Each concrete provider is just this class bound
 * to its id/name. In `live` mode you would replace `search`/`getListing` with
 * real HTTP calls (the return shape is identical).
 */
export class DatasetProviderAdapter implements ProviderAdapter {
  constructor(
    readonly id: ProviderId,
    readonly name: string,
  ) {}

  private listingsForStore(): Listing[] {
    const out: Listing[] = [];
    for (const base of CATALOG) {
      for (const entry of base.entries) {
        if (entry.provider === this.id) out.push(buildListing(base, entry));
      }
    }
    return out;
  }

  async search(query: SearchQuery): Promise<Listing[]> {
    const all = this.listingsForStore();
    const scored = all
      .map((l) => ({ l, score: relevance(l, query.q) }))
      // A token must actually appear (score >= 1 token worth) unless the query
      // is empty, in which case everything is returned.
      .filter(({ score }) => (query.q.trim() ? score >= 0.25 : true))
      .sort((a, b) => b.score - a.score)
      .map(({ l }) => l);
    return scored;
  }

  async getListing(providerProductId: string): Promise<Listing | null> {
    for (const base of CATALOG) {
      const entry = base.entries.find(
        (e) => e.provider === this.id && e.pid === providerProductId,
      );
      if (entry) return buildListing(base, entry);
    }
    return null;
  }
}
