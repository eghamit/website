/**
 * Core domain types shared across the provider adapters, the aggregation
 * engine, the API layer and the UI.
 */

export type ProviderId = 'myntra' | 'ajio' | 'meesho';

export type SortKey =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'discount_desc';

export interface SearchQuery {
  /** Free-text query, e.g. "running shoes". */
  q: string;
  /** Restrict to a subset of providers. Defaults to all enabled. */
  providers?: ProviderId[];
  /** Optional category filter (matched loosely). */
  category?: string;
  /** Optional brand filter (matched loosely). */
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

/**
 * A single product listing as returned by one provider. This is the raw,
 * per-store shape that adapters produce; the aggregator normalizes and groups
 * these into cross-store {@link Product} records.
 */
export interface Listing {
  provider: ProviderId;
  /** Provider-native product id. */
  providerProductId: string;
  title: string;
  brand: string;
  category: string;
  gender?: 'men' | 'women' | 'unisex' | 'kids';
  color?: string;
  imageUrl: string;
  url: string;
  /** Current selling price, in INR. */
  price: number;
  /** Maximum retail price, in INR. */
  mrp: number;
  inStock: boolean;
  /** Average rating on a 0–5 scale. */
  rating: number;
  ratingCount: number;
  deliveryEta?: string;
  description?: string;
}

/** A price offer from one provider, attached to a matched product. */
export interface Offer {
  provider: ProviderId;
  providerProductId: string;
  url: string;
  price: number;
  mrp: number;
  discountPercent: number;
  inStock: boolean;
  rating: number;
  ratingCount: number;
  deliveryEta?: string;
}

/**
 * A canonical product assembled from one or more provider {@link Listing}s that
 * were matched together. Derived fields (best offer, price range, savings) are
 * precomputed by the aggregator for a fast, allocation-free UI.
 */
export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  gender?: 'men' | 'women' | 'unisex' | 'kids';
  color?: string;
  imageUrl: string;
  description?: string;
  offers: Offer[];
  /** Cheapest in-stock offer (falls back to cheapest overall). */
  bestOffer: Offer;
  lowestPrice: number;
  highestPrice: number;
  /** Absolute INR saved by buying the cheapest vs. the dearest offer. */
  maxSavings: number;
  avgRating: number;
  totalRatingCount: number;
  /** Number of distinct providers that carry this product. */
  storeCount: number;
}

export interface SearchResult {
  query: SearchQuery;
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  /** Provider ids that responded successfully. */
  providersQueried: ProviderId[];
  /** Providers that errored, with a short reason. */
  providerErrors: { provider: ProviderId; message: string }[];
  /** Facet values derived from the full (pre-pagination) result set. */
  facets: {
    brands: { value: string; count: number }[];
    categories: { value: string; count: number }[];
    providers: { value: ProviderId; count: number }[];
    priceRange: { min: number; max: number };
  };
  /** Wall-clock time spent aggregating, in ms. */
  tookMs: number;
  /** Whether this result was served from cache. */
  cached: boolean;
}

export interface ProviderInfo {
  id: ProviderId;
  name: string;
  enabled: boolean;
  mode: 'dataset' | 'live';
}
