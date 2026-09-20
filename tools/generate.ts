/**
 * Static-site generator for Neuronode.
 *
 * Reads the typed content in lib/content, pre-renders every formula with KaTeX
 * and every figure to inline SVG, and writes a single browser bundle
 * (assets/content.js) consumed by the vanilla-JS single-page app in index.html.
 * Also copies KaTeX's stylesheet and fonts locally so the site works fully
 * offline from the file system.
 *
 * Run with:  npx tsx tools/generate.ts
 */
import { mkdirSync, writeFileSync, copyFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { modules, allLessons, neighbors, searchIndex, totalLessons } from '../lib/content/index';
import type { Block, Lesson, Module } from '../lib/content/types';
import { renderMath } from '../lib/math';
import { Diagram } from '../components/Diagram';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'assets');

// ---------------------------------------------------------------- helpers ---
function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const P_OPEN = '';
const P_CLOSE = '';

/** Text with placeholders → escaped text + inline KaTeX for each math span. */
function subMath(str: string, math: string[]): string {
  return str
    .split(new RegExp(`${P_OPEN}(\\d+)${P_CLOSE}`))
    .map((part, i) => (i % 2 === 1 ? renderMath(math[Number(part)] ?? '', false) : esc(part)))
    .join('');
}

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;

/** Render a content string with inline markup ($math$ **bold** *italic* `code` [l](h)). */
function inline(text: string): string {
  const math: string[] = [];
  const withP = String(text).replace(/\$([^$]+)\$/g, (_m, tex: string) => {
    math.push(tex);
    return `${P_OPEN}${math.length - 1}${P_CLOSE}`;
  });
  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(withP)) !== null) {
    out += subMath(withP.slice(last, m.index), math);
    const t = m[0];
    if (t.startsWith('**')) out += `<strong>${subMath(t.slice(2, -2), math)}</strong>`;
    else if (t.startsWith('`')) out += `<code class="inline-code">${esc(t.slice(1, -1))}</code>`;
    else if (t.startsWith('[')) {
      const label = t.slice(1, t.indexOf(']'));
      const href = t.slice(t.indexOf('(') + 1, -1);
      const to = href.startsWith('/learn/') ? `#${href}` : href;
      out += `<a href="${esc(to)}">${subMath(label, math)}</a>`;
    } else out += `<em>${subMath(t.slice(1, -1), math)}</em>`;
    last = m.index + t.length;
  }
  out += subMath(withP.slice(last), math);
  return out;
}

function headingId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** Approximate word count of a block tree, for reading-time estimates. */
function countWords(blocks: Block[]): number {
  let n = 0;
  const add = (s?: string) => {
    if (s) n += s.split(/\s+/).filter(Boolean).length;
  };
  for (const b of blocks) {
    switch (b.type) {
      case 'heading':
      case 'p':
        add(b.text);
        break;
      case 'list':
      case 'steps':
        b.items.forEach(add);
        break;
      case 'note':
        add(b.title);
        add(b.text);
        break;
      case 'table':
        b.headers.forEach(add);
        b.rows.forEach((r) => r.forEach(add));
        break;
      case 'example':
        add(b.title);
        add(b.problem);
        n += countWords(b.solution);
        break;
      default:
        break;
    }
  }
  return n;
}

// ---- diagrams: render each kind once to an SVG string ----------------------
const diagramCache = new Map<string, string>();
function diagramSvg(kind: string): string {
  if (diagramCache.has(kind)) return diagramCache.get(kind)!;
  const svg = renderToStaticMarkup(createElement(Diagram, { kind }));
  diagramCache.set(kind, svg);
  return svg;
}

const NOTE_ICON: Record<string, string> = {
  info: 'ℹ️',
  tip: '💡',
  warning: '⚠️',
  intuition: '✨',
};

