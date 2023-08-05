const CACHE_NAME = "push-notification-v0"
const assets = [
    "/",
    "/index.html",
    "/app.js",
    // "/resources/js/bootstrap4/offcanvas.js",
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            cache.addAll(assets);
        })
    )
});

self.addEventListener("push", (event) => {
    const payload = event.data?.text() ?? "no payload";
    event.waitUntil(
        self.registration.showNotification("ServiceWorker Cookbook", {
            body: payload,
        }),
    );
});

// self.addEventListener("fetch", fetchEvent => {
//     fetchEvent.respondWith(
//         caches.match(fetchEvent.request).then(res => {
//             return res || fetch(fetchEvent.request)
//         })
//     )
// })

// Cache Strategy
// https://blog.bitsrc.io/5-service-worker-caching-strategies-for-your-next-pwa-app-58539f156f52

// Cache First, then Network - Strategy
// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.open(CACHE_NAME)
//             .then(function(cache) {
//                 cache.match(event.request)
//                     .then( function(cacheResponse) {
//                         if(cacheResponse)
//                             return cacheResponse
//                         else
//                             return fetch(event.request)
//                                 .then(function(networkResponse) {
//                                     cache.put(event.request, networkResponse.clone())
//                                     return networkResponse
//                                 })
//                     })
//             })
//     )
// });

// Network First, then Cache - Strategy
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request);
        })
    )
})

// Cache Only - Strategy
// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.open(cacheName).then(function(cache) {
//             cache.match(event.request).then(function(cacheResponse) {
//                 return cacheResponse;
//             })
//         })
//     )
// })

// Network Only - Strategy
// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         fetch(event.request).then(function(networkResponse) {
//             return networkResponse
//         })
//     )
// })

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    // CODELAB: Remove previous cached data from disk.
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});