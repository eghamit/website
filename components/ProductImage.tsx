'use client';

import { useState } from 'react';
import clsx from 'clsx';

/**
 * Image with a skeleton placeholder and a graceful fallback when the remote
 * image can't load (e.g. offline / blocked host).
 */
export function ProductImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className={clsx('relative overflow-hidden bg-zinc-100 dark:bg-zinc-800', className)}>
      {status === 'loading' && <div className="skeleton absolute inset-0" />}
      {status === 'error' ? (
        <div className="flex h-full w-full items-center justify-center text-muted">
          <span className="text-xs">No image</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={clsx(
            'h-full w-full object-cover transition-opacity duration-300',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  );
}
