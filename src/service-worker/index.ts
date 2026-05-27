import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

// API responses: NetworkFirst, fallback to cache, 24h expiry
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-v1',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxAgeSeconds: 24 * 60 * 60 })
    ]
  })
);

// Audio files: CacheFirst, large storage
registerRoute(
  ({ url }) => url.pathname.includes('/audio/'),
  new CacheFirst({
    cacheName: 'audio-v1',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 30 * 24 * 60 * 60 })
    ]
  })
);

// Covers/images: CacheFirst
registerRoute(
  ({ url }) => url.pathname.includes('/covers/'),
  new CacheFirst({
    cacheName: 'images-v1',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 })
    ]
  })
);

self.addEventListener('message', (event) => {
  if (event.data?.type === 'PRECACHE_AUDIO') {
    const urls: string[] = event.data.urls;
    event.waitUntil(
      Promise.all(
        urls.map((url) =>
          caches.open('audio-v1').then((cache) =>
            fetch(url).then((res) => {
              if (res.ok) cache.put(url, res.clone());
              return res;
            })
          )
        )
      )
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
