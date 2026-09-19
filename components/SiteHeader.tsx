import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { SearchBox } from './SearchBox';
import { ThemeToggle } from './ThemeToggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-app bg-[rgb(var(--surface))]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 text-white">
            <BrainCircuit size={18} />
          </span>
          <span className="hidden sm:inline">ML Academy</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 text-sm md:flex">
          <Link href="/learn" className="rounded-lg px-3 py-2 font-medium hover:bg-brand-50 dark:hover:bg-zinc-800">
            Curriculum
          </Link>
        </nav>

        <div className="ml-auto hidden w-full max-w-xs lg:block">
          <SearchBox />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <Link href="/learn" className="btn-primary hidden sm:inline-flex">
            Start learning
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="px-4 pb-3 lg:hidden">
        <SearchBox />
      </div>
    </header>
  );
}
