/**
 * SplashScreen — intercepts every first paint.
 *
 * Design:
 *  • Pure white full-screen background
 *  • Neumorphic card centred on screen
 *  • Large logo at the top of the card
 *  • Floating basket image with a white veil (radial + linear gradient)
 *    that makes it "float" at the white boundary
 *  • Tagline + animated dot loader
 *  • Brand-orange progress bar that slides across the bottom of the card
 */
export function SplashScreen() {
  return (
    <div
      role="status"
      aria-label="Loading aQross"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
    >
      {/* ── Neumorphic card ─────────────────────────────────────── */}
      <div
        className="relative flex w-[min(88vw,420px)] flex-col items-center overflow-hidden rounded-[2.5rem] bg-white px-8 pb-8 pt-10"
        style={{
          boxShadow:
            "18px 18px 40px rgba(0,0,0,0.08), -18px -18px 40px rgba(255,255,255,0.95)",
        }}
      >
        {/* ── Logo ──────────────────────────────────────────────── */}
        <img
          src="/aQross logo-no bg.png"
          alt="aQross"
          fetchPriority="high"
          className="relative z-10 h-14 w-auto object-contain sm:h-16"
          style={{ animation: "splash-logo-in 0.55s cubic-bezier(0.22,1,0.36,1) both" }}
        />

        {/* ── Basket + veil ─────────────────────────────────────── */}
        <div
          className="relative mt-4 flex h-44 w-full items-center justify-center sm:h-52"
          aria-hidden="true"
        >
          {/* Ambient orange glow behind basket */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 50% 60%, rgba(244,81,11,0.13) 0%, transparent 70%)",
            }}
          />

          {/* Basket — floats up and down */}
          <img
            src="/3ce0b937-e727-4591-b5fa-8a8eac6f3d1b.png"
            alt=""
            className="relative z-10 h-36 w-auto object-contain sm:h-44"
            style={{ animation: "splash-float 3.2s ease-in-out infinite" }}
          />

          {/* Veil: white radial fade from bottom — makes basket dissolve into card */}
          <div
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 28%, rgba(255,255,255,0) 60%)",
            }}
          />
          {/* Side veil: keeps basket within card edges */}
          <div
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(255,255,255,0.95) 85%)",
            }}
          />
        </div>

        {/* ── Tagline ───────────────────────────────────────────── */}
        <p
          className="relative z-10 -mt-2 text-center text-sm font-semibold tracking-wide text-[#F4510B]"
          style={{ animation: "splash-fade-up 0.6s 0.3s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          Shop &amp; Deliver, Campus Fast
        </p>

        {/* ── Dot loader ────────────────────────────────────────── */}
        <div
          className="relative z-10 mt-5 flex items-center gap-2"
          aria-hidden="true"
          style={{ animation: "splash-fade-up 0.6s 0.45s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-[#F4510B]"
              style={{
                animation: `splash-bounce 1.1s ease-in-out ${i * 0.18}s infinite`,
              }}
            />
          ))}
        </div>

        {/* ── Progress bar ──────────────────────────────────────── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden rounded-b-[2.5rem]"
          aria-hidden="true"
        >
          <div
            className="h-full w-[40%] rounded-full bg-[#F4510B]"
            style={{ animation: "splash-progress 1.3s ease-in-out infinite" }}
          />
        </div>
      </div>

      {/* ── Keyframes ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes splash-float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes splash-bounce {
          0%, 80%, 100% { transform: translateY(0);    opacity: 0.35; }
          40%            { transform: translateY(-7px); opacity: 1;    }
        }
        @keyframes splash-progress {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes splash-logo-in {
          from { opacity: 0; transform: translateY(-12px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
        @keyframes splash-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}
