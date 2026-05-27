import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['client/**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-v1',
              expiration: { maxAgeSeconds: 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /\/audio\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-v1',
              expiration: { maxEntries: 30, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      },
      manifest: {
        name: 'EnglishPod Kids',
        short_name: 'EP Kids',
        description: '儿童英语听力每日推荐',
        theme_color: '#7c3aed',
        background_color: '#faf5ff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
});