// ---- block → HTML ----------------------------------------------------------
function renderBlock(b: Block): string {
  switch (b.type) {
    case 'heading': {
      const id = b.id ?? headingId(b.text);
      return `<h3 id="${esc(id)}"><a href="#${esc(id)}">${inline(b.text)}</a></h3>`;
    }
    case 'p':
      return `<p>${inline(b.text)}</p>`;
    case 'math':
      return `<figure class="mathblock"><div class="katex-wrap">${renderMath(b.tex, true)}</div>${
        b.caption ? `<figcaption>${inline(b.caption)}</figcaption>` : ''
      }</figure>`;
    case 'list': {
      const items = b.items.map((it) => `<li>${inline(it)}</li>`).join('');
      return b.ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
    }
    case 'steps':
      return `<ol class="steps">${b.items.map((it) => `<li><span class="step-n"></span><span>${inline(it)}</span></li>`).join('')}</ol>`;
    case 'note':
      return `<div class="note note-${b.variant ?? 'info'}"><div class="note-ico">${
        NOTE_ICON[b.variant ?? 'info']
      }</div><div class="note-main">${b.title ? `<p class="note-title">${esc(b.title)}</p>` : ''}<p>${inline(
        b.text,
      )}</p></div></div>`;
    case 'table': {
      const head = `<tr>${b.headers.map((h) => `<th>${inline(h)}</th>`).join('')}</tr>`;
      const body = b.rows
        .map((row) => `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
        .join('');
      return `<figure class="tablewrap"><table><thead>${head}</thead><tbody>${body}</tbody></table>${
        b.caption ? `<figcaption>${inline(b.caption)}</figcaption>` : ''
      }</figure>`;
    }
    case 'code':
      return `<figure><div class="code-wrap"><button class="copy-btn" type="button" aria-label="Copy code">Copy</button><pre class="code"><code>${esc(
        b.code,
      )}</code></pre></div>${b.caption ? `<figcaption>${inline(b.caption)}</figcaption>` : ''}</figure>`;
    case 'diagram':
      return `<figure class="diagram-fig"><div class="diagram">${diagramSvg(b.kind)}</div>${
        b.caption ? `<figcaption>${inline(b.caption)}</figcaption>` : ''
      }</figure>`;
    case 'example':
      return `<div class="example"><div class="example-head">🧪 Solved example: ${esc(b.title)}</div><div class="example-body"><p><strong>Problem.</strong> ${inline(
        b.problem,
      )}</p><button class="reveal-btn" type="button"><span class="reveal-show">🤔 Try it — then show solution</span><span class="reveal-hide">Hide solution</span></button><div class="reveal-body"><div class="solution"><p class="solution-label">Solution</p>${b.solution
        .map(renderBlock)
        .join('')}</div>${
        b.answer ? `<div class="answer">Answer:&nbsp;${inline(b.answer)}</div>` : ''
      }</div></div></div>`;
    default:
      return '';
  }
}

// ---- lesson page fragment --------------------------------------------------
function renderLesson(lesson: Lesson, mod: Module, index: number): string {
  const moduleTitle = mod.title;
  const moduleIcon = mod.icon;
  const intro = lesson.intro;
  const glance = intro
    ? `<div class="glance"><div class="glance-head">📖 At a glance</div><div class="glance-body">
        <div><p class="glance-label">Definition</p><p>${inline(intro.definition)}</p></div>
        <div class="glance-why"><p class="glance-label">Why it matters</p><p>${inline(intro.whyItMatters)}</p></div>
        <div class="use-grid">
          <div class="use-box"><p class="use-label">✓ When to use</p><ul>${intro.whenToUse
            .map((i) => `<li>${inline(i)}</li>`)
            .join('')}</ul></div>
          ${
            intro.whenNotToUse && intro.whenNotToUse.length
              ? `<div class="avoid-box"><p class="avoid-label">✕ When to avoid</p><ul>${intro.whenNotToUse
                  .map((i) => `<li>${inline(i)}</li>`)
                  .join('')}</ul></div>`
              : ''
          }
        </div></div></div>`
    : '';
  const objectives =
    lesson.objectives && lesson.objectives.length
      ? `<div class="objectives"><p class="obj-title">🎯 Learning objectives</p><ul>${lesson.objectives
          .map((o) => `<li>${esc(o)}</li>`)
          .join('')}</ul></div>`
      : '';

  const { prev, next } = neighbors(lesson.slug);
  const pager = `<nav class="pager">${
    prev
      ? `<a class="pager-card prev" href="#/learn/${prev.lesson.slug}"><span class="pager-dir">← Previous</span><span class="pager-name">${esc(
          prev.lesson.title,
        )}</span></a>`
      : '<span></span>'
  }${
    next
      ? `<a class="pager-card next" href="#/learn/${next.lesson.slug}"><span class="pager-dir">Next →</span><span class="pager-name">${esc(
          next.lesson.title,
        )}</span></a>`
      : ''
  }</nav>`;

  const readMin = Math.max(2, Math.round(countWords(lesson.blocks) / 190));
  const meta = `<div class="lesson-meta"><span class="chip-meta">⏱ ~${readMin} min read</span><span class="chip-meta">📘 Lesson ${
    index + 1
  } of ${totalLessons()}</span></div>`;

  return `<article class="lesson" data-module="${esc(mod.id)}" data-slug="${esc(lesson.slug)}">
    <nav class="breadcrumb"><a href="#/learn">Curriculum</a> <span class="sep">/</span> <span>${esc(moduleIcon)} ${esc(moduleTitle)}</span></nav>
    <p class="lesson-eyebrow"><span class="eyebrow-dot"></span>Lesson ${index + 1} · ${esc(moduleTitle)}</p>
    <h1 class="lesson-title">${esc(lesson.title)}</h1>
    <p class="lesson-summary">${esc(lesson.summary)}</p>
    ${meta}
    ${glance}
    ${objectives}
    <div class="lesson-body">${lesson.blocks.map(renderBlock).join('')}</div>
    <div class="complete-slot" id="completeSlot"></div>
    ${pager}
  </article>`;
}

// ---- home + curriculum -----------------------------------------------------
function renderHome(): string {
  const figureCount = 20;
  const cards = modules
    .map(
      (m, i) => `<a class="module-card" data-module="${esc(m.id)}" href="#/learn/${m.lessons[0]!.slug}">
        <span class="module-rail"></span>
        <div class="module-card-head"><span class="module-icon">${m.icon}</span>
          <div><p class="module-eyebrow">Module ${i + 1}</p><h3>${esc(m.title)}</h3></div></div>
        <p class="muted">${esc(m.description)}</p>
        <p class="module-count">${m.lessons.length} lessons <span class="arrow">→</span></p></a>`,
    )
    .join('');
  return `<section class="hero">
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="hero-inner">
        <span class="badge"><span class="badge-dot"></span> Free · offline · ${modules.length} modules</span>
        <h1 class="hero-title">Learn <span class="grad">Machine Learning</span><br />from first principles</h1>
        <p class="hero-sub">A complete, from-scratch course covering the <strong>theory</strong>, the <strong>mathematics</strong> behind every method, and <strong>solved examples</strong> — with figures throughout.</p>
        <div class="hero-cta"><a class="btn btn-lg" href="#/learn">Start learning →</a></div>
        <div class="stat-row">
          <div class="stat"><span class="stat-n" data-to="${modules.length}">${modules.length}</span><span class="stat-l">Modules</span></div>
          <div class="stat"><span class="stat-n" data-to="${totalLessons()}">${totalLessons()}</span><span class="stat-l">Lessons</span></div>
          <div class="stat"><span class="stat-n" data-to="${figureCount}" data-suffix="+">${figureCount}+</span><span class="stat-l">Figures</span></div>
          <div class="stat"><span class="stat-n" data-to="40" data-suffix="+">40+</span><span class="stat-l">Worked examples</span></div>
        </div>
      </div>
    </section>
    <section class="features">
      <div class="feature"><div class="feature-ic">📖</div><h3>Clear theory</h3><p class="muted">Plain-language explanations and intuition, built up step by step.</p></div>
      <div class="feature"><div class="feature-ic">➗</div><h3>The real mathematics</h3><p class="muted">Every equation, cost function and update rule — typeset with KaTeX.</p></div>
      <div class="feature"><div class="feature-ic">🧪</div><h3>Solved examples</h3><p class="muted">Worked numeric examples and figures you can reproduce by hand.</p></div>
    </section>
    <section class="home-modules"><div class="section-head"><h2 class="section-title">Your learning path</h2><p class="muted">Five modules, in order — from what a dataset is to backpropagation.</p></div><div class="modules-grid">${cards}</div></section>`;
}

function renderCurriculum(): string {
  let counter = 0;
  const sections = modules
    .map(
      (m, mi) => `<section class="curriculum-module" data-module="${esc(m.id)}">
        <button class="module-toggle curr-toggle" type="button" data-mod="${esc(m.id)}" aria-expanded="false">
          <span class="module-icon">${m.icon}</span>
          <span class="ct-main"><span class="ct-eyebrow">Module ${mi + 1}</span><span class="ct-title">${esc(m.title)}</span></span>
          <span class="ct-count">${m.lessons.length} lessons</span>
          <span class="nav-chev">›</span>
        </button>
        <p class="ct-desc muted">${esc(m.description)}</p>
        <ol class="lesson-grid">${m.lessons
          .map((l) => {
            counter += 1;
            return `<li><a href="#/learn/${l.slug}"><span class="num">${counter}</span><span><span class="ll-title">${esc(
              l.title,
            )}</span><span class="muted small">${esc(l.summary)}</span></span></a></li>`;
          })
          .join('')}</ol></section>`,
    )
    .join('');
  return `<div class="curriculum"><h1>Curriculum</h1><p class="muted">${modules.length} modules · ${totalLessons()} lessons · theory, mathematics and solved examples throughout.</p>${sections}</div>`;
}

// ---- build -----------------------------------------------------------------
function build() {
  mkdirSync(ASSETS, { recursive: true });

  const lessons: Record<string, unknown> = {};
  for (const { lesson, module, index } of allLessons()) {
    const nb = neighbors(lesson.slug);
    lessons[lesson.slug] = {
      title: lesson.title,
      summary: lesson.summary,
      moduleTitle: module.title,
      moduleId: module.id,
      prev: nb.prev ? nb.prev.lesson.slug : null,
      next: nb.next ? nb.next.lesson.slug : null,
      html: renderLesson(lesson, module, index),
    };
  }

  const nav = modules.map((m) => ({
    id: m.id,
    title: m.title,
    icon: m.icon,
    lessons: m.lessons.map((l) => ({ slug: l.slug, title: l.title })),
  }));

  const search = searchIndex().map((d) => ({
    slug: d.slug,
    title: d.title,
    moduleTitle: d.moduleTitle,
    summary: d.summary,
    haystack: d.haystack,
  }));

  const bundle = {
    modules: nav,
    lessons,
    search,
    home: renderHome(),
    curriculum: renderCurriculum(),
    counts: { modules: modules.length, lessons: totalLessons() },
  };

  writeFileSync(join(ASSETS, 'content.js'), `window.ML = ${JSON.stringify(bundle)};\n`, 'utf8');

  // Copy KaTeX css + fonts locally for offline math rendering.
  const katexSrc = join(ROOT, 'node_modules', 'katex', 'dist');
  const katexOut = join(ASSETS, 'katex');
  const fontsOut = join(katexOut, 'fonts');
  if (existsSync(katexOut)) rmSync(katexOut, { recursive: true, force: true });
  mkdirSync(fontsOut, { recursive: true });
  copyFileSync(join(katexSrc, 'katex.min.css'), join(katexOut, 'katex.min.css'));
  for (const f of readdirSync(join(katexSrc, 'fonts'))) {
    copyFileSync(join(katexSrc, 'fonts', f), join(fontsOut, f));
  }

  const kb = (JSON.stringify(bundle).length / 1024).toFixed(0);
  console.log(`Generated assets/content.js (${kb} KB), ${Object.keys(lessons).length} lessons, ${diagramCache.size} figures, KaTeX assets copied.`);
}

build();
