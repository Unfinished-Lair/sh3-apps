import { describe, it, expect } from 'vitest';
import { resolveRender } from './render-resolve';

describe('resolveRender', () => {
  it('returns the explicit render function when provided', () => {
    const custom = (t: string) => `<custom>${t}</custom>`;
    const fn = resolveRender({ render: custom, language: 'markdown' });
    expect(fn('hi', 'markdown')).toBe('<custom>hi</custom>');
  });

  it('uses bundled markdown when language === markdown and no explicit render', () => {
    const fn = resolveRender({ language: 'markdown' });
    const html = fn('# Hi', 'markdown');
    expect(html).toContain('<h1');
  });

  it('uses bundled markdown when language is null and filePath ends in .md', () => {
    const fn = resolveRender({ language: null, filePath: 'docs/foo.md' });
    const html = fn('# Hi', null);
    expect(html).toContain('<h1');
  });

  it('uses bundled markdown when language is undefined and filePath ends in .md', () => {
    const fn = resolveRender({ filePath: 'a.md' });
    const html = fn('# Hi', null);
    expect(html).toContain('<h1');
  });

  it('does NOT auto-detect markdown from filePath when language is non-null and non-markdown', () => {
    const fn = resolveRender({ language: 'plaintext', filePath: 'foo.md' });
    const html = fn('# Hi', 'plaintext');
    expect(html).toContain('<pre>');
    expect(html).toContain('# Hi');
  });

  it('falls back to escaped <pre> for unknown language and no .md path', () => {
    const fn = resolveRender({ language: 'rust' });
    const html = fn('let x = 1;', 'rust');
    expect(html).toContain('<pre>');
    expect(html).toContain('let x = 1;');
  });

  it('escapes HTML in the fallback <pre>', () => {
    const fn = resolveRender({});
    const html = fn('<script>x</script>', null);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('runs transform before the bundled markdown renderer', () => {
    const transform = (t: string) => t.replace(/\[\[(\w+)\|([^\]]+)\]\]/g, '[$2](wiki:$1)');
    const fn = resolveRender({ transform, language: 'markdown' });
    const html = fn('see [[abc|Foo]]', 'markdown');
    expect(html).toContain('href="wiki:abc"');
    expect(html).toContain('Foo');
    expect(html).not.toContain('[[');
  });

  it('runs transform before an explicit render', () => {
    const transform = (t: string) => `pre-${t}`;
    const render = (t: string) => `<x>${t}</x>`;
    const fn = resolveRender({ transform, render });
    expect(fn('hi', null)).toBe('<x>pre-hi</x>');
  });

  it('runs transform before the <pre> fallback', () => {
    const transform = (t: string) => t.toUpperCase();
    const fn = resolveRender({ transform, language: 'rust' });
    const html = fn('let x = 1;', 'rust');
    expect(html).toContain('LET X = 1;');
  });

  it('forwards the language argument to transform', () => {
    let seenLang: string | null | undefined;
    const transform = (t: string, lang: string | null) => {
      seenLang = lang;
      return t;
    };
    const fn = resolveRender({ transform, language: 'markdown' });
    fn('hi', 'markdown');
    expect(seenLang).toBe('markdown');
  });

  it('is a no-op when transform is undefined', () => {
    const fn = resolveRender({ language: 'markdown' });
    const html = fn('# Hi', 'markdown');
    expect(html).toContain('<h1');
  });
});
