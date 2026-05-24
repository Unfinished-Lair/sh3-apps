import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['sh3-core', /^sh3-core\//, 'svelte', /^svelte\//],
    },
  },
  test: {
    include: [
      '**/*.{test,spec}.?(c|m)[jt]s?(x)',
      '**/*.{test,spec}.svelte.?(c|m)[jt]s?(x)',
    ],
    environmentMatchGlobs: [
      ['src/preview/**', 'jsdom'],
      ['src/inspector/widgets/**', 'jsdom'],
    ],
    setupFiles: ['src/__test__/setup-dom.ts'],
  },
});
