const CACHE_NAME = 'calculadora-pro-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
  // Si agregas las imágenes de los íconos, puedes sumarlas aquí:
  // './icon-192x192.png',
  // './icon-512x512.png'
];

// Instalación del Service Worker y guardado en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en caché correctamente');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones para responder cuando no hay internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el archivo está en el caché, lo devuelve
        if (response) {
          return response;
        }
        // Si no está, hace la petición a la red
        return fetch(event.request);
      })
  );
});

// Actualizar el caché si cambias la versión de la app
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});