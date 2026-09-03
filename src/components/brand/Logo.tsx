import { Link } from "@tanstack/react-router";

interface LogoProps {
  className?: string;
  /** When true, renders the dark-mode variant of the logo (deprecated — auto-detected via CSS) */
  dark?: boolean;
}

export function Logo({ className = "h-9" }: LogoProps) {
  return (
    <Link to="/" aria-label="aQross home" className="inline-flex items-center">
      {/* Light mode logo — render as-is, dark text on white PNG */}
      <img
        src="/aQross logo-no bg.png"
        alt="aQross"
        fetchPriority="high"
        className={`${className} w-auto object-contain dark:hidden`}
      />
      {/*
       * Dark mode logo — white text on white PNG background.
       * mix-blend-mode: screen makes the white PNG background
       * transparent against a dark surface, while the white
       * letterforms and orange cart remain fully visible.
       */}
      <img
        src="/shops/aQross logo - Dark mode.png"
        alt="aQross"
        fetchPriority="high"
        className={`${className} w-auto object-contain [mix-blend-mode:screen] hidden dark:block`}
      />
    </Link>
  );
}
