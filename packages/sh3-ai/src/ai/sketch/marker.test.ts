import { describe, it, expect } from 'vitest';
import {
  SH3_INLINE_MARKER,
  MARKER_SCAN_HEAD,
  detectMode,
  withMarker,
} from './marker';

describe('detectMode', () => {
  it('returns "isolated" for empty html', () => {
    expect(detectMode('')).toBe('isolated');
  });

  it('returns "isolated" when no marker is present', () => {
    expect(detectMode('<div>hello</div>')).toBe('isolated');
  });

  it('returns "inline" when the marker is at the head', () => {
    expect(detectMode(`${SH3_INLINE_MARKER}\n<div/>`)).toBe('inline');
  });

  it('treats any "sh3:inline" substring in the first scan window as inline', () => {
    expect(detectMode('<!-- sh3:inline -->\n<div/>')).toBe('inline');
  });

  it('returns "isolated" when the marker sits past the scan window', () => {
    const padding = 'x'.repeat(MARKER_SCAN_HEAD);
    expect(detectMode(`${padding}${SH3_INLINE_MARKER}`)).toBe('isolated');
  });
});

describe('withMarker', () => {
  it('returns the html unchanged in isolated mode', () => {
    expect(withMarker('<div/>', 'isolated')).toBe('<div/>');
  });

  it('prefixes the marker in inline mode when absent', () => {
    expect(withMarker('<div/>', 'inline')).toBe(`${SH3_INLINE_MARKER}\n<div/>`);
  });

  it('is idempotent in inline mode when the marker is already present', () => {
    const already = `${SH3_INLINE_MARKER}\n<div/>`;
    expect(withMarker(already, 'inline')).toBe(already);
  });
});
