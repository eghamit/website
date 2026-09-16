import type { Metadata } from 'next';
import { search } from '@/lib/aggregator';
import { parseSearchQuery } from '@/lib/query';
import { Filters } from '@/components/Filters';
import { SortSelect } from '@/components/SortSelect';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';
import { ProviderBadge } from '@/components/ProviderBadge';
import { SearchX, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';
  return {
    title: q ? `“${q}” — compare prices` : 'Browse & compare',
  };
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const query = parseSearchQuery(searchParams);
  const result = await search(query);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex flex-col gap-1">
        <h1 className="text-xl font-bold">
          {query.q ? (
            <>
              Results for <span className="text-brand-600">“{query.q}”</span>
            </>
          ) : (
            'Browse all products'
          )}
        </h1>
        <p className="text-sm text-muted">
          {result.total} product{result.total === 1 ? '' : 's'} · compared across{' '}
          {result.providersQueried.length} store
          {result.providersQueried.length === 1 ? '' : 's'} · {result.tookMs} ms
          {result.cached && ' · cached'}
        </p>
      </div>

      {result.providerErrors.length > 0 && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <div>
            Some stores couldn’t be reached:{' '}
            {result.providerErrors.map((e, i) => (
              <span key={e.provider}>
                {i > 0 && ', '}
                <ProviderBadge provider={e.provider} /> <span className="text-xs">({e.message})</span>
              </span>
            ))}
            . Showing results from the rest.
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Filters result={result} />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted">
              Showing {result.products.length} of {result.total}
            </span>
            <SortSelect />
          </div>

          {result.products.length === 0 ? (
            <EmptyState query={query.q} />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {result.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination page={result.page} pageSize={result.pageSize} total={result.total} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 p-12 text-center">
      <SearchX size={40} className="text-muted" />
      <h2 className="text-lg font-semibold">No matching products</h2>
      <p className="max-w-sm text-sm text-muted">
        {query
          ? `We couldn't find anything for “${query}” with the current filters. Try a broader term or clear some filters.`
          : 'No products match the current filters. Try clearing them.'}
      </p>
    </div>
  );
}
