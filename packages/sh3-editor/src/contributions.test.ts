import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  EDITOR_DOCUMENT_POINT,
  type EditorDocumentSeed,
  type EditorDocumentContribution,
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
