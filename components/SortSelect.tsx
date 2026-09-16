'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { SortKey } from '@/lib/types';

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Rating' },
  { value: 'discount_desc', label: 'Biggest discount' },
];

export function SortSelect() {
  const router = useRouter();
  const params = useSearchParams();
  const current = (params.get('sort') as SortKey) ?? 'relevance';

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === 'relevance') next.delete('sort');
    else next.set('sort', value);
    next.delete('page');
    router.push(`/search?${next.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">Sort</span>
      <select
        className="input !w-auto"
        value={current}
        onChange={(e) => onChange(e.target.value)}
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
