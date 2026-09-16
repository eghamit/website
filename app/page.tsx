import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { ProviderBadge } from '@/components/ProviderBadge';
import { CATALOG } from '@/lib/data/catalog';
import { Search, Sparkles, Store, TrendingDown } from 'lucide-react';

const POPULAR = [
  'running shoes',
  'anarkali kurta',
  'jeans',
  'smartwatch',
  'earbuds',
  'sunglasses',
  'backpack',
  'saree',
];

function topCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of CATALOG) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export default function HomePage() {
  const categories = topCategories();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-app">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-transparent to-transparent dark:from-brand-900/20" />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-app px-3 py-1 text-xs font-medium text-muted">
            <Sparkles size={13} className="text-brand-500" /> One search, every store
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Compare prices across{' '}
            <span className="bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">
              Myntra, Ajio &amp; Meesho
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
            Search once and instantly see who has the lowest price, best rating and fastest delivery —
            so you always grab the best deal.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar size="lg" autoFocus />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-muted">Popular:</span>
            {POPULAR.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="chip hover:border-brand-400 hover:text-brand-600"
              >
                {term}
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted">Comparing:</span>
            <ProviderBadge provider="myntra" />
            <ProviderBadge provider="ajio" />
            <ProviderBadge provider="meesho" />
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          <Feature
            icon={<Search size={20} />}
            title="Unified search"
            body="Query every connected store at once through a single, fast search."
          />
          <Feature
            icon={<Store size={20} />}
            title="Cross-store matching"
            body="We automatically group the same product across stores so you compare like-for-like."
          />
          <Feature
            icon={<TrendingDown size={20} />}
            title="Lowest price, surfaced"
            body="The best in-stock deal is highlighted, with the exact rupees you save."
          />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="mb-4 text-lg font-semibold">Browse by category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/search?category=${encodeURIComponent(c.name)}`}
              className="card flex items-center justify-between p-4"
            >
              <span className="font-medium">{c.name}</span>
              <span className="chip text-muted">{c.count}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card p-5">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}
