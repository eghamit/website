import Link from 'next/link';
import { modules, totalLessons } from '@/lib/content';
import { BookOpen, FunctionSquare, FlaskConical, GraduationCap, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-app">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-transparent to-violet-50 dark:from-brand-900/20 dark:to-violet-900/10" />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-app px-3 py-1 text-xs font-medium text-muted">
            <GraduationCap size={14} className="text-brand-500" /> {modules.length} modules ·{' '}
            {totalLessons()} lessons · free
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Learn{' '}
            <span className="bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">
              Machine Learning
            </span>{' '}
            properly
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            A complete, from-scratch course covering the <strong>theory</strong>, the{' '}
            <strong>mathematics</strong> behind every method, and <strong>solved examples</strong> you
            can follow by hand — from linear regression to backpropagation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/learn" className="btn-primary h-11 px-5 text-base">
              <BookOpen size={18} /> Start learning
            </Link>
            <Link href="/learn/the-perceptron" className="btn-ghost h-11 px-5 text-base">
              Jump to neural networks <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          <Feature
            icon={<BookOpen size={20} />}
            title="Clear theory"
            body="Plain-language explanations and intuition for every concept, built up step by step."
          />
          <Feature
            icon={<FunctionSquare size={20} />}
            title="The real mathematics"
            body="Every model's equations, cost functions and update rules — rendered beautifully with LaTeX."
          />
          <Feature
            icon={<FlaskConical size={20} />}
            title="Solved examples"
            body="Worked numeric examples you can reproduce by hand to lock in understanding."
          />
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <h2 className="mb-6 text-2xl font-bold">What you’ll cover</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map((m, mi) => (
            <Link
              key={m.id}
              href={`/learn/${m.lessons[0]!.slug}`}
              className="card group flex flex-col p-6"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl dark:bg-brand-900/30">
                  {m.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Module {mi + 1}
                  </p>
                  <h3 className="text-lg font-bold group-hover:text-brand-600">{m.title}</h3>
                </div>
              </div>
              <p className="text-sm text-muted">{m.description}</p>
              <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
                {m.lessons.length} lessons <ArrowRight size={14} />
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card p-6">
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}
