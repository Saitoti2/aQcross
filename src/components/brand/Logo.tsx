import { Link } from "@tanstack/react-router";

export function Logo({ className = "h-9" }: { className?: string }) {
  return (
    <Link to="/" aria-label="aQross home" className="inline-flex items-center">
      <img
        src="/aQross logo-no bg.png"
        alt="aQross"
        fetchPriority="high"
        className={`${className} w-auto object-contain`}
      />
    </Link>
  );
}
