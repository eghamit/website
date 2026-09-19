import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import { renderMath } from '@/lib/math';

/**
 * Renders a text string with a tiny inline markup into React nodes:
 *   $math$   **bold**   *italic*   `code`   [label](href)
 *
 * Parsing order: split out $…$ math first (its contents are never treated as
 * markup), then apply the emphasis/code/link rules to the remaining text.
 */
export function InlineText({ text }: { text: string }): ReactNode {
  return <>{parseMath(text)}</>;
}

function parseMath(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const parts = text.split('$');
  // Even indices are plain text; odd indices are inline math.
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      nodes.push(
        <span
          key={`m${i}`}
          // KaTeX output is trusted (we author all formulas).
          dangerouslySetInnerHTML={{ __html: renderMath(part, false) }}
        />,
      );
    } else if (part) {
      nodes.push(<Fragment key={`t${i}`}>{parseEmphasis(part)}</Fragment>);
    }
  });
  return nodes;
}

// Matches **bold**, *italic*, `code`, or [label](href) — longest tokens first.
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;

function parseEmphasis(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  let key = 0;
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const token = m[0];
    key += 1;
    if (token.startsWith('**')) {
      out.push(<strong key={`b${key}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      out.push(
        <code
          key={`c${key}`}
          className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.85em] text-brand-700 dark:bg-zinc-800 dark:text-brand-300"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith('[')) {
      const label = token.slice(1, token.indexOf(']'));
      const href = token.slice(token.indexOf('(') + 1, -1);
      out.push(
        <Link key={`l${key}`} href={href} className="text-brand-600 underline hover:text-brand-700">
          {label}
        </Link>,
      );
    } else {
      out.push(<em key={`i${key}`}>{token.slice(1, -1)}</em>);
    }
    last = m.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
