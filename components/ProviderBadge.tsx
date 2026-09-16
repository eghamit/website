import type { ProviderId } from '@/lib/types';
import clsx from 'clsx';

const META: Record<ProviderId, { label: string; classes: string }> = {
  myntra: { label: 'Myntra', classes: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300' },
  ajio: { label: 'Ajio', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
  meesho: { label: 'Meesho', classes: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300' },
};

export function ProviderBadge({ provider, className }: { provider: ProviderId; className?: string }) {
  const meta = META[provider];
  return (
    <span className={clsx('rounded-md px-2 py-0.5 text-xs font-semibold', meta.classes, className)}>
      {meta.label}
    </span>
  );
}

export function providerLabel(provider: ProviderId): string {
  return META[provider].label;
}
