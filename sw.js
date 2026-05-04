// Service Worker de Pluma Libre — estrategia network-first con fallback a cache.
// El objetivo es que las notas nuevas siempre lleguen cuando hay conexión, pero la
// app igual abra (con la versión cacheada de la última visita) si el usuario está
// offline. Subir CACHE_VERSION fuerza purga del cache viejo en la siguiente activación.

const CACHE_VERSION = 'pl-v1';
const SHELL = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.webmanifest',
  '/assets/logo-simbolo.png',
  '/assets/logo-wordmark.png',
  '/assets/favicon-192x192.png',
  '/assets/icon-512.png'
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

  // Solo cacheamos requests de mismo origen — evita meter en cache fonts.googleapis,
  // GA, Formspree, etc., que tienen sus propias cabeceras de cache y no aportan
  // a la experiencia offline del sitio.
  if (url.origin !== self.location.origin) return;

  // banners.json siempre fresh: tiene cache:no-store en el fetch original, pero
  // por si acaso, lo dejamos pasar sin cachear.
  if (url.pathname === '/banners.json') return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        // Solo cacheamos respuestas OK; los 404/500 no contaminan el cache.
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('/index.html')))
  );
});
