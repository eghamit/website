import type { Listing, Offer, Product } from './types';
import { listingSimilarity, normalize } from './text';

/** Listings scoring at or above this similarity are treated as the same product. */
export const MATCH_THRESHOLD = 0.62;

function toOffer(l: Listing): Offer {
  const discountPercent =
    l.mrp > 0 ? Math.round(((l.mrp - l.price) / l.mrp) * 100) : 0;
  return {
    provider: l.provider,
    providerProductId: l.providerProductId,
    url: l.url,
    price: l.price,
    mrp: l.mrp,
    discountPercent: Math.max(0, discountPercent),
    inStock: l.inStock,
    rating: l.rating,
    ratingCount: l.ratingCount,
    deliveryEta: l.deliveryEta,
  };
}

/** Deterministic canonical id for a group, independent of provider order. */
function canonicalId(listings: Listing[]): string {
  const parts = listings
    .map((l) => `${l.provider}:${l.providerProductId}`)
    .sort();
  // Short, stable, url-safe hash (djb2).
  let hash = 5381;
  const joined = parts.join('|');
  for (let i = 0; i < joined.length; i++) {
    hash = ((hash << 5) + hash + joined.charCodeAt(i)) >>> 0;
  }
  const brand = normalize(listings[0]!.brand).replace(/\s+/g, '-') || 'product';
  return `${brand}-${hash.toString(36)}`;
}

/**
 * Groups raw listings from many providers into canonical products.
 *
 * Uses greedy single-link clustering: each listing joins the first existing
 * cluster it is sufficiently similar to (and that does not already contain the
 * same provider), otherwise it seeds a new cluster. O(n·k) where k is the number
 * of clusters — fine for a page of results, and easy to reason about.
 */
export function matchListings(listings: Listing[]): Product[] {
  const clusters: Listing[][] = [];

  for (const listing of listings) {
    let placed = false;
    for (const cluster of clusters) {
      // One offer per provider per product.
      if (cluster.some((c) => c.provider === listing.provider)) continue;
      const repr = cluster[0]!;
      if (listingSimilarity(repr, listing) >= MATCH_THRESHOLD) {
        cluster.push(listing);
        placed = true;
        break;
      }
    }
    if (!placed) clusters.push([listing]);
  }

  return clusters.map(buildProduct);
}

function buildProduct(listings: Listing[]): Product {
  const offers = listings.map(toOffer);

  const prices = offers.map((o) => o.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);

  // Best offer: cheapest that is in stock, else cheapest overall.
  const inStock = offers.filter((o) => o.inStock);
  const pool = inStock.length ? inStock : offers;
  const bestOffer = pool.reduce((best, o) => (o.price < best.price ? o : best));

  const totalRatingCount = offers.reduce((s, o) => s + o.ratingCount, 0);
  const avgRating =
    totalRatingCount > 0
      ? offers.reduce((s, o) => s + o.rating * o.ratingCount, 0) / totalRatingCount
      : offers.reduce((s, o) => s + o.rating, 0) / offers.length;

  // Prefer the richest listing for display metadata.
  const primary =
    listings.find((l) => l.description) ??
    listings.reduce((a, b) => (a.title.length >= b.title.length ? a : b));

  return {
    id: canonicalId(listings),
    title: primary.title,
    brand: primary.brand,
    category: primary.category,
    gender: primary.gender,
    color: primary.color,
    imageUrl: primary.imageUrl,
    description: primary.description,
    offers: offers.sort((a, b) => a.price - b.price),
    bestOffer,
    lowestPrice,
    highestPrice,
    maxSavings: highestPrice - lowestPrice,
    avgRating: Math.round(avgRating * 10) / 10,
    totalRatingCount,
    storeCount: new Set(offers.map((o) => o.provider)).size,
  };
}
