import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/branding/aqross-logo.png.asset.json";

export function Logo({ className = "h-9" }: { className?: string }) {
  return (
    <Link to="/" aria-label="aQross home" className="inline-flex items-center">
      <img
        src={logoAsset.url}
        alt="aQross"
        className={`${className} w-auto object-contain`}
        width={1024}
        height={545}
      />
    </Link>
  );
}
