/**
 * Content model for the ML learning site.
 *
 * A {@link Lesson} is an ordered list of {@link Block}s. Blocks are a small,
 * closed set of primitives (prose, display math, lists, notes, worked examples,
 * tables) that the renderer knows how to draw. Authoring content as data — rather
 * than free-form MDX — keeps every lesson type-checked, searchable and uniform.
 *
 * Inline formatting inside any text string supports a tiny markup:
 *   **bold**   *italic*   `code`   $inline math$   [label](href)
 * Display math uses the dedicated `math` block.
 */

export type Block =
  | { type: 'heading'; text: string; id?: string }
  | { type: 'p'; text: string }
  | { type: 'math'; tex: string; caption?: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'note'; variant?: 'info' | 'tip' | 'warning' | 'intuition'; title?: string; text: string }
  | { type: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { type: 'steps'; items: string[] }
  | {
      type: 'example';
      title: string;
      problem: string;
      /** Worked solution as its own mini-document. */
      solution: Block[];
      answer?: string;
    };

export interface Lesson {
  slug: string;
  title: string;
  /** One-line description used in cards, search and meta tags. */
  summary: string;
  /** Learning objectives shown at the top of the lesson. */
  objectives?: string[];
  blocks: Block[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  /** Emoji or short glyph used in navigation. */
  icon: string;
  lessons: Lesson[];
}

export interface LessonRef {
  slug: string;
  title: string;
  moduleId: string;
  moduleTitle: string;
}
