import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sh3CssInline, sh3Artifact } from 'sh3-core/build';

export default defineConfig({
  plugins: [
    svelte(),
    sh3CssInline(),
    sh3Artifact({
      serverEntry: 'dist/server/index.js',
      manifest: {
        description: 'Host and manage an SH3 package registry',
        author: 'SH3',
      },
    }),
  ],
  build: {
    lib: {
      entry: 'src/client/index.ts',
      formats: ['es'],
      fileName: 'sh3-registry',
    },
    outDir: 'dist/artifact',
    rollupOptions: {
      external: ['sh3-core', /^sh3-core\//, 'svelte', /^svelte\//],
    },
  },
});
