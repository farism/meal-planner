import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      svelte(),
      VitePWA({
        manifest: {
          theme_color: '#4cd64c',
          background_color: '#f5f5f5',
          display: 'standalone',
          scope: '/',
          name: 'My Meal Plan',
          short_name: 'My Meal Plan',
          description: 'Plan your meals',
          icons: [
            {
              src: 'pwa-192x192.png', // <== don't add slash, for testing
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png', // <== don't remove slash, for testing
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png', // <== don't add slash, for testing
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
  }
})
