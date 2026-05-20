import type { RenderMode } from './state';

/** Marker prepended to inline-mode sketches on save so loaders can recover
 *  the original mode when re-opening by path. Plain HTML comment — invisible
 *  in both render modes. */
export const SH3_INLINE_MARKER = '<!-- sh3:inline -->';

/** Detection scans the first N chars for `sh3:inline`. Cheap, no parsing. */
export const MARKER_SCAN_HEAD = 200;

export function detectMode(html: string): RenderMode {
  return html.slice(0, MARKER_SCAN_HEAD).includes('sh3:inline')
    ? 'inline'
    : 'isolated';
}

export function withMarker(html: string, mode: RenderMode): string {
  if (mode !== 'inline') return html;
  if (html.slice(0, MARKER_SCAN_HEAD).includes('sh3:inline')) return html;
  return `${SH3_INLINE_MARKER}\n${html}`;
}
