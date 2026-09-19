import type { Metadata } from 'next';
import Link from 'next/link';
import { modules, totalLessons } from '@/lib/content';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Curriculum',
  description: 'The full Machine Learning curriculum: four modules covering supervised and unsupervised learning, the perceptron and multilayer perceptrons.',
};

export default function CurriculumPage() {
  let counter = 0;
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Curriculum</h1>
        <p className="mt-2 text-muted">
          {modules.length} modules · {totalLessons()} lessons · theory, mathematics and solved
          examples throughout.
        </p>
      </header>

      <div className="space-y-8">
        {modules.map((m, mi) => (
          <section key={m.id} className="card p-5 sm:p-6">
            <div className="mb-4 flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl dark:bg-brand-900/30">
                {m.icon}
              </span>
              <div>
                <h2 className="text-xl font-bold">
                  <span className="text-muted">Module {mi + 1}</span> · {m.title}
                </h2>
                <p className="mt-1 text-sm text-muted">{m.description}</p>
              </div>
            </div>

            <ol className="grid gap-2 sm:grid-cols-2">
              {m.lessons.map((l) => {
                counter += 1;
                return (
                  <li key={l.slug}>
                    <Link
                      href={`/learn/${l.slug}`}
                      className="flex items-start gap-3 rounded-lg border border-app p-3 transition-colors hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-500/5"
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-zinc-100 text-xs font-bold text-muted dark:bg-zinc-800">
                        {counter}
                      </span>
                      <span>
                        <span className="block font-medium leading-snug">{l.title}</span>
                        <span className="mt-0.5 block text-xs text-muted">{l.summary}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link href={`/learn/${modules[0]!.lessons[0]!.slug}`} className="btn-primary">
          <BookOpen size={16} /> Begin the first lesson
        </Link>
      </div>
    </div>
  );
}
