import { Star } from 'lucide-react';
import clsx from 'clsx';

export function RatingStars({
  rating,
  count,
  size = 14,
}: {
  rating: number;
  count?: number;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      <span className="relative inline-block" style={{ width: size * 5, height: size }}>
        <span className="absolute inset-0 flex text-zinc-300 dark:text-zinc-600">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} strokeWidth={0} fill="currentColor" />
          ))}
        </span>
        <span
          className="absolute inset-0 flex overflow-hidden text-amber-400"
          style={{ width: `${pct}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} strokeWidth={0} fill="currentColor" className="shrink-0" />
          ))}
        </span>
      </span>
      <span className={clsx('text-xs font-medium')}>{rating.toFixed(1)}</span>
      {count != null && (
        <span className="text-xs text-muted">({formatCount(count)})</span>
      )}
    </span>
  );
}

function formatCount(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
