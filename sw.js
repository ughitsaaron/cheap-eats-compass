const filesToCache = [
  'dist/main.css',
  'dist/main.js',
  'index.html'
];

const cacheName = 'cache-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(filesToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request.url);
      })
  );
});

