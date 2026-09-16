import { describe, it, expect } from 'vitest';
import { normalize, tokenize, jaccard, listingSimilarity, formatINR } from './text';

describe('normalize', () => {
  it('lowercases, strips punctuation and collapses whitespace', () => {
    expect(normalize('  Nike  Revolution-7 (Black)! ')).toBe('nike revolution 7 black');
  });
});

describe('tokenize', () => {
  it('removes stopwords and short tokens', () => {
    expect(tokenize('Running Shoes for Men')).toEqual(['running', 'shoes']);
  });
});

describe('jaccard', () => {
  it('is 1 for identical sets and 0 for disjoint', () => {
    expect(jaccard(['a', 'b'], ['a', 'b'])).toBe(1);
    expect(jaccard(['a'], ['b'])).toBe(0);
  });
  it('computes partial overlap', () => {
    expect(jaccard(['a', 'b', 'c'], ['a', 'b'])).toBeCloseTo(2 / 3, 5);
  });
});

describe('listingSimilarity', () => {
  it('scores same product across stores highly', () => {
    const a = { title: 'Nike Revolution 7 Running Shoes', brand: 'Nike', color: 'Black' };
    const b = { title: 'Nike Revolution 7 Lace-Up Running Shoes', brand: 'Nike', color: 'Black' };
    expect(listingSimilarity(a, b)).toBeGreaterThan(0.7);
  });

  it('returns 0 for different brands', () => {
    const a = { title: 'Revolution 7 Running Shoes', brand: 'Nike' };
    const b = { title: 'Revolution 7 Running Shoes', brand: 'Adidas' };
    expect(listingSimilarity(a, b)).toBe(0);
  });

  it('penalises mismatched colours', () => {
    const black = { title: 'Titan Neo Analog Watch', brand: 'Titan', color: 'Black' };
    const gold = { title: 'Titan Neo Analog Watch', brand: 'Titan', color: 'Rose Gold' };
    const same = { title: 'Titan Neo Analog Watch', brand: 'Titan', color: 'Black' };
    expect(listingSimilarity(black, gold)).toBeLessThan(listingSimilarity(black, same));
  });
});

describe('formatINR', () => {
  it('formats rupees without decimals', () => {
    expect(formatINR(1499)).toContain('1,499');
  });
});
