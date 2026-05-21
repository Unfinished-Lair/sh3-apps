import { sh3 } from 'sh3-core';
import PromptModal from './PromptModal.svelte';

export function promptText(title: string, initial = ''): Promise<string | null> {
  return new Promise((resolve) => {
    let settled = false;
    const settle = (value: string | null) => {
      if (settled) return;
      settled = true;
      handle.close();
      resolve(value);
    };
    const handle = sh3.modal.open(
      PromptModal,
      {
        title,
        initial,
        onConfirm: (v: string) => settle(v),
        onCancel: () => settle(null),
      },
      { dismissOnBackdrop: false },
    );
  });
}
