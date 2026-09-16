'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({
  page,
  pageSize,
  total,
}: {
  page: number;
  pageSize: number;
  total: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (totalPages <= 1) return null;

  function go(p: number) {
    const next = new URLSearchParams(params.toString());
    if (p <= 1) next.delete('page');
    else next.set('page', String(p));
    router.push(`/search?${next.toString()}`);
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        className="btn-ghost disabled:opacity-40"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft size={16} /> Prev
      </button>
      <span className="px-2 text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      <button
        className="btn-ghost disabled:opacity-40"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
      >
        Next <ChevronRight size={16} />
      </button>
    </nav>
  );
}
