import { renderMarkdownDefault } from './markdown';

export type RenderFn = (text: string, language: string | null) => string;
export type TransformFn = (text: string, language: string | null) => string;

export interface ResolveRenderInput {
  render?: RenderFn;
  /** Pre-render text→text hook. Runs before `render` (or the bundled
   *  markdown renderer, or the <pre> fallback). Lets contributors do small
   *  rewrites — wiki-link sugar, footnote stubs — without bundling their own
   *  markdown parser. */
  transform?: TransformFn;
  language?: string | null;
  filePath?: string | null;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const fallbackRender: RenderFn = (text) => `<pre>${escapeHtml(text)}</pre>`;

const markdownRender: RenderFn = (text) => renderMarkdownDefault(text);

function pickRender(input: ResolveRenderInput): RenderFn {
  if (input.render) return input.render;
  if (input.language === 'markdown') return markdownRender;
  if ((input.language == null) && typeof input.filePath === 'string' && input.filePath.endsWith('.md')) {
    return markdownRender;
  }
  return fallbackRender;
}

export function resolveRender(input: ResolveRenderInput): RenderFn {
  const inner = pickRender(input);
  const transform = input.transform;
  if (!transform) return inner;
  return (text, language) => inner(transform(text, language), language);
}
