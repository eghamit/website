import katex from 'katex';

/**
 * Force every division to render as a **display-style** stacked fraction — a
 * full-size numerator over denominator with a proper fraction bar — even inside
 * inline math and table cells. Every fraction macro (`\frac`, `\tfrac`,
 * `\cfrac` and an already-`\dfrac`) is normalised to `\dfrac`.
 */
function bigFractions(tex: string): string {
  return tex.replace(/\\[dtc]?frac(?![a-zA-Z])/g, '\\dfrac');
}

/**
 * Force large operators and limit-taking operators to stack their bounds
 * **above and below** the symbol (as in displayed LaTeX) rather than trailing
 * them to the side, even in inline math. We insert `\limits` after each such
 * operator when it is not already present.
 */
function stackedLimits(tex: string): string {
  return tex.replace(
    /\\(sum|prod|coprod|bigcup|bigcap|bigsqcup|bigvee|bigwedge|bigodot|bigoplus|bigotimes|limsup|liminf|lim|argmax|argmin|max|min|sup|inf)(?![a-zA-Z])(?!\s*\\limits)/g,
    '\\$1\\limits',
  );
}

/**
 * Render a LaTeX string to an HTML string with KaTeX. Safe to call in server
 * components. `throwOnError: false` means a malformed formula shows in red
 * rather than crashing the page.
 */
export function renderMath(tex: string, displayMode: boolean): string {
  return katex.renderToString(stackedLimits(bigFractions(tex)), {
    displayMode,
    throwOnError: false,
    strict: false,
    output: 'html',
  });
}
