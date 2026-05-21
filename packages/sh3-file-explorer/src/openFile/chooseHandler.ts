import { sh3 } from 'sh3-core';
import OpenWithModal from './OpenWithModal.svelte';

export function chooseHandler(labels: string[]): Promise<string | null> {
  return new Promise((resolve) => {
    let settled = false;
    const settle = (value: string | null) => {
      if (settled) return;
      settled = true;
      handle.close();
      resolve(value);
    };
    const handle = sh3.modal.open(
      OpenWithModal,
      {
        labels,
        onPick: (label: string) => settle(label),
        onCancel: () => settle(null),
      },
      { dismissOnBackdrop: true },
    );
  });
}
