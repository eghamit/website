import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allLessons, getLesson, neighbors } from '@/lib/content';
import { Blocks } from '@/components/BlockRenderer';
import { InlineText } from '@/components/InlineText';
import { ArrowLeft, ArrowRight, Target, BookMarked, Sparkles, CheckCircle2, Ban } from 'lucide-react';

export function generateStaticParams() {
  return allLessons().map(({ lesson }) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const found = getLesson(params.slug);
  if (!found) return { title: 'Lesson not found' };
  return {
    title: found.lesson.title,
    description: found.lesson.summary,
  };
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const found = getLesson(params.slug);
  if (!found) notFound();

  const { lesson, module, index } = found;
  const { prev, next } = neighbors(lesson.slug);

  return (
    <article>
      {/* Breadcrumb */}
      <nav className="mb-3 flex flex-wrap items-center gap-x-2 text-sm text-muted">
        <Link href="/learn" className="hover:text-brand-600">
          Curriculum
        </Link>
        <span>/</span>
        <span>{module.icon} {module.title}</span>
      </nav>

      <header className="mb-6 border-b border-app pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Lesson {index + 1}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{lesson.title}</h1>
        <p className="mt-2 text-lg text-muted">{lesson.summary}</p>

        {lesson.intro && (
          <div className="mt-5 overflow-hidden rounded-xl border border-app">
            <div className="flex items-center gap-2 border-b border-app bg-gradient-to-r from-brand-50 to-transparent px-4 py-2.5 dark:from-brand-900/20">
              <BookMarked size={16} className="text-brand-600 dark:text-brand-300" />
              <span className="text-sm font-semibold">At a glance</span>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Definition</p>
                <p className="mt-1 leading-7">
                  <InlineText text={lesson.intro.definition} />
                </p>
              </div>
              <div className="flex gap-2">
                <Sparkles size={16} className="mt-1 shrink-0 text-violet-500" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">
                    Why it matters
                  </p>
                  <p className="mt-1 leading-7">
                    <InlineText text={lesson.intro.whyItMatters} />
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-500/10">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 size={14} /> When to use
                  </p>
                  <ul className="mt-1.5 ml-4 list-disc space-y-1 text-sm leading-6 marker:text-emerald-500">
                    {lesson.intro.whenToUse.map((it, i) => (
                      <li key={i}>
                        <InlineText text={it} />
                      </li>
                    ))}
                  </ul>
                </div>
                {lesson.intro.whenNotToUse && lesson.intro.whenNotToUse.length > 0 && (
                  <div className="rounded-lg bg-rose-50 p-3 dark:bg-rose-500/10">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300">
                      <Ban size={14} /> When to avoid
                    </p>
                    <ul className="mt-1.5 ml-4 list-disc space-y-1 text-sm leading-6 marker:text-rose-400">
                      {lesson.intro.whenNotToUse.map((it, i) => (
                        <li key={i}>
                          <InlineText text={it} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="mt-5 rounded-xl border border-app bg-zinc-50 p-4 dark:bg-zinc-900/50">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Target size={16} className="text-brand-600" /> Learning objectives
            </p>
            <ul className="ml-5 list-disc space-y-1 text-sm leading-6 marker:text-brand-400">
              {lesson.objectives.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Body */}
      <div className="text-[15px] sm:text-base">
        <Blocks blocks={lesson.blocks} />
      </div>

      {/* Prev / next */}
      <nav className="mt-12 grid gap-3 border-t border-app pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/learn/${prev.lesson.slug}`}
            className="card group flex items-center gap-3 p-4"
          >
            <ArrowLeft size={18} className="shrink-0 text-muted group-hover:text-brand-600" />
            <span className="min-w-0">
              <span className="block text-xs text-muted">Previous</span>
              <span className="block truncate font-medium group-hover:text-brand-600">
                {prev.lesson.title}
              </span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/learn/${next.lesson.slug}`}
            className="card group flex items-center justify-end gap-3 p-4 text-right sm:col-start-2"
          >
            <span className="min-w-0">
              <span className="block text-xs text-muted">Next</span>
              <span className="block truncate font-medium group-hover:text-brand-600">
                {next.lesson.title}
              </span>
            </span>
            <ArrowRight size={18} className="shrink-0 text-muted group-hover:text-brand-600" />
          </Link>
        )}
      </nav>
    </article>
  );
}
