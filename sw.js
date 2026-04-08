// Lightweight service worker for caching critical assets (improves repeat visits)
const CACHE_NAME = 'anniv-shell-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/scripts/app-loader.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => { if (k !== CACHE_NAME) return caches.delete(k); return null; })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Always try network first for navigation requests to serve fresh content.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return res;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For other requests, try cache first, then network as fallback.
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((res) => {
      // Optionally cache same-origin requests (small assets)
      if (url.origin === location.origin && event.request.method === 'GET') {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
      }
      return res;
    })).catch(() => {
      // Last resort: try to serve index.html for navigations, or nothing
      if (event.request.destination === 'document') return caches.match('/index.html');
      return new Response('', { status: 404, statusText: 'offline' });
    })
  );
});
