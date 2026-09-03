import { useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "aqross-theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
    document.cookie = `${STORAGE_KEY}=${theme};path=/;max-age=31536000;SameSite=Lax`;
  } catch (_) {}
}

export function useTheme() {
  /**
   * Initialize from "light" to match SSR output — no hydration mismatch.
   * The inline script in __root.tsx sets html.dark before first paint, so
   * CSS-based dark: classes (Logo, theme toggle icons) are always correct
   * without needing JS state. This hook is only needed for the toggle action.
   */
  const [theme, setTheme] = useState<Theme>("light");

  const toggle = () => {
    // Read current state from DOM (set by the inline script) rather than
    // relying on React state which initialises as "light" for SSR safety.
    const current: Theme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    const next: Theme = current === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  return { theme, toggle };
}
