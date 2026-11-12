// Service Worker: macht die App offline nutzbar.
// Nach Änderungen an Dateien CACHE_VERSION erhöhen, damit alle Geräte die neue Version laden.
const CACHE_VERSION = "partyspiele-v1";

const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/app.css",
  "vendor/tailwind.css",
  "vendor/fonts/fonts.css",
  "vendor/fontawesome/css/all.min.css",
  "js/data-words.js",
  "js/data-questions.js",
  "js/data-quiz.js",
  "js/app.js",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "vendor/fonts/files/inter-latin-400-normal.woff2",
  "vendor/fonts/files/inter-latin-500-normal.woff2",
  "vendor/fonts/files/inter-latin-600-normal.woff2",
  "vendor/fonts/files/inter-latin-700-normal.woff2",
  "vendor/fonts/files/inter-latin-800-normal.woff2",
  "vendor/fonts/files/inter-latin-ext-400-normal.woff2",
  "vendor/fonts/files/inter-latin-ext-500-normal.woff2",
  "vendor/fonts/files/inter-latin-ext-600-normal.woff2",
  "vendor/fonts/files/inter-latin-ext-700-normal.woff2",
  "vendor/fonts/files/inter-latin-ext-800-normal.woff2",
  "vendor/fonts/files/jetbrains-mono-latin-500-normal.woff2",
  "vendor/fonts/files/jetbrains-mono-latin-700-normal.woff2",
  "vendor/fonts/files/jetbrains-mono-latin-ext-500-normal.woff2",
  "vendor/fonts/files/jetbrains-mono-latin-ext-700-normal.woff2",
  "vendor/fonts/files/syne-latin-700-normal.woff2",
  "vendor/fonts/files/syne-latin-800-normal.woff2",
  "vendor/fonts/files/syne-latin-ext-700-normal.woff2",
  "vendor/fonts/files/syne-latin-ext-800-normal.woff2",
  "vendor/fontawesome/webfonts/fa-brands-400.woff2",
  "vendor/fontawesome/webfonts/fa-regular-400.woff2",
  "vendor/fontawesome/webfonts/fa-solid-900.woff2",
  "vendor/fontawesome/webfonts/fa-v4compatibility.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Erst aus dem Cache antworten (schnell & offline), im Hintergrund aktualisieren
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_VERSION).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      const res = await network;
      if (res) return res;
      if (req.mode === "navigate") return cache.match("index.html");
      return new Response("", { status: 504, statusText: "Offline" });
    })
  );
});
