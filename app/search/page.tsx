import type { Metadata } from 'next';
import Link from 'next/link';
import { searchIndex } from '@/lib/content';
import { SearchX } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Search',
};

type SearchParams = { q?: string | string[] };

function scoreDoc(haystack: string, terms: string[]): number {
  let score = 0;
  for (const t of terms) {
    if (!t) continue;
    // Count occurrences (cheap relevance).
    let idx = haystack.indexOf(t);
    while (idx !== -1) {
      score += 1;
      idx = haystack.indexOf(t, idx + t.length);
    }
  }
  return score;
}

export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const rawQ = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;
  const q = (rawQ ?? '').trim();
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);

  const results = q
    ? searchIndex()
        .map((doc) => ({ doc, score: scoreDoc(doc.haystack, terms) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">
        {q ? (
          <>
            Search results for <span className="text-brand-600">“{q}”</span>
          </>
        ) : (
          'Search lessons'
        )}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {q ? `${results.length} lesson${results.length === 1 ? '' : 's'} matched` : 'Type a topic in the search box above.'}
      </p>

      {q && results.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center gap-3 p-12 text-center">
          <SearchX size={40} className="text-muted" />
          <p className="text-muted">No lessons matched “{q}”. Try another keyword like “entropy”, “sigmoid” or “clustering”.</p>
          <Link href="/learn" className="btn-primary">
            Browse the curriculum
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {results.map(({ doc }) => (
            <li key={doc.slug}>
              <Link href={`/learn/${doc.slug}`} className="card block p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {doc.moduleTitle}
                </p>
                <p className="mt-0.5 font-semibold text-brand-600">{doc.title}</p>
                <p className="mt-0.5 text-sm text-muted">{doc.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
