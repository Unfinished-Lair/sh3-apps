import { describe, it, expect } from 'vitest';
import { renderMarkdownDefault } from './markdown';

describe('renderMarkdownDefault', () => {
  it('renders headings', () => {
    const html = renderMarkdownDefault('# Hello');
    expect(html).toContain('<h1');
    expect(html).toContain('Hello</h1>');
  });

  it('gives headings a slug id so anchor links resolve', () => {
    const html = renderMarkdownDefault('## My Section\n\n[jump](#my-section)');
    expect(html).toMatch(/id="my-section"/);
    expect(html).toContain('href="#my-section"');
  });

  it('renders inline links with href intact', () => {
    const html = renderMarkdownDefault('[click](./setup.md)');
    expect(html).toContain('href="./setup.md"');
  });

  it('renders code blocks with language class and escaped content', () => {
    const html = renderMarkdownDefault('```ts\nconst x = 1;\n```');
    expect(html).toContain('language-ts');
    expect(html).toContain('const x = 1;');
  });

  it('escapes raw HTML by default (no script pass-through)', () => {
    const html = renderMarkdownDefault('<script>alert(1)</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('strips javascript: hrefs', () => {
    const html = renderMarkdownDefault('[click](javascript:alert(1))');
    expect(html).not.toMatch(/href="javascript:/i);
  });

  it('renders bullet lists', () => {
    const html = renderMarkdownDefault('- one\n- two');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>one</li>');
  });

  it('handles empty input', () => {
    expect(renderMarkdownDefault('')).toBe('');
  });
});
