import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'sh3-core',
        /^sh3-core\//,
        'sh3-file-explorer',
        /^sh3-file-explorer\//,
        'svelte',
        /^svelte\//,
      ],
    },
  },
});
