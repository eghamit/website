import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-app">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold text-[rgb(var(--text))]">ML Academy</span> — theory,
          mathematics &amp; solved examples.
        </p>
        <nav className="flex gap-4">
          <Link href="/learn" className="hover:text-brand-600">
            Curriculum
          </Link>
          <Link href="/search" className="hover:text-brand-600">
            Search
          </Link>
        </nav>
      </div>
    </footer>
  );
}
