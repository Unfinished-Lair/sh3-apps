import type { Tool, JsonSchema } from '../catalog/types';
import type { RenderMode, SketchState } from './state';

interface MakeSketchToolsOptions {
  state: SketchState;
  /** Snapshot test — the tool reports `viewOpen` so the LLM knows whether
   *  to ask the user to open the view. Provided as a callback because
   *  `sh3.float.list()` can only be queried at call time. */
  isViewOpen: () => boolean;
}

export function makeSketchTools(opts: MakeSketchToolsOptions): Tool[] {
  const { state, isViewOpen } = opts;

  const inputSchema: JsonSchema = {
    type: 'object',
    properties: {
      html: {
        type: 'string',
        description: 'Raw HTML to render. Replaces any previous sketch.',
      },
      mode: {
        type: 'string',
        enum: ['inline', 'isolated'],
        description:
          "Render surface. 'inline' renders into a div under the host's " +
          'DOM and inherits SH3 styles; <style> blocks in your HTML are ' +
          'stripped to prevent host CSS pollution, so use SH3 host ' +
          "classes/CSS variables instead. 'isolated' renders into a " +
          'sandboxed iframe with scripts disabled and is the right pick ' +
          "if your sketch needs its own CSS. Defaults to 'inline'.",
      },
    },
    required: ['html'],
  };

  return [
    {
      name: 'ai.sketch.show',
      source: 'sh3-ai.tool',
      description:
        'Render an HTML composite into the AI Sketch view (single shared ' +
        'canvas you control; replaces any prior sketch). Use mode "inline" ' +
        'to inherit SH3 host styles when sketching SH3-themed UI; ' +
        '"isolated" for a sandboxed iframe with no host styles or scripts. ' +
        'The view does not auto-open: if viewOpen is false in the result, ' +
        'ask the user to run "AI Sketch: Open" from the command palette ' +
        '(or invoke the sh3-ai.sketch.open action tool).',
      inputSchema,
      async run(rawArgs) {
        const html = requireString(rawArgs, 'html');
        const mode = parseMode(rawArgs);
        state.set({ html, mode });
        return { ok: true, viewOpen: isViewOpen() };
      },
    },
  ];
}

function requireString(raw: unknown, key: string): string {
  if (raw && typeof raw === 'object' && key in raw) {
    const v = (raw as Record<string, unknown>)[key];
    if (typeof v === 'string' && v.length > 0) return v;
  }
  throw new Error(`missing or empty '${key}'`);
}

function parseMode(raw: unknown): RenderMode {
  if (raw && typeof raw === 'object' && 'mode' in raw) {
    const v = (raw as Record<string, unknown>).mode;
    if (v === undefined) return 'inline';
    if (v === 'inline' || v === 'isolated') return v;
    throw new Error(`'mode' must be 'inline' or 'isolated', got: ${String(v)}`);
  }
  return 'inline';
}
