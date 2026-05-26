import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from https://wes-l-eye.github.io/sagabuilder/
  // The base path must match the repo name so asset URLs resolve correctly.
  base: '/sagabuilder/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});
