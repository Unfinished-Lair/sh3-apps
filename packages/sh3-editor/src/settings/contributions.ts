/** Contribution point id for the universal settings view.
 *  Contributors register one SettingsDescriptor per app/shard. */
export const SETTINGS_POINT = 'sh3-editor.settings';

export interface SettingsDescriptor {
  /** Shard-prefixed; used as section key and for error scoping. */
  shardId: string;
  /** Header text rendered at the top of this contributor's section
   *  (shown only when more than one descriptor is registered). */
  label: string;
  /** Fields rendered top-to-bottom in array order. */
  schema: SettingsField[];
  /** Host calls on mount, after each edit, and whenever `subscribe` fires.
   *  Pure read — must not mutate. */
  getValues(): Record<string, unknown>;
  /** Host calls on user edit. Throw / reject with an Error to signal invalid input;
   *  the host displays `error.message` inline under the field and re-pulls values. */
  onEdit(key: string, value: unknown): void | Promise<void>;
  /** Optional — let the contributor notify the host that values changed
   *  outside the host's UI (e.g., a verb mutated state). Returns unsubscribe. */
  subscribe?(cb: () => void): () => void;
}

export type SettingsField =
  | BooleanField
  | StringField
  | NumberField
  | NumberRangeField
  | EnumField;

interface FieldBase {
  key: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface BooleanField     extends FieldBase { type: 'boolean'; }
export interface StringField      extends FieldBase { type: 'string';  placeholder?: string; }
export interface NumberField      extends FieldBase { type: 'number';  min?: number; max?: number; step?: number; unit?: string; }
export interface NumberRangeField extends FieldBase { type: 'number-range'; min: number; max: number; step?: number; unit?: string; }
export interface EnumField        extends FieldBase {
  type: 'enum';
  options: { value: string; label: string }[];
}
