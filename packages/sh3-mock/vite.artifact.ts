import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sh3CssInline, sh3Artifact } from 'sh3-core/build';

export default defineConfig({
  plugins: [svelte(), sh3CssInline(), sh3Artifact()],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'sh3-mock',
    },
    outDir: 'dist/artifact',
    rollupOptions: {
      external: ['sh3-core', /^sh3-core\//, 'svelte', /^svelte\//],
    },
  },
});
