import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/aggregator';
import { formatINR } from '@/lib/text';
import { CompareTable } from '@/components/CompareTable';
import { ProductImage } from '@/components/ProductImage';
import { RatingStars } from '@/components/RatingStars';
import { ProviderBadge } from '@/components/ProviderBadge';
import { ChevronRight, PiggyBank, Store } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProductById(params.id);
  if (!product) return { title: 'Product not found' };
  return {
    title: `${product.title} — from ${formatINR(product.lowestPrice)}`,
    description: `Compare ${product.title} across ${product.storeCount} stores. Best price ${formatINR(
      product.lowestPrice,
    )}.`,
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const savingsPct =
    product.highestPrice > 0
      ? Math.round((product.maxSavings / product.highestPrice) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link
          href={`/search?category=${encodeURIComponent(product.category)}`}
          className="hover:text-brand-600"
        >
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span className="truncate text-[rgb(var(--text))]">{product.brand}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-[340px_1fr]">
        {/* Image */}
        <div>
          <ProductImage
            src={product.imageUrl}
            alt={product.title}
            className="aspect-[4/5] w-full rounded-xl border border-app"
          />
        </div>

        {/* Summary */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {product.brand}
          </p>
          <h1 className="mt-1 text-2xl font-bold leading-tight">{product.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <RatingStars rating={product.avgRating} count={product.totalRatingCount} size={16} />
            <span className="chip text-muted">
              <Store size={12} /> {product.storeCount} store{product.storeCount === 1 ? '' : 's'}
            </span>
            {product.color && <span className="chip text-muted">{product.color}</span>}
          </div>

          {product.description && (
            <p className="mt-4 text-sm text-muted">{product.description}</p>
          )}

          {/* Best price panel */}
          <div className="mt-5 rounded-xl border border-app bg-emerald-50 p-4 dark:bg-emerald-500/10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  Best price
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">
                    {formatINR(product.lowestPrice)}
                  </span>
                  <span className="text-sm text-muted">on</span>
                  <ProviderBadge provider={product.bestOffer.provider} />
                </div>
              </div>
              {product.maxSavings > 0 && product.storeCount > 1 && (
                <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-black/20 dark:text-emerald-300">
                  <PiggyBank size={18} />
                  Save up to {formatINR(product.maxSavings)} ({savingsPct}%)
                </div>
              )}
            </div>
            <a
              href={product.bestOffer.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="btn-primary mt-4 w-full sm:w-auto"
            >
              Buy at best price
            </a>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Price comparison</h2>
        <CompareTable product={product} />
        <p className="mt-3 text-xs text-muted">
          Prices, ratings and availability are from the bundled demo dataset and are illustrative.
        </p>
      </section>
    </div>
  );
}
