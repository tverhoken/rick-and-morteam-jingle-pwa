self.addEventListener('install', e => {
  let timeStamp = Date.now();
  e.waitUntil(
    caches.open('ramj').then(cache => {
      return cache.addAll([
        `/`,
        `/index.html?timestamp=${timeStamp}`,
        `/styles/main.css?timestamp=${timeStamp}`,
        `/scripts/main.js?timestamp=${timeStamp}`,
        `/sounds/ramj1.mp3?timestamp=${timeStamp}`
      ])
      .then(() => self.skipWaiting());
    })
  )
});

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});
