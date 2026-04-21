import type { Component } from 'svelte';
import type { InspectorRendererProps } from '../types';

export { type InspectorMeta, type InspectorApi, type InspectorRendererProps } from '../types';

/** Contribution point id for inspector renderers. Contributors register via
 *  `ctx.contributions.register<InspectorRenderer>(INSPECTOR_RENDERER_POINT, { ... })`. */
export const INSPECTOR_RENDERER_POINT = 'sh3-editor.inspectorRenderer';

/** Shape of a contribution registered under INSPECTOR_RENDERER_POINT.
 *  Dispatch is exact-match on `type`; ties break by priority (higher wins)
 *  then by registration order (first wins). */
export interface InspectorRenderer {
  /** Stable, shard-prefixed id (e.g. 'sh3-chat:chat-message'). Uniqueness is the provider's concern. */
  id: string;
  /** The type tag this renderer claims. Matched against meta.type > value.__type. */
  type: string;
  /** Svelte 5 component accepting InspectorRendererProps. */
  component: Component<InspectorRendererProps>;
  /** Higher wins on ties. Convention: contributions >= 10. Default 10. */
  priority?: number;
}
