import type { Component } from 'svelte';
import type { SettingsField } from '../contributions';

export interface FieldProps<F extends SettingsField = SettingsField> {
  field: F;
  value: unknown;
  error?: string;
  onEdit: (value: unknown) => void;
}

export type FieldComponent = Component<FieldProps>;

export { default as Section }           from './Section.svelte';
export { default as SettingsRow }       from './SettingsRow.svelte';
export { default as BooleanField }      from './BooleanField.svelte';
export { default as StringField }       from './StringField.svelte';
export { default as NumberField }       from './NumberField.svelte';
export { default as NumberRangeField }  from './NumberRangeField.svelte';
export { default as EnumField }         from './EnumField.svelte';
