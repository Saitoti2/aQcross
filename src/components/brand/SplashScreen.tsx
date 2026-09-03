/**
 * SplashScreen — shown while the app is loading.
 * White background, centred logo with a soft pulsing animation,
 * and a branded progress bar along the bottom.
 */
export function SplashScreen() {
  return (
    <div
      role="status"
      aria-label="Loading aQross"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-[#030712]"
    >
      {/* Logo mark — light/dark variants */}
      <div className="flex flex-col items-center gap-6">
        <img
          src="/aQross logo-no bg.png"
          alt="aQross"
          fetchPriority="high"
          className="h-20 w-auto animate-pulse object-contain sm:h-28 dark:hidden"
        />
        <img
          src="/shops/aQross logo - Dark mode.png"
          alt="aQross"
          fetchPriority="high"
          className="h-20 w-auto animate-pulse object-contain [mix-blend-mode:screen] sm:h-28 hidden dark:block"
        />

        {/* Tagline */}
        <p className="text-sm font-semibold tracking-wide text-[#F4510B]/70 sm:text-base">
          Shop &amp; Deliver, Campus Fast
        </p>

        {/* Dot loader */}
        <div className="flex items-center gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-[#F4510B] opacity-80"
              style={{
                animation: `splash-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Branded bar at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
        <div
          className="h-full w-1/3 rounded-full bg-[#F4510B]"
          style={{ animation: "splash-slide 1.4s ease-in-out infinite" }}
          aria-hidden="true"
        />
      </div>

      <style>{`
        @keyframes splash-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes splash-slide {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(150%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
