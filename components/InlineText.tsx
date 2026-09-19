import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import { renderMath } from '@/lib/math';

/**
 * Renders a text string with a tiny inline markup into React nodes:
 *   $math$   **bold**   *italic*   `code`   [label](href)
 *
 * Math spans are extracted to placeholders first, so emphasis (bold/italic) may
 * freely wrap inline math — e.g. `**Row $i$**` — without the markers splitting
 * across the math boundary. Placeholders are substituted back as rendered KaTeX
 * inside every text leaf.
 */
export function InlineText({ text }: { text: string }): ReactNode {
  const math: string[] = [];
  const withPlaceholders = text.replace(/\$([^$]+)\$/g, (_, tex: string) => {
    math.push(tex);
    return `${math.length - 1}`;
  });
  return <>{parseEmphasis(withPlaceholders, math)}</>;
}

const PLACEHOLDER = /(\d+)/g;

/** Turn a string that may contain math placeholders into text + KaTeX nodes. */
function subMath(str: string, math: string[], keyBase: string): ReactNode[] {
  const parts = str.split(PLACEHOLDER);
  const out: ReactNode[] = [];
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      const tex = math[Number(part)] ?? '';
      out.push(
        <span
          key={`${keyBase}m${i}`}
          dangerouslySetInnerHTML={{ __html: renderMath(tex, false) }}
        />,
      );
    } else if (part) {
      out.push(<Fragment key={`${keyBase}t${i}`}>{part}</Fragment>);
    }
  });
  return out;
}

// Matches **bold**, *italic*, `code`, or [label](href) — longest tokens first.
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;

function parseEmphasis(text: string, math: string[]): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  let key = 0;
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(...subMath(text.slice(last, m.index), math, `p${key}`));
    const token = m[0];
    key += 1;
    if (token.startsWith('**')) {
      out.push(<strong key={`b${key}`}>{subMath(token.slice(2, -2), math, `b${key}`)}</strong>);
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
          {subMath(label, math, `l${key}`)}
        </Link>,
      );
    } else {
      out.push(<em key={`i${key}`}>{subMath(token.slice(1, -1), math, `i${key}`)}</em>);
    }
    last = m.index + token.length;
  }
  if (last < text.length) out.push(...subMath(text.slice(last), math, `p${key}end`));
  return out;
}
