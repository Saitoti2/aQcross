/**
 * aQross Service Worker v3
 *
 * Navigation strategy: NETWORK-FIRST with cache fallback.
 *   - Every page load tries the network first so HTML is always fresh.
 *   - If offline, serves the cached shell.
 *   - This ensures the correct SplashScreen (no basket) is always shown.
 *
 * Static assets strategy: CACHE-FIRST (images, fonts, css, js).
 */

const CACHE = "aqross-shell-v3";   // ← bump this to bust all old caches

const PRECACHE = [
  "/",
  "/aQross logo-no bg.png",
  "/favicon.png",
  "/og-image.png",
];

// ── Install ───────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())   // activate immediately, don't wait
  );
});

// ── Activate: delete every cache that isn't the current version ───
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())  // take control of all open tabs now
  );
});

// ── Fetch ─────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only intercept same-origin requests
  if (url.origin !== self.location.origin) return;

  // ── HTML navigations: network-first ──────────────────────────
  // Always fetch fresh HTML so the app shell is never stale.
  // Falls back to cache only when truly offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the fresh shell for offline use
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put("/", clone));
          }
          return response;
        })
        .catch(() =>
          caches.match("/").then(
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
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|woff2?|ttf|css|js)$/)) {
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

// ── Offline fallback page ─────────────────────────────────────────
function offlineFallback() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>aQross</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{
      font-family:'Poppins',system-ui,sans-serif;
      background:#fff;
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
