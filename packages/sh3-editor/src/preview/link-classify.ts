export type LinkKind = 'anchor' | 'external' | 'internal';

const SCHEME_RE = /^[a-z][a-z0-9+.\-]*:/i;

export function classifyLink(href: string): LinkKind {
  if (href.startsWith('#')) return 'anchor';
  if (SCHEME_RE.test(href)) return 'external';
  return 'internal';
}
