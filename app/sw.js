self.addEventListener('install', e => {
  const timestamp = Date.now()
  e.waitUntil(
    caches.open('ramj').then(cache => { 
      return cache.addAll([
        '/',
        `/index.html?timestamp=${timestamp}`,
        `/index.css?timestamp=${timestamp}`,
        `/index.js?timestamp=${timestamp}`,
        `/images/my-man.gif?timestamp=${timestamp}`,
        `/images/my-man.png?timestamp=${timestamp}`,
        `/sounds/my-man.mp3?timestamp=${timestamp}`,
        `/images/pickle-rick.gif?timestamp=${timestamp}`,
        `/images/pickle-rick.png?timestamp=${timestamp}`,
        `/sounds/pickle-rick.mp3?timestamp=${timestamp}`,
        `/images/yes.gif?timestamp=${timestamp}`,
        `/images/yes.png?timestamp=${timestamp}`,
        `/sounds/yes.mp3?timestamp=${timestamp}`])
     }).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(res => res || fetch(e.request)))
})