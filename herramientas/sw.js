// Service Worker del Editor de Pluma Libre.
// Scope: /herramientas/ (queda separado del SW del sitio público en /sw.js).
// Estrategia network-first con fallback a cache, igual que el SW principal,
// para que las notas nuevas y el historial reflejen siempre el estado del repo
// cuando hay conexión, y el editor siga abriendo offline si se cae la red.

const CACHE_VERSION = 'pl-editor-v1';
const SHELL = [
  '/herramientas/editor.html',
  '/herramientas/manifest.webmanifest',
  '/assets/favicon-192x192.png',
  '/assets/icon-512.png',
  '/assets/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // El editor habla con la API de GitHub vía fetch desde la página, no acá
  // (ese tráfico es cross-origin y el filtro de arriba ya lo descarta). Lo que
  // sí cacheamos son los recursos locales del editor.
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('/herramientas/editor.html')))
  );
});
