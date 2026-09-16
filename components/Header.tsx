import Link from 'next/link';
import { ScanBarcode } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-app bg-[rgb(var(--surface))]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
            <ScanBarcode size={18} />
          </span>
          <span className="hidden sm:inline">PriceCompare</span>
        </Link>

        <div className="hidden flex-1 md:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/search" className="btn-ghost hidden sm:inline-flex">
            Browse
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
