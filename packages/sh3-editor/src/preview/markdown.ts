import { Marked } from 'marked';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const DANGEROUS_SCHEME_RE = /^\s*(javascript|vbscript|data):/i;

function sanitizeUrl(href: string | null | undefined): string {
  if (!href) return '';
  if (DANGEROUS_SCHEME_RE.test(href)) return '#';
  return href;
}

const m = new Marked({ gfm: true, breaks: false });

m.use({
  renderer: {
    html(token: any): string {
      const raw = typeof token === 'string' ? token : (token?.text ?? token?.raw ?? '');
      return escapeHtml(raw);
    },
    link(this: any, token: any): string {
      const safeHref = sanitizeUrl(token.href);
      const titleAttr = token.title ? ` title="${escapeHtml(token.title)}"` : '';
      const text = (this.parser?.parseInline ? this.parser.parseInline(token.tokens) : escapeHtml(token.text ?? '')) as string;
      return `<a href="${safeHref}"${titleAttr}>${text}</a>`;
    },
  },
});

export function renderMarkdownDefault(text: string): string {
  if (!text) return '';
  let html = m.parse(text) as string;
  html = html.replace(/<h([1-6])>(.+?)<\/h\1>/g, (_match, level, inner) => {
    const plain = inner.replace(/<[^>]+>/g, '');
    return `<h${level} id="${slugify(plain)}">${inner}</h${level}>`;
  });
  return html;
}
