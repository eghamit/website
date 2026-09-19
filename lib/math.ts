import katex from 'katex';

/**
 * Render a LaTeX string to an HTML string with KaTeX. Safe to call in server
 * components. `throwOnError: false` means a malformed formula shows in red
 * rather than crashing the page.
 */
export function renderMath(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    strict: false,
    output: 'html',
  });
}
