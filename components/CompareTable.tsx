import type { Product } from '@/lib/types';
import { formatINR } from '@/lib/text';
import { ProviderBadge } from './ProviderBadge';
import { RatingStars } from './RatingStars';
import { Check, X, ExternalLink, BadgeCheck } from 'lucide-react';

/**
 * Side-by-side price comparison across every store that carries the product.
 * The cheapest in-stock offer is highlighted as the best deal.
 */
export function CompareTable({ product }: { product: Product }) {
  const offers = product.offers; // already sorted cheapest-first by the matcher

  return (
    <div className="overflow-hidden rounded-xl border border-app">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="surface border-b border-app text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-semibold">Store</th>
            <th className="px-4 py-3 font-semibold">Price</th>
            <th className="hidden px-4 py-3 font-semibold sm:table-cell">Discount</th>
            <th className="hidden px-4 py-3 font-semibold md:table-cell">Rating</th>
            <th className="hidden px-4 py-3 font-semibold md:table-cell">Delivery</th>
            <th className="px-4 py-3 font-semibold">Stock</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => {
            const isBest = offer.provider === product.bestOffer.provider;
            return (
              <tr
                key={`${offer.provider}-${offer.providerProductId}`}
                className={`border-b border-app last:border-0 ${
                  isBest ? 'bg-emerald-50 dark:bg-emerald-500/10' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ProviderBadge provider={offer.provider} />
                    {isBest && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <BadgeCheck size={14} /> Best deal
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold">{formatINR(offer.price)}</span>
                    {offer.mrp > offer.price && (
                      <span className="text-xs text-muted line-through">{formatINR(offer.mrp)}</span>
                    )}
                  </div>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {offer.discountPercent > 0 ? (
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {offer.discountPercent}% off
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <RatingStars rating={offer.rating} count={offer.ratingCount} />
                </td>
                <td className="hidden px-4 py-3 text-muted md:table-cell">
                  {offer.deliveryEta ?? 'Standard'}
                </td>
                <td className="px-4 py-3">
                  {offer.inStock ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Check size={15} /> In stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                      <X size={15} /> Out
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="btn-primary !px-3 !py-1.5"
                  >
                    Buy <ExternalLink size={14} />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
