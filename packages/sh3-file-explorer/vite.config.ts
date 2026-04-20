import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        contributions: 'src/contributions.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['sh3-core', /^sh3-core\//, 'svelte', /^svelte\//],
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
