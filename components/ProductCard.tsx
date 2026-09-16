import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatINR } from '@/lib/text';
import { RatingStars } from './RatingStars';
import { ProviderBadge } from './ProviderBadge';
import { ProductImage } from './ProductImage';
import { Store, TrendingDown } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const { bestOffer } = product;
  return (
    <Link
      href={`/product/${product.id}`}
      className="card group flex flex-col overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="relative">
        <ProductImage
          src={product.imageUrl}
          alt={product.title}
          className="aspect-[4/5] w-full"
        />
        {bestOffer.discountPercent > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-emerald-600 px-1.5 py-0.5 text-xs font-bold text-white">
            {bestOffer.discountPercent}% OFF
          </span>
        )}
        {product.storeCount > 1 && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
            <Store size={11} /> {product.storeCount} stores
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{product.brand}</p>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-brand-600">
          {product.title}
        </h3>

        <div className="mt-0.5">
          <RatingStars rating={product.avgRating} count={product.totalRatingCount} />
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold">{formatINR(bestOffer.price)}</span>
              {bestOffer.mrp > bestOffer.price && (
                <span className="text-xs text-muted line-through">{formatINR(bestOffer.mrp)}</span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              lowest on <ProviderBadge provider={bestOffer.provider} />
            </div>
          </div>
        </div>

        {product.maxSavings > 0 && product.storeCount > 1 && (
          <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <TrendingDown size={13} /> Save {formatINR(product.maxSavings)} vs. dearest store
          </div>
        )}
      </div>
    </Link>
  );
}
