import type { Block, Lesson, Module } from './types';
import { foundations } from './foundations';
import { supervised } from './supervised';
import { unsupervised } from './unsupervised';
import { perceptron } from './perceptron';
import { mlp } from './mlp';
import { intros } from './intros';

/** Attach the shared "At a glance" background card to each lesson by slug. */
function withIntros(module: Module): Module {
  return {
    ...module,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      intro: lesson.intro ?? intros[lesson.slug],
    })),
  };
}

export const modules: Module[] = [foundations, supervised, unsupervised, perceptron, mlp].map(
  withIntros,
);

export type { Block, Lesson, Module };
export * from './types';

/** Flat, ordered list of every lesson with its module context. */
export interface FlatLesson {
  lesson: Lesson;
  module: Module;
  /** Global index in reading order, for prev/next. */
  index: number;
}

const flat: FlatLesson[] = modules.flatMap((module) =>
  module.lessons.map((lesson) => ({ lesson, module, index: 0 })),
);
flat.forEach((f, i) => (f.index = i));

export function allLessons(): FlatLesson[] {
  return flat;
}

export function totalLessons(): number {
  return flat.length;
}

export function getLesson(slug: string): FlatLesson | undefined {
  return flat.find((f) => f.lesson.slug === slug);
}

export function getModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function neighbors(slug: string): {
  prev?: FlatLesson;
  next?: FlatLesson;
} {
  const current = getLesson(slug);
  if (!current) return {};
  return {
    prev: current.index > 0 ? flat[current.index - 1] : undefined,
    next: current.index < flat.length - 1 ? flat[current.index + 1] : undefined,
  };
}

/** Extract plain, searchable text from a lesson's blocks. */
function blockText(block: Block): string {
  switch (block.type) {
    case 'heading':
    case 'p':
      return block.text;
    case 'math':
      return block.caption ?? '';
    case 'list':
    case 'steps':
      return block.items.join(' ');
    case 'code':
    case 'diagram':
      return block.caption ?? '';
    case 'note':
      return `${block.title ?? ''} ${block.text}`;
    case 'table':
      return [...block.headers, ...block.rows.flat()].join(' ');
    case 'example':
      return `${block.title} ${block.problem} ${block.solution.map(blockText).join(' ')}`;
    default:
      return '';
  }
}

export interface SearchDoc {
  slug: string;
  title: string;
  moduleId: string;
  moduleTitle: string;
  summary: string;
  /** Lowercased haystack for matching. */
  haystack: string;
}

let cachedIndex: SearchDoc[] | null = null;

export function searchIndex(): SearchDoc[] {
  if (cachedIndex) return cachedIndex;
  cachedIndex = flat.map(({ lesson, module }) => ({
    slug: lesson.slug,
    title: lesson.title,
    moduleId: module.id,
    moduleTitle: module.title,
    summary: lesson.summary,
    haystack: [
      lesson.title,
      lesson.summary,
      ...(lesson.objectives ?? []),
      ...lesson.blocks.map(blockText),
    ]
      .join(' ')
      .toLowerCase(),
  }));
  return cachedIndex;
}
