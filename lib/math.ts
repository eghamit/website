import katex from 'katex';

/**
 * Force every fraction to render in **display style** — a full-size stacked
 * numerator over denominator with a proper fraction bar — even inside inline
 * math and table cells. `\frac` → `\dfrac` (this never touches `\dfrac`,
 * `\tfrac` or `\cfrac`, since in those the char before "frac" is not a
 * backslash).
 */
function bigFractions(tex: string): string {
  return tex.replace(/\\frac(?![a-zA-Z])/g, '\\dfrac');
}

/**
 * Render a LaTeX string to an HTML string with KaTeX. Safe to call in server
 * components. `throwOnError: false` means a malformed formula shows in red
 * rather than crashing the page.
 */
export function renderMath(tex: string, displayMode: boolean): string {
  return katex.renderToString(bigFractions(tex), {
    displayMode,
    throwOnError: false,
    strict: false,
    output: 'html',
  });
}
