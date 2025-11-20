"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/8bit/navigation-menu";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Plans", href: "/plans" },
];

const themeTokens = {
  light: { background: "#F5F5F5", foreground: "#121212" },
  dark: { background: "#121212", foreground: "#F5F5F5" },
} as const;

type ThemeMode = keyof typeof themeTokens;

export function RetroNavigation() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
  }, [theme]);

  const palette = themeTokens[theme];

  return (
    <header
      className="border-b-4 border-black px-4 py-4 shadow-[0_8px_0_#000] dark:border-white dark:shadow-[0_8px_0_#f5f5f5]"
      style={{ background: palette.background, color: palette.foreground }}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="retro text-xs uppercase tracking-[0.5em]"
          style={{ color: palette.foreground }}
        >
          FYKE&apos;S LABORATORY
        </Link>

        <NavigationMenu
          viewport={false}
          className="justify-start text-xs [&_[data-slot=navigation-menu-trigger]]:rounded-none"
        >
          <NavigationMenuList className="gap-3">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.label}>
                <NavigationMenuLink asChild className="retro">
                  <Link
                    href={link.href}
                    className={cn(
                      "inline-flex items-center border-4 border-black px-5 py-2 uppercase tracking-widest transition hover:-translate-y-1 hover:bg-black hover:text-white",
                      "dark:border-white dark:hover:bg-white dark:hover:text-black"
                    )}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <Button
          type="button"
          font="retro"
          variant="default"
          onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
          className="border-4 border-black bg-transparent px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
        >
          {theme === "light" ? "Switch to Dark" : "Switch to Light"}
        </Button>
      </div>
    </header>
  );
}

export default RetroNavigation;

