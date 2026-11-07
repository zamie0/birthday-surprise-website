import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base: './' makes the build work from any folder or sub-path
// (Netlify, Vercel, GitHub Pages, or just opening it from a static host).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
