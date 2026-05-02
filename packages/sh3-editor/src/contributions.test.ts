import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  EDITOR_DOCUMENT_POINT,
  type EditorDocumentSeed,
  type EditorDocumentContribution,
  type PreviewLinkEvent,
} from './contributions';

describe('contributions module', () => {
  it('EDITOR_DOCUMENT_POINT is the documented string id', () => {
    expect(EDITOR_DOCUMENT_POINT).toBe('sh3-editor.document');
  });

  it('EditorDocumentContribution requires slotId and seed; bind/handlers are optional', () => {
    const minimal: EditorDocumentContribution = {
      slotId: 'x',
      seed: { content: 'hello' },
    };
    expect(minimal.slotId).toBe('x');
    expect(minimal.seed.content).toBe('hello');
  });

  it('seed mirrors OpenDocumentOptions field set', () => {
    expectTypeOf<EditorDocumentSeed>().toMatchTypeOf<{
      content: string;
      filePath?: string | null;
      language?: string | null;
    }>();
  });
});

describe('contributions module — preview additions (0.11.0)', () => {
  it('seed accepts optional render and startInPreview', () => {
    const seed: EditorDocumentSeed = {
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
      seed: { content: '' },
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
