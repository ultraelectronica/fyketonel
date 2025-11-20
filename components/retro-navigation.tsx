"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GithubIcon, Menu, X } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/8bit/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/8bit/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Plans", href: "/plans" },
];

export function RetroNavigation() {
  const [stars, setStars] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile menu on window resize if screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="border-b-2 border-border bg-background px-4 py-4 text-foreground shadow-[0_4px_0_var(--border)] md:px-8 md:py-6">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex min-w-[180px] flex-1 justify-start">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/logo.png"
                alt="Fyke's Lab"
                width={200}
                height={100}
                className="h-auto w-auto max-h-10 md:max-h-14"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center justify-center md:flex">
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

          {/* Desktop GitHub Link */}
          <div className="hidden min-w-[180px] flex-1 justify-end md:flex">
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

          {/* Mobile Hamburger Button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 top-[70px] z-40 bg-background/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="fixed right-0 top-[70px] z-50 h-[calc(100vh-70px)] w-1/2 bg-background border-l-4 border-border shadow-[-8px_0_0_var(--border)] md:hidden overflow-y-auto">
            <nav className="flex flex-col gap-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "retro rounded-none border-2 border-border bg-card p-3 text-center text-xs uppercase tracking-[0.15em] transition",
                  "hover:border-primary hover:bg-accent hover:text-primary",
                  "shadow-[4px_4px_0_var(--border)] hover:shadow-[4px_4px_0_var(--primary)]"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="mt-4 border-t-2 border-border pt-4">
              <a
                href="https://github.com/heimin22/fyketonel"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "retro flex items-center justify-center gap-2 rounded-none border-2 border-border bg-card p-4 text-center text-xs uppercase tracking-[0.15em] transition",
                  "hover:border-primary hover:bg-accent hover:text-primary",
                  "shadow-[4px_4px_0_var(--border)] hover:shadow-[4px_4px_0_var(--primary)]"
                )}
              >
                <GithubIcon className="size-4" />
                <span>{stars !== null ? `${stars}★` : "GitHub"}</span>
              </a>
            </div>
          </nav>
          </div>
        </>
      )}
    </>
  );
}

export default RetroNavigation;

