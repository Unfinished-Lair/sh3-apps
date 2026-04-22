import type { SettingsField } from './contributions';
import type { FieldComponent } from './primitives';
import {
  BooleanField,
  StringField,
  NumberField,
  NumberRangeField,
  EnumField,
} from './primitives';

export const registry: Record<SettingsField['type'], FieldComponent> = {
  'boolean':      BooleanField      as FieldComponent,
  'string':       StringField       as FieldComponent,
  'number':       NumberField       as FieldComponent,
  'number-range': NumberRangeField  as FieldComponent,
  'enum':         EnumField         as FieldComponent,
};
