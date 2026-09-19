'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';

export interface SidebarModule {
  id: string;
  title: string;
  icon: string;
  lessons: { slug: string; title: string }[];
}

export function Sidebar({ modules }: { modules: SidebarModule[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="space-y-6">
      {modules.map((m, mi) => (
        <div key={m.id}>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
            <span aria-hidden>{m.icon}</span>
            {mi + 1}. {m.title}
          </p>
          <ul className="space-y-0.5 border-l border-app">
            {m.lessons.map((l) => {
              const active = pathname === `/learn/${l.slug}`;
              return (
                <li key={l.slug}>
                  <Link
                    href={`/learn/${l.slug}`}
                    onClick={() => setOpen(false)}
                    className={clsx(
                      '-ml-px block border-l-2 py-1.5 pl-3 pr-2 text-sm transition-colors',
                      active
                        ? 'border-brand-600 font-semibold text-brand-600'
                        : 'border-transparent text-[rgb(var(--text))]/75 hover:border-brand-300 hover:text-brand-600',
                    )}
                  >
                    {l.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="btn-ghost mb-4 w-full lg:hidden"
        aria-label="Open lesson navigation"
      >
        <Menu size={16} /> Lessons
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">{nav}</div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="surface absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto border-r border-app p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">Curriculum</span>
              <button onClick={() => setOpen(false)} aria-label="Close" className="btn-ghost !px-2">
                <X size={18} />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}
    </>
  );
}
