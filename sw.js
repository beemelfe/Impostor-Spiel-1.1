// Service Worker: macht die App offline nutzbar.
// Nach Änderungen an Dateien CACHE_VERSION erhöhen, damit alle Geräte die neue Version laden.
const CACHE_VERSION = "partyspiele-v3";

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
  "icons/logo-96.png",
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

// Online: immer zuerst die aktuelle Version aus dem Netz laden (so passen HTML, CSS und
// JavaScript garantiert zusammen) und den Cache dabei auffrischen.
// Offline oder bei sehr langsamer Verbindung: gespeicherte Version aus dem Cache nehmen.
const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const fromNetwork = fetch(req, { cache: "no-cache" }).then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    });
    try {
      return await Promise.race([
        fromNetwork,
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), NETWORK_TIMEOUT_MS))
      ]);
    } catch (err) {
      const cached = await cache.match(req, { ignoreSearch: true });
      if (cached) return cached;
      if (req.mode === "navigate") {
        const shell = await cache.match("index.html");
        if (shell) return shell;
      }
      try {
        return await fromNetwork;
      } catch (e) {
        return new Response("", { status: 504, statusText: "Offline" });
      }
    }
  })());
});
