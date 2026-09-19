import type { Block } from '@/lib/content/types';
import { renderMath } from '@/lib/math';
import { InlineText } from './InlineText';
import { Diagram } from './Diagram';
import { Info, Lightbulb, AlertTriangle, Sparkles, FlaskConical } from 'lucide-react';

/** Slugify a heading into an anchor id. */
function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading': {
      const id = block.id ?? headingId(block.text);
      return (
        <h3 id={id} className="group mt-8 scroll-mt-24 text-lg font-bold tracking-tight sm:text-xl">
          <a href={`#${id}`} className="no-underline">
            {block.text}
          </a>
        </h3>
      );
    }
    case 'p':
      return (
        <p className="my-4 leading-7 text-[rgb(var(--text))]/90">
          <InlineText text={block.text} />
        </p>
      );
    case 'math':
      return (
        <figure className="my-5 overflow-x-auto">
          <div
            className="katex-display-wrap flex justify-center rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-900/60"
            dangerouslySetInnerHTML={{ __html: renderMath(block.tex, true) }}
          />
          {block.caption && (
            <figcaption className="mt-1.5 text-center text-xs text-muted">
              <InlineText text={block.caption} />
            </figcaption>
          )}
        </figure>
      );
    case 'list':
      return block.ordered ? (
        <ol className="my-4 ml-5 list-decimal space-y-1.5 leading-7 marker:text-muted">
          {block.items.map((it, i) => (
            <li key={i}>
              <InlineText text={it} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="my-4 ml-5 list-disc space-y-1.5 leading-7 marker:text-brand-400">
          {block.items.map((it, i) => (
            <li key={i}>
              <InlineText text={it} />
            </li>
          ))}
        </ul>
      );
    case 'steps':
      return (
        <ol className="my-4 space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="leading-7">
                <InlineText text={it} />
              </span>
            </li>
          ))}
        </ol>
      );
    case 'note':
      return <Note block={block} />;
    case 'diagram':
      return (
        <figure className="my-6">
          <div className="rounded-xl border border-app bg-zinc-50/60 px-4 py-5 dark:bg-zinc-900/40">
            <Diagram kind={block.kind} />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center text-xs text-muted">
              <InlineText text={block.caption} />
            </figcaption>
          )}
        </figure>
      );
    case 'code':
      return (
        <figure className="my-5">
          <pre className="overflow-x-auto rounded-xl border border-app bg-zinc-950 p-4 text-sm leading-6 text-zinc-100 dark:bg-black/60">
            <code className="font-mono">{block.code}</code>
          </pre>
          {block.caption && (
            <figcaption className="mt-1.5 text-xs text-muted">
              <InlineText text={block.caption} />
            </figcaption>
          )}
        </figure>
      );
    case 'table':
      return <Table block={block} />;
    case 'example':
      return <Example block={block} />;
    default:
      return null;
  }
}

const NOTE_STYLES = {
  info: { icon: Info, cls: 'border-brand-300 bg-brand-50 dark:border-brand-500/40 dark:bg-brand-500/10', ic: 'text-brand-600 dark:text-brand-300' },
  tip: { icon: Lightbulb, cls: 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10', ic: 'text-emerald-600 dark:text-emerald-300' },
  warning: { icon: AlertTriangle, cls: 'border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10', ic: 'text-amber-600 dark:text-amber-300' },
  intuition: { icon: Sparkles, cls: 'border-violet-300 bg-violet-50 dark:border-violet-500/40 dark:bg-violet-500/10', ic: 'text-violet-600 dark:text-violet-300' },
} as const;

function Note({ block }: { block: Extract<Block, { type: 'note' }> }) {
  const style = NOTE_STYLES[block.variant ?? 'info'];
  const Icon = style.icon;
  return (
    <div className={`my-5 flex gap-3 rounded-xl border p-4 ${style.cls}`}>
      <Icon size={20} className={`mt-0.5 shrink-0 ${style.ic}`} />
      <div className="min-w-0">
        {block.title && <p className="mb-0.5 font-semibold">{block.title}</p>}
        <p className="text-sm leading-6">
          <InlineText text={block.text} />
        </p>
      </div>
    </div>
  );
}

function Table({ block }: { block: Extract<Block, { type: 'table' }> }) {
  return (
    <figure className="my-5 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-app text-left">
            {block.headers.map((h, i) => (
              <th key={i} className="px-3 py-2 font-semibold">
                <InlineText text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} className="border-b border-app last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 align-top text-[rgb(var(--text))]/85">
                  <InlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {block.caption && (
        <figcaption className="mt-1.5 text-xs text-muted">
          <InlineText text={block.caption} />
        </figcaption>
      )}
    </figure>
  );
}

function Example({ block }: { block: Extract<Block, { type: 'example' }> }) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-app">
      <div className="flex items-center gap-2 border-b border-app bg-zinc-50 px-4 py-2.5 dark:bg-zinc-900/60">
        <FlaskConical size={16} className="text-brand-600 dark:text-brand-300" />
        <span className="text-sm font-semibold">Solved example: {block.title}</span>
      </div>
      <div className="px-4 py-3">
        <p className="my-2 leading-7">
          <span className="font-semibold">Problem. </span>
          <InlineText text={block.problem} />
        </p>
        <div className="mt-3 border-t border-dashed border-app pt-3">
          <p className="mb-1 text-sm font-semibold text-muted">Solution</p>
          <Blocks blocks={block.solution} />
        </div>
        {block.answer && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            Answer:&nbsp;<InlineText text={block.answer} />
          </div>
        )}
      </div>
    </div>
  );
}
