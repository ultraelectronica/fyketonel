"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

type ThemeChoice = "light" | "dark";

const labels: Record<ThemeChoice, string> = {
  light: "Light Mode",
  dark: "Dark Mode",
};

export function RetroModeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const activeTheme = useMemo<ThemeChoice>(() => {
    const current = (resolvedTheme ?? theme) as ThemeChoice | undefined;
    return current === "dark" ? "dark" : "light";
  }, [theme, resolvedTheme]);

  const nextTheme: ThemeChoice = activeTheme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      aria-label={`Switch to ${labels[nextTheme]}`}
      className="retro inline-flex size-12 items-center justify-center border-4 border-border bg-primary text-lg text-primary-foreground shadow-[4px_4px_0_var(--border)] transition hover:-translate-y-1 hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring focus-visible:ring-ring disabled:opacity-60"
      onClick={() => setTheme(nextTheme)}
      disabled={!mounted}
    >
      <span className="sr-only">
        {mounted ? labels[nextTheme] : "Toggle color mode"}
      </span>
      <span aria-hidden="true">
        {mounted && activeTheme === "light" ? "☾" : "☼"}
      </span>
    </button>
  );
}

export default RetroModeSwitcher;
