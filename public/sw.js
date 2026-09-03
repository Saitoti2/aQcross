/**
 * aQross Service Worker v4
 *
 * Strategy: STATIC ASSETS ONLY — cache-first for images/fonts/icons.
 *
 * HTML navigations are intentionally NOT cached. Serving stale HTML
 * causes the page to load without the dark-mode class baked in by the
 * server, producing a theme flash that cannot be fixed client-side.
 * The network is fast enough for HTML on campus connections; the app
 * shell loads in < 1s even on 3G. Offline HTML falls back gracefully.
 *
 * Cache is versioned — bump CACHE to invalidate all stored assets.
 */

const CACHE = "aqross-assets-v4";

// Assets that are worth pre-caching at install time
const PRECACHE = [
  "/aQross logo-no bg.png",
  "/shops/aQross logo - Dark mode.png",
  "/favicon.png",
  "/og-image.png",
];

// ── Install ───────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: delete stale caches ────────────────────────────────
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

// ── Fetch ─────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only intercept same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip Vite dev-server internals (/@, /__vite, virtual:, etc.)
  if (url.pathname.startsWith("/@") || url.pathname.startsWith("/__")) return;

  // ── HTML navigations: ALWAYS network, never cache ─────────────
  // Serving stale HTML breaks SSR-set dark class and theme cookie.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("/offline.html").then(
          (cached) =>
            cached ||
            new Response(offlineFallback(), {
              headers: { "Content-Type": "text/html; charset=utf-8" },
            })
        )
      )
    );
    return;
  }

  // ── Static assets: cache-first ───────────────────────────────
  // Only true static files — not JS/CSS served by Vite with query strings
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|woff2?|ttf)$/) &&
      !url.search) {
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
  // All other requests (JS, CSS, API) — let fall through to network
});

// ── Offline fallback page ─────────────────────────────────────────
function offlineFallback() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>aQross — Offline</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{
      font-family:'Poppins',system-ui,sans-serif;
      background:#fff;color:#333;
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      min-height:100dvh;gap:24px;padding:24px;
    }
    img{height:88px;width:auto;object-fit:contain;animation:pulse 2s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.55}}
    p{color:#888;font-size:.875rem;text-align:center;max-width:280px}
    a{
      display:inline-block;background:#F4510B;color:#fff;
      padding:11px 28px;border-radius:14px;font-weight:600;
      font-size:.875rem;text-decoration:none;margin-top:4px;
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
