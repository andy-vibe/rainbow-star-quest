/* Service worker: lets the game open with no internet after the first visit.
   Game files: it tries the network first (so new versions show up), but uses the saved copy when offline
   or when the network is too slow. The Axie pictures and icons never change, so the saved copy is used first. */
const CACHE = 'rainbow-star-quest-v5';
const ART_CACHE = 'rainbow-star-quest-art-v1';   // kept across game versions: change it only when the art files change
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/util.js', 'js/art.js', 'js/content.js', 'js/games.js', 'js/creative.js', 'js/movie.js', 'js/main.js',
  'axie/spine/spine-canvas.js', 'axie/axie.js', 'axie/pet.js', 'axie/names.js',
];
const ART = [
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  /* Axie pet and Chimera enemies */
  'axie/art/bear-mom/bear-mom.atlas.txt', 'axie/art/bear-mom/bear-mom.json',
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
const SLOW_MS = 3000;   // after this long without an answer from the network, use the saved copy

self.addEventListener('install', e => {
  e.waitUntil(Promise.all([
    caches.open(CACHE).then(c => c.addAll(FILES)),   // the game itself must be saved completely
    /* pictures one by one: a picture that fails to download must not stop offline play; it is saved when next shown */
    caches.open(ART_CACHE).then(c => Promise.all(ART.map(f => c.match(f).then(hit => hit || c.add(f).catch(() => {}))))),
  ]).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== ART_CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const saved = req => caches.match(req, { ignoreSearch: true });
const fetchAndSave = (req, cache) => fetch(req).then(res => {
  if (res.ok) { const copy = res.clone(); caches.open(cache).then(c => c.put(req, copy)); }
  return res;
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (/\/(axie\/art|icons)\//.test(url.pathname)) {
    e.respondWith(saved(req).then(hit => hit || fetchAndSave(req, ART_CACHE)));
    return;
  }
  const net = fetchAndSave(req, CACHE);
  const slow = new Promise(r => setTimeout(r, SLOW_MS)).then(() => saved(req)).then(hit => hit || net);
  e.respondWith(Promise.race([net, slow]).catch(() => saved(req).then(hit =>
    hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
});
