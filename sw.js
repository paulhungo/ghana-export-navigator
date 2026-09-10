/* Ghana Agricultural Export Navigator — service worker (network-first with offline fallback) */
const CACHE = 'gen-v1';
const CORE = [
  './',
  './index.html',
  './admin.html',
  './manifest.webmanifest',
  './version.json',
  './assets/css/style.css',
  './assets/js/app.js',
  './assets/js/stages.js',
  './assets/js/tools.js',
  './data/agencies.json.js',
  './data/destinations.json.js',
  './data/updates.json.js',
  './data/products.json.js',
  './data/directory.json.js',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
  './assets/img/apple-touch-icon.png',
  './assets/img/favicon-32.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function(resp){
      var copy = resp.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
      return resp;
    }).catch(function(){
      return caches.match(e.request).then(function(hit){ return hit || caches.match('./index.html'); });
    })
  );
});
