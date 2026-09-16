'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import clsx from 'clsx';

export function SearchBar({
  initialQuery = '',
  size = 'md',
  autoFocus = false,
}: {
  initialQuery?: string;
  size?: 'md' | 'lg';
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  }

  return (
    <form onSubmit={onSubmit} role="search" className="w-full">
      <div className="relative">
        <Search
          size={size === 'lg' ? 20 : 18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          name="q"
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for shoes, kurtas, watches, earbuds…"
          aria-label="Search products"
          className={clsx(
            'input pl-10',
            size === 'lg' ? 'h-14 text-base' : 'h-11',
          )}
        />
        <button
          type="submit"
          className={clsx(
            'btn-primary absolute right-1.5 top-1/2 -translate-y-1/2',
            size === 'lg' ? 'h-11' : 'h-8 !px-3',
          )}
        >
          Search
        </button>
      </div>
    </form>
  );
}
