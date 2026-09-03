import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "../lib/cart";
import { LocationProvider } from "../lib/location";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Read the theme cookie on every SSR request so the server emits
  // the correct html class — eliminates any hydration mismatch.
  loader: () => ({}),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "aQross — Shop & Delivery for Students" },
      {
        name: "description",
        content:
          "aQross is a student-focused shopping & delivery platform. Order groceries, stationery, pharmaceuticals and more from verified local shops near your campus.",
      },
      { property: "og:title", content: "aQross — Shop & Delivery for Students" },
      {
        property: "og:description",
        content:
          "Order everyday essentials from verified local shops and get them delivered to your campus in 15–45 mins.",
      },
      { property: "og:url", content: "https://aqross.vercel.app" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "aQross" },
      { property: "og:image", content: "https://aqross.vercel.app/og-image.png" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "aQross — Shop & Delivery for Students" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "aQross — Shop & Delivery for Students" },
      {
        name: "twitter:description",
        content: "Groceries, stationery, pharmaceuticals and more, delivered to your campus.",
      },
      { name: "twitter:image", content: "https://aqross.vercel.app/og-image.png" },
      { name: "twitter:image:alt", content: "aQross — Shop & Delivery for Students" },
      { name: "theme-color", content: "#F4510B" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "canonical", href: "https://aqross.vercel.app" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning prevents React from warning/re-rendering when
    // the inline theme script adds "dark" to <html> before hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/*
         * THEME INIT — runs synchronously before any paint.
         * On first visit (no cookie yet): reads OS preference via matchMedia
         * and sets html.dark immediately.
         * On subsequent visits: the server already emitted the correct class
         * from the cookie, so this script is a fast no-op for returning users.
         * Also writes a cookie so the server can read it on the next request.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try {
    var k = 'aqross-theme';
    var stored = localStorage.getItem(k);
    var dark = stored === 'dark' || (stored === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    // Apply class (server may have already set it; this is idempotent)
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Write cookie so the server knows on the next request
    var cookieVal = dark ? 'dark' : 'light';
    document.cookie = k + '=' + cookieVal + ';path=/;max-age=31536000;SameSite=Lax';
    // Persist to localStorage too
    try { localStorage.setItem(k, cookieVal); } catch(_) {}
  } catch(e) {}
})();`,
          }}
        />
        {/*
         * Splash dark-mode overrides — parsed after the script above,
         * so html.dark is already correct when these rules apply.
         */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #aqross-splash { background: #ffffff; }
              html.dark #aqross-splash { background: #030712; }
              #aqross-splash-logo-light { display: block; }
              #aqross-splash-logo-dark  { display: none; }
              html.dark #aqross-splash-logo-light { display: none; }
              html.dark #aqross-splash-logo-dark  { display: block; }
            `,
          }}
        />
      </head>
      <body>
        {/*
         * Static HTML splash — rendered server-side so it appears
         * BEFORE any JS loads, on every load type (hard, soft, SW-cached).
         * React removes it in RootComponent once the app is ready.
         */}
        <div
          id="aqross-splash"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          {/* Light logo */}
          <img
            id="aqross-splash-logo-light"
            src="/aQross logo-no bg.png"
            alt="aQross"
            style={{ height: "96px", width: "auto", objectFit: "contain" }}
          />
          {/* Dark logo */}
          <img
            id="aqross-splash-logo-dark"
            src="/shops/aQross logo - Dark mode.png"
            alt="aQross"
            style={{ height: "96px", width: "auto", objectFit: "contain", mixBlendMode: "screen" }}
          />
          <p
            style={{
              fontFamily: "Poppins, system-ui, sans-serif",
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "rgba(244,81,11,0.7)",
              margin: 0,
            }}
          >
            Shop &amp; Deliver, Campus Fast
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  height: "8px",
                  width: "8px",
                  borderRadius: "50%",
                  background: "#F4510B",
                  opacity: 0.8,
                  animation: `_aq_bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          {/* Progress bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "33%",
                borderRadius: "9999px",
                background: "#F4510B",
                animation: "_aq_slide 1.4s ease-in-out infinite",
              }}
            />
          </div>
          <style>{`
            @keyframes _aq_bounce {
              0%,80%,100% { transform:translateY(0);   opacity:0.4; }
              40%          { transform:translateY(-8px); opacity:1;   }
            }
            @keyframes _aq_slide {
              0%   { transform:translateX(-100%); }
              50%  { transform:translateX(150%);  }
              100% { transform:translateX(350%);  }
            }
          `}</style>
        </div>

        {children}
        <Scripts />

        {/* Service worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .catch(function(e) { console.warn('SW registration failed:', e); });
  });
}
`,
          }}
        />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    // Remove the static HTML splash once React has mounted and is ready.
    // A small delay ensures the first paint is complete before hiding.
    const el = document.getElementById("aqross-splash");
    if (!el) return;
    const t = setTimeout(() => {
      el.style.transition = "opacity 0.3s ease";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 320);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <CartProvider>
          <Outlet />
          <Toaster richColors position="top-center" />
        </CartProvider>
      </LocationProvider>
    </QueryClientProvider>
  );
}
