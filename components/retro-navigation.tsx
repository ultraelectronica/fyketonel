"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GithubIcon } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/8bit/navigation-menu";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Plans", href: "/plans" },
];

export function RetroNavigation() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStars() {
      try {
        const response = await fetch("https://api.github.com/repos/heimin22/fyketonel");
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled) {
          setStars(typeof data?.stargazers_count === "number" ? data.stargazers_count : null);
        }
      } catch {
        // silently ignore
      }
    }

    fetchStars();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="border-b-2 border-border bg-background px-6 py-6 text-foreground shadow-[0_4px_0_var(--border)] md:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-4">
        <div className="flex min-w-[180px] flex-1 justify-start">
          <Link
            href="/"
            className="retro text-base uppercase tracking-[0.3em]"
          >
            FYKE&apos;S LAB
          </Link>
        </div>

        <div className="flex flex-[2] items-center justify-center">
          <NavigationMenu
            viewport={false}
            className="text-base tracking-tight text-foreground [&_[data-slot=navigation-menu-trigger]]:rounded-none"
          >
            <NavigationMenuList className="gap-6">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink asChild className="retro">
                    <Link
                      href={link.href}
                      className={cn(
                        "inline-flex items-center px-2 py-1 transition hover:text-primary",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                      )}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex min-w-[180px] flex-1 justify-end">
          <a
            href="https://github.com/heimin22/fyketonel"
            target="_blank"
            rel="noopener noreferrer"
            className="retro inline-flex items-center gap-2 text-base tracking-tight transition hover:text-primary"
            aria-label="View the project on GitHub"
          >
            <GithubIcon className="size-5" />
            <span>{stars !== null ? `${stars}★` : "GitHub"}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export default RetroNavigation;

