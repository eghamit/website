'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type { ProviderId, SearchResult } from '@/lib/types';
import { providerLabel } from './ProviderBadge';
import { formatINR } from '@/lib/text';
import { X } from 'lucide-react';

const PROVIDERS: ProviderId[] = ['myntra', 'ajio', 'meesho'];

export function Filters({ result }: { result: SearchResult }) {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === '') next.delete(k);
        else next.set(k, v);
      }
      next.delete('page'); // reset pagination on any filter change
      router.push(`/search?${next.toString()}`);
    },
    [params, router],
  );

  const selectedProviders = (params.get('providers')?.split(',').filter(Boolean) ??
    []) as ProviderId[];

  function toggleProvider(id: ProviderId) {
    const set = new Set(selectedProviders);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    setParam({ providers: set.size ? [...set].join(',') : null });
  }

  const currentBrand = params.get('brand') ?? '';
  const currentCategory = params.get('category') ?? '';
  const minPrice = params.get('minPrice') ?? '';
  const maxPrice = params.get('maxPrice') ?? '';
  const minRating = params.get('minRating') ?? '';

  const hasFilters =
    selectedProviders.length > 0 ||
    currentBrand ||
    currentCategory ||
    minPrice ||
    maxPrice ||
    minRating;

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filters</h2>
        {hasFilters && (
          <button
            onClick={() =>
              setParam({
                providers: null,
                brand: null,
                category: null,
                minPrice: null,
                maxPrice: null,
                minRating: null,
              })
            }
            className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      <FilterSection title="Store">
        <div className="space-y-1.5">
          {PROVIDERS.map((id) => {
            const facet = result.facets.providers.find((p) => p.value === id);
            return (
              <label key={id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-app accent-brand-600"
                  checked={selectedProviders.includes(id)}
                  onChange={() => toggleProvider(id)}
                />
                <span>{providerLabel(id)}</span>
                {facet && <span className="ml-auto text-xs text-muted">{facet.count}</span>}
              </label>
            );
          })}
        </div>
      </FilterSection>

      {result.facets.categories.length > 1 && (
        <FilterSection title="Category">
          <select
            className="input"
            value={currentCategory}
            onChange={(e) => setParam({ category: e.target.value || null })}
          >
            <option value="">All categories</option>
            {result.facets.categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.value} ({c.count})
              </option>
            ))}
          </select>
        </FilterSection>
      )}

      {result.facets.brands.length > 1 && (
        <FilterSection title="Brand">
          <select
            className="input"
            value={currentBrand}
            onChange={(e) => setParam({ brand: e.target.value || null })}
          >
            <option value="">All brands</option>
            {result.facets.brands.map((b) => (
              <option key={b.value} value={b.value}>
                {b.value} ({b.count})
              </option>
            ))}
          </select>
        </FilterSection>
      )}

      <FilterSection title="Price">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={String(result.facets.priceRange.min)}
            defaultValue={minPrice}
            aria-label="Minimum price"
            className="input"
            onBlur={(e) => setParam({ minPrice: e.target.value || null })}
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={String(result.facets.priceRange.max)}
            defaultValue={maxPrice}
            aria-label="Maximum price"
            className="input"
            onBlur={(e) => setParam({ maxPrice: e.target.value || null })}
          />
        </div>
        <p className="mt-1.5 text-xs text-muted">
          Range: {formatINR(result.facets.priceRange.min)} – {formatINR(result.facets.priceRange.max)}
        </p>
      </FilterSection>

      <FilterSection title="Minimum rating">
        <div className="flex flex-wrap gap-1.5">
          {['4', '3', '2'].map((r) => (
            <button
              key={r}
              onClick={() => setParam({ minRating: minRating === r ? null : r })}
              className={`chip ${
                minRating === r ? 'bg-brand-600 text-white border-brand-600' : ''
              }`}
            >
              {r}★ & up
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{title}</h3>
      {children}
    </div>
  );
}
