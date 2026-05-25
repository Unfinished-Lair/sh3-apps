import type { ShardContext } from 'sh3-core';
import {
  INSPECTOR_RENDERER_POINT,
  DOC_PICKER_POINT,
  type InspectorRenderer,
  type DocPickerContribution,
} from '../contributions';
// Widget components.
import StringWidget      from './StringWidget.svelte';
import TextWidget        from './TextWidget.svelte';
import NumberWidget      from './NumberWidget.svelte';
import SliderWidget      from './SliderWidget.svelte';
import RangeWidget       from './RangeWidget.svelte';
import SliderGroupWidget from './SliderGroupWidget.svelte';
import SegmentedWidget   from './SegmentedWidget.svelte';
import IconToggleWidget  from './IconToggleWidget.svelte';
import SelectWidget      from './SelectWidget.svelte';
import FileWidget        from './FileWidget.svelte';
import JsonWidget        from './JsonWidget.svelte';
import DocWidget         from './DocWidget.svelte';
import StringListWidget  from './StringListWidget.svelte';
import { setDocPickerLister } from './doc-picker-registry';

const BUILTINS: Array<Pick<InspectorRenderer, 'id' | 'type' | 'component'>> = [
  { id: 'sh3-editor:widget:string',       type: 'string',       component: StringWidget      as any },
  { id: 'sh3-editor:widget:text',         type: 'text',         component: TextWidget        as any },
  { id: 'sh3-editor:widget:number',       type: 'number',       component: NumberWidget      as any },
  { id: 'sh3-editor:widget:slider',       type: 'slider',       component: SliderWidget      as any },
  { id: 'sh3-editor:widget:range',        type: 'range',        component: RangeWidget       as any },
  { id: 'sh3-editor:widget:slider-group', type: 'slider-group', component: SliderGroupWidget as any },
  { id: 'sh3-editor:widget:segmented',    type: 'segmented',    component: SegmentedWidget   as any },
  { id: 'sh3-editor:widget:icon-toggle',  type: 'icon-toggle',  component: IconToggleWidget  as any },
  { id: 'sh3-editor:widget:select',       type: 'select',       component: SelectWidget      as any },
  { id: 'sh3-editor:widget:file',         type: 'file',         component: FileWidget        as any },
  { id: 'sh3-editor:widget:json',         type: 'json',         component: JsonWidget        as any },
  { id: 'sh3-editor:widget:doc',          type: 'doc',          component: DocWidget         as any },
  { id: 'sh3-editor:widget:string-list',  type: 'string-list',  component: StringListWidget  as any },
];

/** Registers all built-in widget renderers at priority 10 and wires the
 *  doc-picker lister from ctx.contributions. Returns a disposer that
 *  unregisters every contribution in reverse order and clears the lister. */
export function registerBuiltinWidgets(ctx: ShardContext): () => void {
  setDocPickerLister(() => ctx.contributions.list<DocPickerContribution>(DOC_PICKER_POINT));

  const disposers: Array<() => void> = [];
  for (const w of BUILTINS) {
    disposers.push(
      ctx.contributions.register<InspectorRenderer>(INSPECTOR_RENDERER_POINT, {
        ...w,
        priority: 10,
      }),
    );
  }
  return () => {
    for (let i = disposers.length - 1; i >= 0; i--) disposers[i]();
    setDocPickerLister(null);
  };
}
