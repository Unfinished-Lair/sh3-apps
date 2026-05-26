import type { NodeTemplate, GraphAssetPort } from '@unfinished-lair/sh3-editor/graph/types';
import { dataTypeFromJsonSchema, type DataType } from '../domain/data-types';
import { isPickerableVerb, buildPrefetchPorts, defaultPrefetchConfig } from './prefetch-template';

export interface VerbDescriptor {
  shardId: string;
  name: string;
  summary: string | undefined;
  schema?: { input?: unknown; output?: unknown };
}

function port(
  id: string,
  direction: 'input' | 'output',
  dataType: DataType,
  label?: string,
): GraphAssetPort {
  return { id, direction, dataType, label: label ?? id };
}

export function verbsToTemplates(verbs: ReadonlyArray<VerbDescriptor>): NodeTemplate[] {
  return verbs.map((v) => buildVerbTemplate(v));
}

function buildVerbTemplate(v: VerbDescriptor): NodeTemplate {
  const runtimePortBuild = buildRuntimePortBuild(v);
  const pickerable = isPickerableVerb(v);
  const template: NodeTemplate = {
    type: `verb:${v.shardId}:${v.name}`,
    category: 'Verbs',
    label: v.name,
    ports: runtimePortBuild.ports,
    defaultConfig: {
      mode: 'runtime',
      shardId: v.shardId,
      name: v.name,
      summary: v.summary ?? '',
      hasInputSchema: runtimePortBuild.hasInputSchema,
      outputPortIds: runtimePortBuild.outputPortIds,
    },
  };
  if (pickerable) {
    template.computePorts = (config) =>
      config?.mode === 'prefetch' ? buildPrefetchPorts(v) : runtimePortBuild.ports;
  }
  return template;
}

function buildRuntimePortBuild(v: VerbDescriptor): {
  ports: GraphAssetPort[];
  hasInputSchema: boolean;
  outputPortIds: string[] | null;
} {
  const { ports: inputPorts, hasInputSchema } = buildInputPorts(v);
  const { ports: outputPorts, outputPortIds } = buildOutputPorts(v);
  return {
    ports: [...inputPorts, ...outputPorts],
    hasInputSchema,
    outputPortIds,
  };
}

function buildInputPorts(v: VerbDescriptor): { ports: GraphAssetPort[]; hasInputSchema: boolean } {
  const ports: GraphAssetPort[] = [port('run-in', 'input', 'run', '')];
  const input = (v.schema?.input ?? null) as { type?: string; properties?: Record<string, unknown> } | null;
  if (input && input.type === 'object' && input.properties && typeof input.properties === 'object') {
    for (const [key, prop] of Object.entries(input.properties)) {
      ports.push(port(key, 'input', dataTypeFromJsonSchema(prop), key));
    }
    return { ports, hasInputSchema: true };
  }
  ports.push(port('args', 'input', 'string', 'args'));
  return { ports, hasInputSchema: false };
}

function buildOutputPorts(v: VerbDescriptor): { ports: GraphAssetPort[]; outputPortIds: string[] | null } {
  const ports: GraphAssetPort[] = [port('run-out', 'output', 'run', '')];
  const output = (v.schema?.output ?? null) as { type?: string; properties?: Record<string, unknown> } | null;

  if (output && output.type === 'object' && output.properties && typeof output.properties === 'object') {
    const ids: string[] = [];
    for (const [key, prop] of Object.entries(output.properties)) {
      ports.push(port(key, 'output', dataTypeFromJsonSchema(prop), key));
      ids.push(key);
    }
    return { ports, outputPortIds: ids };
  }
  if (output) {
    ports.push(port('value', 'output', dataTypeFromJsonSchema(output), 'value'));
    return { ports, outputPortIds: [] };
  }
  ports.push(port('result', 'output', 'unknown', 'result'));
  ports.push(port('stdout', 'output', 'string', 'stdout'));
  ports.push(port('stderr', 'output', 'string', 'stderr'));
  ports.push(port('scrollback', 'output', 'array', 'scrollback'));
  return { ports, outputPortIds: null };
}

// Re-export for any external callers of the removed buildPrefetchTemplate
// helper that needed the default config payload.
export { defaultPrefetchConfig };
