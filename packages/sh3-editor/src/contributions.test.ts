import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  EDITOR_DOCUMENT_POINT,
  type EditorContentSeed,
  type EditorDocumentSeed,
  type EditorDocumentContribution,
  type EditorPathSeed,
  type PreviewLinkEvent,
} from './contributions';

describe('contributions module', () => {
  it('EDITOR_DOCUMENT_POINT is the documented string id', () => {
    expect(EDITOR_DOCUMENT_POINT).toBe('sh3-editor.document');
  });

  it('EditorDocumentContribution requires slotId and seed', () => {
    const minimal: EditorDocumentContribution = {
      slotId: 'x',
      seed: { kind: 'content', content: 'hello' },
    };
    expect(minimal.slotId).toBe('x');
    if (minimal.seed.kind === 'content') {
      expect(minimal.seed.content).toBe('hello');
    }
  });

  it('content seed accepts filePath / language', () => {
    expectTypeOf<EditorContentSeed>().toMatchTypeOf<{
      kind: 'content';
      content: string;
      filePath?: string | null;
      language?: string | null;
    }>();
  });

  it('path seed accepts initialContent / save', () => {
    expectTypeOf<EditorPathSeed>().toMatchTypeOf<{
      kind: 'path';
      path: string;
      initialContent?: string;
      save?: 'manual';
      language?: string | null;
    }>();
  });

  it('EditorDocumentSeed is a discriminated union on `kind`', () => {
    const a: EditorDocumentSeed = { kind: 'content', content: 'x' };
    const b: EditorDocumentSeed = { kind: 'path', path: 'doc.md' };
    expect(a.kind).toBe('content');
    expect(b.kind).toBe('path');
  });
});

describe('contributions module — preview additions (0.11.0)', () => {
  it('content seed accepts optional render and startInPreview', () => {
    const seed: EditorContentSeed = {
      kind: 'content',
      content: '# md',
      render: (t, _l) => `<custom>${t}</custom>`,
      startInPreview: true,
    };
    expect(typeof seed.render).toBe('function');
    expect(seed.startInPreview).toBe(true);
  });

  it('contribution accepts optional onLinkClick', () => {
    const contrib: EditorDocumentContribution = {
      slotId: 'x',
      seed: { kind: 'content', content: '' },
      onLinkClick(e) {
        return e.kind === 'external' ? 'handled' : 'default';
      },
    };
    expect(typeof contrib.onLinkClick).toBe('function');
  });

  it('PreviewLinkEvent has the documented shape', () => {
    const e: PreviewLinkEvent = {
      href: '#x',
      kind: 'anchor',
      event: {} as MouseEvent,
      slotId: 's',
    };
    expect(e.kind).toBe('anchor');
  });
});
