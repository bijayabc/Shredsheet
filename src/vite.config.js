import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['gym.svg', 'apple-touch-icon.png'],
      manifest: {
        id: "/",
        name: 'ShredSheet',
        short_name: 'ShredSheet',
        description: 'Your fitness tracker PWA!',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        screenshots: [
          {
            src: "screenshot-wide.png",
            sizes: "1918x1080",
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "screenshot-portrait.png",
            sizes: "1179x2556",
            type: "image/png"
          }
        ]
      }
    })
  ]
})
