/* Service worker: lets the game open with no internet after the first visit.
   It tries the network first (so new versions show up), and uses the saved copy when offline. */
const CACHE = 'rainbow-star-quest-v3';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/util.js', 'js/art.js', 'js/content.js', 'js/games.js', 'js/creative.js', 'js/movie.js', 'js/main.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  /* Axie pet and Chimera enemies */
  'axie/spine/spine-canvas.js', 'axie/axie.js', 'axie/pet.js',
  'axie/names.js', 'axie/art/bear-mom/bear-mom.atlas.txt', 'axie/art/bear-mom/bear-mom.json',
  'axie/art/bear-mom/bear-mom.png', 'axie/art/bing/bing.atlas.txt', 'axie/art/bing/bing.json',
  'axie/art/bing/bing.png', 'axie/art/buba/buba.atlas.txt', 'axie/art/buba/buba.json',
  'axie/art/buba/buba.png', 'axie/art/puffy/03-puffy-aquatic.atlas.txt', 'axie/art/puffy/03-puffy-aquatic.json',
  'axie/art/puffy/03-puffy-aquatic.png', 'axie/art/slime/slime.atlas.txt', 'axie/art/slime/slime.json',
  'axie/art/slime/slime.png', 'axie/art/treant-flowering/treant-flowering.atlas.txt', 'axie/art/treant-flowering/treant-flowering.json',
  'axie/art/treant-flowering/treant-flowering.png', 'axie/art/treant/treant.atlas.txt', 'axie/art/treant/treant.json',
  'axie/art/treant/treant.png', 'axie/art/wolf-aquatic/wolf-aquatic.atlas.txt', 'axie/art/wolf-aquatic/wolf-aquatic.json',
  'axie/art/wolf-aquatic/wolf-aquatic.png', 'axie/art/wolf-gray/wolf-gray.atlas.txt', 'axie/art/wolf-gray/wolf-gray.json',
  'axie/art/wolf-gray/wolf-gray.png', 'axie/art/xia/xia.atlas.txt', 'axie/art/xia/xia.json',
  'axie/art/xia/xia.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html')))
  );
});
