import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// `base` must match the GitHub Pages path:
//   - project page (https://<user>.github.io/<repo>/): set BASE_PATH=/<repo>/
//   - user/org page or custom domain: leave as '/'
// The deploy workflow sets BASE_PATH; local dev uses '/'.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
