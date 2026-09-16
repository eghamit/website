import { describe, it, expect, beforeEach } from 'vitest';
import { search, getProductById, clearSearchCache } from './aggregator';

describe('aggregator.search', () => {
  beforeEach(() => clearSearchCache());

  it('returns cross-store products for a query', async () => {
    const res = await search({ q: 'running shoes' });
    expect(res.total).toBeGreaterThan(0);
    const multi = res.products.find((p) => p.storeCount > 1);
    expect(multi).toBeDefined();
    expect(res.providersQueried.length).toBeGreaterThan(0);
    expect(res.providerErrors).toHaveLength(0);
  });

  it('serves the second identical query from cache', async () => {
    const first = await search({ q: 'jeans' });
    expect(first.cached).toBe(false);
    const second = await search({ q: 'jeans' });
    expect(second.cached).toBe(true);
  });

  it('applies a price ceiling filter', async () => {
    const res = await search({ q: 'shoes', maxPrice: 1000 });
    for (const p of res.products) expect(p.lowestPrice).toBeLessThanOrEqual(1000);
  });

  it('sorts by price ascending', async () => {
    const res = await search({ q: '', sort: 'price_asc', pageSize: 60 });
    const prices = res.products.map((p) => p.lowestPrice);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  it('restricts to a single provider', async () => {
    const res = await search({ q: '', providers: ['meesho'], pageSize: 60 });
    for (const p of res.products) {
      for (const o of p.offers) expect(o.provider).toBe('meesho');
    }
  });

  it('builds facets from the result set', async () => {
    const res = await search({ q: '' , pageSize: 60 });
    expect(res.facets.brands.length).toBeGreaterThan(0);
    expect(res.facets.priceRange.max).toBeGreaterThan(res.facets.priceRange.min);
  });

  it('paginates', async () => {
    const page1 = await search({ q: '', page: 1, pageSize: 5 });
    const page2 = await search({ q: '', page: 2, pageSize: 5 });
    expect(page1.products).toHaveLength(5);
    const ids1 = new Set(page1.products.map((p) => p.id));
    for (const p of page2.products) expect(ids1.has(p.id)).toBe(false);
  });
});

describe('aggregator.getProductById', () => {
  it('round-trips a product id from search', async () => {
    const res = await search({ q: 'earbuds' });
    const target = res.products[0]!;
    const fetched = await getProductById(target.id);
    expect(fetched).not.toBeNull();
    expect(fetched!.id).toBe(target.id);
    expect(fetched!.offers.length).toBe(target.offers.length);
  });

  it('returns null for an unknown id', async () => {
    expect(await getProductById('nope-000')).toBeNull();
  });
});
