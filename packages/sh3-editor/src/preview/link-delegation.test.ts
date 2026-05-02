import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { findClickedAnchor } from './link-delegation';

describe('findClickedAnchor', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });
  afterEach(() => {
    root.remove();
  });

  it('returns null when target is null', () => {
    expect(findClickedAnchor(null)).toBeNull();
  });

  it('returns null when click target is not inside an anchor', () => {
    const span = document.createElement('span');
    root.appendChild(span);
    expect(findClickedAnchor(span)).toBeNull();
  });

  it('returns the anchor when target IS the anchor', () => {
    const a = document.createElement('a');
    a.setAttribute('href', '/foo');
    root.appendChild(a);
    const result = findClickedAnchor(a);
    expect(result).not.toBeNull();
    expect(result!.anchor).toBe(a);
    expect(result!.href).toBe('/foo');
  });

  it('returns the anchor when target is a descendant of the anchor', () => {
    const a = document.createElement('a');
    a.setAttribute('href', 'https://example.com');
    const inner = document.createElement('em');
    a.appendChild(inner);
    root.appendChild(a);
    const result = findClickedAnchor(inner);
    expect(result!.anchor).toBe(a);
    expect(result!.href).toBe('https://example.com');
  });

  it('returns null for an anchor without href', () => {
    const a = document.createElement('a');
    root.appendChild(a);
    expect(findClickedAnchor(a)).toBeNull();
  });

  it('returns null for a non-Element target (e.g. text node)', () => {
    const text = document.createTextNode('plain');
    expect(findClickedAnchor(text)).toBeNull();
  });
});
