import type { DocPickerContribution } from '../contributions';

/** Module-level lister for DocPickerContribution providers. Bound by
 *  registerBuiltinWidgets when the editor activates (it has access to
 *  ctx.contributions there); cleared by the disposer. Tests inject a
 *  stub lister directly via setDocPickerLister. */
let lister: (() => DocPickerContribution[]) | null = null;

export function setDocPickerLister(fn: (() => DocPickerContribution[]) | null): void {
  lister = fn;
}

export function listDocPickerProviders(): DocPickerContribution[] {
  return lister?.() ?? [];
}
