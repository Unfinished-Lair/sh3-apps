import type { Tool, JsonSchema } from '../catalog/types';
import type { DocsStore } from '../docs/store';
import { detectMode, withMarker } from './marker';
import type { RenderMode, SketchState } from './state';

export { SH3_INLINE_MARKER } from './marker';

interface MakeSketchToolsOptions {
  state: SketchState;
  store: DocsStore;
  /** Snapshot of the active provider id at catalog-build time. The save
   *  tool refuses without a provider; the show tool's path-load works
   *  regardless (cross-provider reads are allowed). */
  activeProviderId: string | null;
  /** Snapshot test — the show tool reports `viewOpen` so the LLM knows
   *  whether to ask the user to open the view. Provided as a callback
   *  because `sh3.float.list()` can only be queried at call time. */
  isViewOpen: () => boolean;
}

const SKETCH_DIR = 'sketches';
const NAME_RE = /^[a-zA-Z0-9._-]+$/;

export function makeSketchTools(opts: MakeSketchToolsOptions): Tool[] {
  const { state, store, activeProviderId, isViewOpen } = opts;

  const showSchema: JsonSchema = {
    type: 'object',
    properties: {
      html: {
        type: 'string',
        description:
          'Raw HTML to render. Mutually exclusive with `path`. Replaces ' +
          'any previous sketch.',
      },
      path: {
        type: 'string',
        description:
          "Path under the docs root to a saved sketch, e.g. " +
          "'gemini/sketches/foo.html'. Mutually exclusive with `html`. " +
          'When omitted, `mode` is auto-detected: HTML containing the ' +
          '`<!-- sh3:inline -->` marker renders inline; otherwise it ' +
          'falls back to isolated.',
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
          "if your sketch needs its own CSS. Defaults to 'inline' for " +
          '`html` calls; for `path` calls, defaults to the marker-detected ' +
          'mode and can be overridden here.',
      },
    },
  };

  const saveSchema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description:
          'Base filename (no extension). Letters, digits, dot, ' +
          'underscore, dash only. Saved under ' +
          (activeProviderId
            ? `'docs/${activeProviderId}/sketches/<name>.html'.`
            : "your provider's 'sketches/<name>.html' folder."),
      },
      overwrite: {
        type: 'boolean',
        description:
          'When true, overwrite an existing file with the same name. ' +
          'Defaults to false; the call rejects with `error: "exists"` if ' +
          'the file already exists.',
      },
    },
    required: ['name'],
  };

  return [
    {
      name: 'ai.sketch.show',
      source: 'sh3-ai.tool',
      description:
        'Render an HTML composite into the AI Sketch view (single shared ' +
        'canvas you control; replaces any prior sketch). Pass `html` for ' +
        'inline content, OR `path` to load a previously-saved sketch from ' +
        "the docs zone (e.g. 'gemini/sketches/foo.html'). Use mode " +
        '"inline" to inherit SH3 host styles when sketching SH3-themed ' +
        'UI; "isolated" for a sandboxed iframe with no host styles or ' +
        'scripts. When loading from `path`, mode is auto-detected from a ' +
        '`<!-- sh3:inline -->` marker — present ⇒ inline, absent ⇒ ' +
        'isolated; the explicit `mode` arg overrides detection. The view ' +
        'does not auto-open: if viewOpen is false in the result, ask the ' +
        'user to run "AI Sketch: Open" from the command palette (or ' +
        'invoke the sh3-ai:sketch.open action tool).',
      inputSchema: showSchema,
      async run(rawArgs) {
        const html = stringField(rawArgs, 'html');
        const path = stringField(rawArgs, 'path');
        if (html && path) {
          throw new Error("'html' and 'path' are mutually exclusive");
        }
        if (!html && !path) {
          throw new Error("one of 'html' or 'path' is required");
        }
        const explicitMode = parseModeOpt(rawArgs);
        if (path) {
          const content = await store.read(path);
          if (content === null) {
            return { error: 'not-found', path };
          }
          const mode = explicitMode ?? detectMode(content);
          state.set({ html: content, mode });
          return { ok: true, viewOpen: isViewOpen(), source: 'path', path, mode };
        }
        const mode = explicitMode ?? 'inline';
        state.set({ html: html!, mode });
        return { ok: true, viewOpen: isViewOpen(), source: 'html', mode };
      },
    },
    {
      name: 'ai.sketch.save',
      source: 'sh3-ai.tool',
      description: activeProviderId
        ? `Save the current AI Sketch canvas to 'docs/${activeProviderId}/` +
          "sketches/<name>.html'. Inline-mode sketches are prefixed with " +
          'a `<!-- sh3:inline -->` marker so ai.sketch.show can recover ' +
          'the mode on reload. Refuses when the canvas is empty. Pass ' +
          '`overwrite: true` to replace an existing file with the same ' +
          'name; otherwise returns `{ error: "exists" }`.'
        : 'Save the current AI Sketch canvas. Currently no provider is ' +
          'active, so this call will fail until one is set via ai:provider <id>.',
      inputSchema: saveSchema,
      async run(rawArgs) {
        if (!activeProviderId) {
          throw new Error(
            'ai.sketch.save: no active AI provider; run ai:provider <id> first',
          );
        }
        const snap = state.current;
        if (!snap) {
          return { error: 'empty', message: 'no sketch on the canvas to save' };
        }
        const name = requireString(rawArgs, 'name');
        if (!NAME_RE.test(name)) {
          throw new Error(
            "'name' may only contain letters, digits, dot, underscore, dash",
          );
        }
        const overwrite = boolField(rawArgs, 'overwrite') ?? false;
        const relPath = `${SKETCH_DIR}/${name}.html`;
        const absPath = `${activeProviderId}/${relPath}`;
        if (!overwrite) {
          const existing = await store.read(absPath);
          if (existing !== null) {
            return { error: 'exists', path: absPath };
          }
        }
        const body = withMarker(snap.html, snap.mode);
        await store.write(activeProviderId, relPath, body);
        return { ok: true, path: absPath, mode: snap.mode };
      },
    },
  ];
}

function stringField(raw: unknown, key: string): string | null {
  if (raw && typeof raw === 'object' && key in raw) {
    const v = (raw as Record<string, unknown>)[key];
    if (typeof v === 'string' && v.length > 0) return v;
  }
  return null;
}

function boolField(raw: unknown, key: string): boolean | null {
  if (raw && typeof raw === 'object' && key in raw) {
    const v = (raw as Record<string, unknown>)[key];
    if (typeof v === 'boolean') return v;
  }
  return null;
}

function requireString(raw: unknown, key: string): string {
  const v = stringField(raw, key);
  if (v === null) throw new Error(`missing or empty '${key}'`);
  return v;
}

function parseModeOpt(raw: unknown): RenderMode | null {
  if (raw && typeof raw === 'object' && 'mode' in raw) {
    const v = (raw as Record<string, unknown>).mode;
    if (v === undefined) return null;
    if (v === 'inline' || v === 'isolated') return v;
    throw new Error(`'mode' must be 'inline' or 'isolated', got: ${String(v)}`);
  }
  return null;
}
