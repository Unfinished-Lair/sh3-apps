import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sh3CssInline, sh3Artifact } from 'sh3-core/build';

export default defineConfig({
  plugins: [svelte(), sh3CssInline(), sh3Artifact()],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'sh3-editor',
    },
    outDir: 'dist/artifact',
    rollupOptions: {
      // Match SH3's documented external surface (sh3-core/build): only
      // 'svelte' and 'svelte/internal/client' are guaranteed in the host's
      // import map. Bundle other svelte subpaths (e.g. svelte/reactivity)
      // — they're thin wrappers that still call into the externalized
      // svelte/internal/client reactivity primitives at runtime.
      external: ['sh3-core', /^sh3-core\//, 'svelte', 'svelte/internal/client'],
    },
  },
});
