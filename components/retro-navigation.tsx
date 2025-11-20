"use client";

import Link from "next/link";

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
  return (
    <header className="border-b-4 border-border bg-background px-4 py-4 text-foreground shadow-[0_8px_0_var(--border)]">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="retro text-xs uppercase tracking-[0.5em]"
        >
          FYKE&apos;S LABORATORY
        </Link>

        <NavigationMenu
          viewport={false}
          className="justify-start text-[0.65rem] uppercase tracking-[0.2em] text-foreground [&_[data-slot=navigation-menu-trigger]]:rounded-none"
        >
          <NavigationMenuList className="gap-4">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.label}>
                <NavigationMenuLink asChild className="retro">
                  <Link
                    href={link.href}
                    className={cn(
                      "inline-flex items-center px-2 py-1 text-foreground transition hover:text-primary",
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
    </header>
  );
}

export default RetroNavigation;

