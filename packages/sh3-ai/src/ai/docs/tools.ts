import type { Tool, JsonSchema } from '../catalog/types';
import type { DocsStore } from './store';

interface MakeDocToolsOptions {
  store: DocsStore;
  /** Snapshot of the active provider id at catalog-build time. Embedded
   *  into each tool description so the LLM sees its own folder name
   *  without having to ask. Pass `null` if no provider is currently
   *  selected — write/delete will refuse, and descriptions reflect it. */
  activeProviderId: string | null;
}

/** Build the four built-in `ai.docs.*` tools. Names use three segments
 *  (`ai.docs.<op>`) to avoid colliding with verbs registered as
 *  `ai.<bare>`. Read-only and everything scopes are extended in
 *  `scope/builtins.ts` to cover them. */
export function makeDocTools(opts: MakeDocToolsOptions): Tool[] {
  const { store, activeProviderId } = opts;

  // The ownership phrase appears in every description; pre-render it so
  // the LLM never has to guess and we don't sprinkle conditionals.
  const ownershipLine = activeProviderId
    ? `You are running as the '${activeProviderId}' AI provider; your own folder is 'docs/${activeProviderId}/'.`
    : `No AI provider is currently active; ai.docs.write and ai.docs.delete will fail until one is set via ai:provider <id>.`;

  const listSchema: JsonSchema = {
    type: 'object',
    properties: {
      provider: {
        type: 'string',
        description:
          "Optional provider id to filter to (e.g. 'gemini'). Omit to list across all providers.",
      },
    },
  };

  const readSchema: JsonSchema = {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description:
          "Path under the docs root, including the provider folder, e.g. 'gemini/notes.md'.",
      },
    },
    required: ['path'],
  };

  const writeSchema: JsonSchema = {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: activeProviderId
          ? `Path RELATIVE to your own provider folder ('${activeProviderId}/'). e.g. 'notes.md' lands at 'docs/${activeProviderId}/notes.md'. Subdirs are allowed; '..' segments are rejected.`
          : "Path RELATIVE to your own provider folder. Currently no provider is active, so this call will fail.",
      },
      content: {
        type: 'string',
        description: 'Full file content. Existing files are overwritten.',
      },
    },
    required: ['path', 'content'],
  };

  const deleteSchema: JsonSchema = {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: activeProviderId
          ? `Path under the docs root. Must start with '${activeProviderId}/'; cross-provider deletes are refused.`
          : "Path under the docs root. Currently no provider is active, so this call will fail.",
      },
    },
    required: ['path'],
  };

  return [
    {
      name: 'ai.docs.list',
      description:
        `List AI-managed documents. ${ownershipLine} Cross-provider listing is allowed. Returns entries with absolute paths under the docs root, e.g. 'gemini/notes.md'.`,
      inputSchema: listSchema,
      source: 'sh3-ai.tool',
      async run(rawArgs) {
        const provider = stringField(rawArgs, 'provider');
        return store.list(provider ?? undefined);
      },
    },
    {
      name: 'ai.docs.read',
      description:
        `Read an AI-managed document. ${ownershipLine} Cross-provider reads are allowed: pass any path under the docs root, e.g. 'deepseek/notes.md'. Returns { content } or { error: "not-found" }.`,
      inputSchema: readSchema,
      source: 'sh3-ai.tool',
      async run(rawArgs) {
        const path = requireString(rawArgs, 'path');
        const content = await store.read(path);
        if (content === null) return { error: 'not-found', path };
        return { content };
      },
    },
    {
      name: 'ai.docs.write',
      description: activeProviderId
        ? `Write an AI-managed document into your own folder. ${ownershipLine} The path argument is RELATIVE to that folder; do NOT prefix it with '${activeProviderId}/'. Existing files are overwritten.`
        : `Write an AI-managed document. ${ownershipLine}`,
      inputSchema: writeSchema,
      source: 'sh3-ai.tool',
      async run(rawArgs) {
        if (!activeProviderId) {
          throw new Error(
            'ai.docs.write: no active AI provider; run ai:provider <id> first',
          );
        }
        const path = requireString(rawArgs, 'path');
        const content = requireString(rawArgs, 'content');
        await store.write(activeProviderId, path, content);
        return { ok: true, path: `${activeProviderId}/${path}` };
      },
    },
    {
      name: 'ai.docs.delete',
      description: activeProviderId
        ? `Delete an AI-managed document inside your own folder. ${ownershipLine} The path is absolute under the docs root and must start with '${activeProviderId}/'.`
        : `Delete an AI-managed document. ${ownershipLine}`,
      inputSchema: deleteSchema,
      source: 'sh3-ai.tool',
      async run(rawArgs) {
        if (!activeProviderId) {
          throw new Error(
            'ai.docs.delete: no active AI provider; run ai:provider <id> first',
          );
        }
        const path = requireString(rawArgs, 'path');
        await store.delete(activeProviderId, path);
        return { ok: true };
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

function requireString(raw: unknown, key: string): string {
  const v = stringField(raw, key);
  if (v === null) throw new Error(`missing or empty '${key}'`);
  return v;
}
