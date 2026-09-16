/**
 * Text normalization and similarity helpers used by the cross-store matcher.
 * Kept dependency-free and deterministic so it is trivial to unit test.
 */

const STOPWORDS = new Set([
  'the', 'a', 'an', 'for', 'with', 'and', 'of', 'in', 'to', 'by',
  'mens', 'womens', 'men', 'women', 'kids', 'unisex',
  'pack', 'set', 'new', 'latest', 'combo', 'original',
]);

/** Lowercase, strip punctuation, collapse whitespace. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Normalize then split into meaningful tokens (stopwords removed). */
export function tokenize(input: string): string[] {
  return normalize(input)
    .split(' ')
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/** Jaccard similarity between two token sets, in [0, 1]. */
export function jaccard(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  for (const t of setA) if (setB.has(t)) intersection++;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Overall similarity between two product-like listings. Brand and colour agreement
 * are weighted heavily because they are strong disambiguators; the rest comes
 * from token overlap of the titles.
 */
export function listingSimilarity(
  a: { title: string; brand: string; color?: string },
  b: { title: string; brand: string; color?: string },
): number {
  const brandMatch = normalize(a.brand) === normalize(b.brand);
  // Different brands are almost never the same product.
  if (!brandMatch) return 0;

  const titleSim = jaccard(tokenize(a.title), tokenize(b.title));

  let colorScore = 0;
  if (a.color && b.color) {
    colorScore = normalize(a.color) === normalize(b.color) ? 0.15 : -0.2;
  }

  return Math.max(0, Math.min(1, 0.85 * titleSim + 0.15 + colorScore));
}

/** Stable currency formatting for INR. */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
