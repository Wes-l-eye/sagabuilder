import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // CF_PAGES=1 is automatically set by Cloudflare Pages during its build.
  // Cloudflare serves from root (/), GitHub Pages serves from /sagabuilder/.
  base: process.env.CF_PAGES ? '/' : '/sagabuilder/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});
