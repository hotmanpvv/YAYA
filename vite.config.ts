import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Link previews (WhatsApp, iMessage, Instagram…) need absolute image URLs.
// On Vercel the production address is provided automatically during the build.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
const siteUrl = process.env.SITE_URL || (vercelUrl ? `https://${vercelUrl}/` : '/')

function siteUrlPlugin(): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`),
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), siteUrlPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
})
