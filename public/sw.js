/**
 * aQross Service Worker
 * Strategy: Cache-first for the app shell.
 * Every navigation request gets the cached shell HTML instantly —
 * no browser loading UI, no blank screen, no network wait.
 */

const CACHE = "aqross-shell-v1";

// Assets to precache on install
const PRECACHE = [
  "/",
  "/aQross logo-no bg.png",
  "/favicon.png",
  "/3ce0b937-e727-4591-b5fa-8a8eac6f3d1b.png",
  "/og-image.svg",
];

// ── Install: cache the shell immediately ──────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: serve shell instantly for navigations ─────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only intercept same-origin requests
  if (url.origin !== self.location.origin) return;

  // For HTML navigation requests: serve cached shell, fall back to network
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match("/").then(
        (cached) =>
          cached ||
          fetch(request).catch(
            () =>
              new Response(offlineFallback(), {
                headers: { "Content-Type": "text/html; charset=utf-8" },
              })
          )
      )
    );
    return;
  }

  // For static assets: cache-first with network fallback
  if (
    url.pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|woff2?|ttf|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
  }
});

// ── Minimal offline fallback page ────────────────────────────────
function offlineFallback() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>aQross</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Poppins', system-ui, sans-serif;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100dvh;
      gap: 24px;
      padding: 24px;
    }
    img { height: 80px; width: auto; object-fit: contain; }
    p { color: #888; font-size: 0.875rem; text-align: center; }
    a {
      margin-top: 8px;
      display: inline-block;
      background: #F4510B;
      color: #fff;
      padding: 10px 24px;
      border-radius: 14px;
      font-weight: 600;
      font-size: 0.875rem;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <img src="/aQross logo-no bg.png" alt="aQross" />
  <p>You're offline. Check your connection and try again.</p>
  <a href="/">Retry</a>
</body>
</html>`;
}
