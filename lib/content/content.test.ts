import { describe, it, expect } from 'vitest';
import { modules, allLessons, getLesson, neighbors, searchIndex, totalLessons } from './index';
import type { Block } from './types';
import { renderMath } from '../math';

function everyBlock(blocks: Block[]): Block[] {
  const out: Block[] = [];
  for (const b of blocks) {
    out.push(b);
    if (b.type === 'example') out.push(...everyBlock(b.solution));
  }
  return out;
}

describe('content integrity', () => {
  it('has all modules in pedagogical order, each with lessons', () => {
    expect(modules.map((m) => m.id)).toEqual([
      'foundations',
      'supervised',
      'unsupervised',
      'perceptron',
      'mlp',
    ]);
    for (const m of modules) expect(m.lessons.length).toBeGreaterThan(0);
  });

  it('has globally unique lesson slugs', () => {
    const slugs = allLessons().map((f) => f.lesson.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every lesson has a summary and at least one content block', () => {
    for (const { lesson } of allLessons()) {
      expect(lesson.summary.length).toBeGreaterThan(0);
      expect(lesson.blocks.length).toBeGreaterThan(0);
    }
  });

  it('every lesson has a complete "At a glance" background card', () => {
    for (const { lesson } of allLessons()) {
      expect(lesson.intro, `intro missing for ${lesson.slug}`).toBeDefined();
      expect(lesson.intro!.definition.length).toBeGreaterThan(20);
      expect(lesson.intro!.whyItMatters.length).toBeGreaterThan(20);
      expect(lesson.intro!.whenToUse.length).toBeGreaterThan(0);
    }
  });

  it('has a solved example in most lessons', () => {
    const withExample = allLessons().filter(({ lesson }) =>
      lesson.blocks.some((b) => b.type === 'example'),
    );
    // Most lessons include a worked example; some purely conceptual ones
    // (e.g. "What is ML?", "The ML Workflow") legitimately do not.
    expect(withExample.length).toBeGreaterThanOrEqual(Math.ceil(totalLessons() * 0.75));
  });

  it('includes many figures across the course, all with known kinds', () => {
    const KNOWN = new Set([
      'neuron', 'mlp-2-2-1', 'sigmoid', 'tanh', 'relu', 'sigmoid-derivative',
      'gradient-descent', 'backprop-flow', 'linear-fit', 'knn', 'bias-variance',
      'fit-trio', 'kmeans', 'confusion-matrix', 'linearly-separable', 'xor',
      'distance-measures', 'pca', 'ml-taxonomy', 'ml-pipeline', 'design-matrix',
      'bayes-terms', 'gradient-descent-3d',
    ]);
    let count = 0;
    for (const { lesson } of allLessons()) {
      for (const block of everyBlock(lesson.blocks)) {
        if (block.type === 'diagram') {
          count += 1;
          expect(KNOWN.has(block.kind), `unknown diagram kind: ${block.kind}`).toBe(true);
        }
      }
    }
    expect(count).toBeGreaterThanOrEqual(15);
  });

  it('renders every LaTeX formula without KaTeX throwing', () => {
    for (const { lesson } of allLessons()) {
      for (const block of everyBlock(lesson.blocks)) {
        if (block.type === 'math') {
          const html = renderMath(block.tex, true);
          expect(html).toContain('katex');
          // A parse error renders a element with class "katex-error".
          expect(html).not.toContain('katex-error');
        }
      }
    }
  });
});

describe('navigation', () => {
  it('links prev/next in reading order', () => {
    const lessons = allLessons();
    const first = lessons[0]!.lesson.slug;
    const last = lessons[lessons.length - 1]!.lesson.slug;
    expect(neighbors(first).prev).toBeUndefined();
    expect(neighbors(first).next).toBeDefined();
    expect(neighbors(last).next).toBeUndefined();
  });

  it('resolves a known lesson and rejects an unknown one', () => {
    expect(getLesson('linear-regression')).toBeDefined();
    expect(getLesson('does-not-exist')).toBeUndefined();
  });
});

describe('search', () => {
  it('finds lessons by keyword', () => {
    const idx = searchIndex();
    const hit = idx.find((d) => d.haystack.includes('gradient descent'));
    expect(hit).toBeDefined();
    const backprop = idx.filter((d) => d.haystack.includes('backpropagation'));
    expect(backprop.length).toBeGreaterThan(0);
  });
});
