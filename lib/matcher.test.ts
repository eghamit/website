import { describe, it, expect } from 'vitest';
import { matchListings } from './matcher';
import type { Listing } from './types';

function listing(over: Partial<Listing>): Listing {
  return {
    provider: 'myntra',
    providerProductId: 'x',
    title: 'Item',
    brand: 'Brand',
    category: 'Cat',
    color: 'Black',
    imageUrl: 'http://img',
    url: 'http://u',
    price: 100,
    mrp: 200,
    inStock: true,
    rating: 4,
    ratingCount: 10,
    ...over,
  };
}

describe('matchListings', () => {
  it('groups the same product from different stores into one', () => {
    const listings: Listing[] = [
      listing({ provider: 'myntra', providerProductId: 'm1', title: 'Nike Revolution 7 Running Shoes', brand: 'Nike', price: 3495, mrp: 4295 }),
      listing({ provider: 'ajio', providerProductId: 'a1', title: 'Nike Revolution 7 Lace-Up Running Shoes', brand: 'Nike', price: 3295, mrp: 4295 }),
    ];
    const products = matchListings(listings);
    expect(products).toHaveLength(1);
    expect(products[0]!.storeCount).toBe(2);
    expect(products[0]!.offers).toHaveLength(2);
  });

  it('does not merge different brands', () => {
    const listings: Listing[] = [
      listing({ provider: 'myntra', providerProductId: 'm1', title: 'Revolution 7 Running Shoes', brand: 'Nike' }),
      listing({ provider: 'ajio', providerProductId: 'a1', title: 'Revolution 7 Running Shoes', brand: 'Adidas' }),
    ];
    expect(matchListings(listings)).toHaveLength(2);
  });

  it('never places two listings from the same provider in one group', () => {
    const listings: Listing[] = [
      listing({ provider: 'myntra', providerProductId: 'm1', title: 'Nike Revolution 7', brand: 'Nike' }),
      listing({ provider: 'myntra', providerProductId: 'm2', title: 'Nike Revolution 7', brand: 'Nike' }),
    ];
    expect(matchListings(listings)).toHaveLength(2);
  });

  it('computes best offer, savings and price range', () => {
    const products = matchListings([
      listing({ provider: 'myntra', providerProductId: 'm1', title: 'boAt Airdopes 141', brand: 'boAt', price: 1299, mrp: 4490 }),
      listing({ provider: 'meesho', providerProductId: 'ms1', title: 'boAt Airdopes 141 Earbuds', brand: 'boAt', price: 1099, mrp: 4490 }),
    ]);
    const p = products[0]!;
    expect(p.lowestPrice).toBe(1099);
    expect(p.highestPrice).toBe(1299);
    expect(p.maxSavings).toBe(200);
    expect(p.bestOffer.provider).toBe('meesho');
  });

  it('prefers an in-stock offer as best even when a cheaper one is out of stock', () => {
    const products = matchListings([
      listing({ provider: 'meesho', providerProductId: 'ms1', title: 'Campus North Plus', brand: 'Campus', price: 849, inStock: false }),
      listing({ provider: 'myntra', providerProductId: 'm1', title: 'Campus North Plus Shoes', brand: 'Campus', price: 999, inStock: true }),
    ]);
    expect(products[0]!.bestOffer.provider).toBe('myntra');
  });

  it('produces a stable id regardless of listing order', () => {
    const a = matchListings([
      listing({ provider: 'myntra', providerProductId: 'm1', title: 'Titan Neo', brand: 'Titan' }),
      listing({ provider: 'meesho', providerProductId: 'ms1', title: 'Titan Neo Watch', brand: 'Titan' }),
    ])[0]!;
    const b = matchListings([
      listing({ provider: 'meesho', providerProductId: 'ms1', title: 'Titan Neo Watch', brand: 'Titan' }),
      listing({ provider: 'myntra', providerProductId: 'm1', title: 'Titan Neo', brand: 'Titan' }),
    ])[0]!;
    expect(a.id).toBe(b.id);
  });
});
