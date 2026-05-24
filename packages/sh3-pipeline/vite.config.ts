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
    environmentMatchGlobs: [
      ['src/shards/sh3-pipeline/views/**', 'jsdom'],
    ],
    setupFiles: ['src/__test__/setup-dom.ts'],
  },
});
