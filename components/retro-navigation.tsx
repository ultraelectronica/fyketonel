"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GithubIcon, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

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
      <header className="relative border-b-4 border-border bg-gradient-to-r from-background via-background/95 to-background px-4 py-4 text-foreground shadow-[0_6px_0_var(--border)] md:border-b-[6px] md:px-8 md:py-6 md:shadow-[0_8px_0_var(--border)]">
        {/* Retro scan lines effect */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.03)_50%)] bg-[length:100%_4px] opacity-30" />
        
        <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex min-w-[180px] flex-1 justify-start">
            <Link href="/" className="group flex items-center transition-all hover:scale-105">
              <Image
                src="/assets/logo.png"
                alt="Fyke's Lab"
                width={200}
                height={100}
                className="h-auto w-auto max-h-10 transition-all group-hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] md:max-h-14"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center justify-center md:flex">
            <NavigationMenu
              viewport={false}
              className="text-base tracking-tight text-foreground"
            >
              <NavigationMenuList className="gap-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <NavigationMenuItem key={link.label}>
                      <NavigationMenuLink asChild className="retro">
                        <Link
                          href={link.href}
                          className={cn(
                            "relative inline-flex items-center rounded-none border-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                            isActive
                              ? "border-primary bg-primary/20 text-primary shadow-[3px_3px_0_var(--primary)] hover:shadow-[4px_4px_0_var(--primary)] hover:translate-y-[-2px]"
                              : "border-border bg-card shadow-[3px_3px_0_var(--border)] hover:border-primary hover:bg-accent hover:text-primary hover:shadow-[4px_4px_0_var(--primary)] hover:translate-y-[-2px]"
                          )}
                        >
                          {/* Active indicator pixel dots */}
                          {isActive && (
                            <>
                              <span className="absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 animate-pulse bg-primary" />
                              <span className="absolute right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 animate-pulse bg-primary" />
                            </>
                          )}
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop GitHub Link */}
          <div className="hidden min-w-[180px] flex-1 justify-end md:flex">
            <a
              href="https://github.com/heimin22/fyketonel"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "retro inline-flex items-center gap-2 rounded-none border-2 border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200",
                "shadow-[3px_3px_0_var(--border)] hover:border-primary hover:bg-accent hover:text-primary",
                "hover:shadow-[4px_4px_0_var(--primary)] hover:translate-y-[-2px]"
              )}
              aria-label="View the project on GitHub"
            >
              <GithubIcon className="size-4" />
              <span>{stars !== null ? `${stars}★` : "GitHub"}</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <Button
            variant="outline"
            size="icon"
            className="group relative overflow-hidden border-2 shadow-[3px_3px_0_var(--border)] transition-all hover:shadow-[4px_4px_0_var(--primary)] hover:translate-y-[-2px] md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5 transition-transform group-hover:rotate-90" />
            ) : (
              <Menu className="size-5 transition-transform group-hover:scale-110" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 top-[70px] z-40 animate-in fade-in-0 bg-background/50 backdrop-blur-sm duration-200 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="fixed right-0 top-[70px] z-50 h-[calc(100vh-70px)] w-64 animate-in slide-in-from-right duration-300 overflow-y-auto border-l-4 border-border bg-gradient-to-b from-background to-background/95 shadow-[-8px_0_0_var(--border)] md:hidden">
            {/* Retro scan lines in mobile menu */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.03)_50%)] bg-[length:100%_4px] opacity-30" />
            
            <nav className="relative flex flex-col gap-3 p-4">
              {/* Menu header */}
              <div className="mb-2 border-b-2 border-dashed border-border pb-3">
                <p className="retro text-center text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground">
                  Navigation Menu
                </p>
              </div>

              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "retro group relative overflow-hidden rounded-none border-3 p-4 text-center text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200",
                      isActive
                        ? "border-primary bg-primary/20 text-primary shadow-[4px_4px_0_var(--primary)]"
                        : "border-border bg-card shadow-[4px_4px_0_var(--border)] hover:border-primary hover:bg-accent hover:text-primary hover:shadow-[5px_5px_0_var(--primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--primary)]"
                    )}
                  >
                    {/* Pixel corner decorations for active state */}
                    {isActive && (
                      <>
                        <span className="absolute left-1 top-1 h-2 w-2 bg-primary" />
                        <span className="absolute right-1 top-1 h-2 w-2 bg-primary" />
                        <span className="absolute bottom-1 left-1 h-2 w-2 bg-primary" />
                        <span className="absolute bottom-1 right-1 h-2 w-2 bg-primary" />
                      </>
                    )}
                    
                    {/* Hover effect gradient */}
                    {!isActive && (
                      <span className="absolute inset-0 translate-y-full bg-gradient-to-t from-primary/10 to-transparent transition-transform duration-200 group-hover:translate-y-0" />
                    )}
                    
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
              
              <div className="mt-2 border-t-2 border-dashed border-border pt-4">
                <a
                  href="https://github.com/heimin22/fyketonel"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "retro group relative flex items-center justify-center gap-2 overflow-hidden rounded-none border-3 border-border bg-card p-4 text-center text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200",
                    "shadow-[4px_4px_0_var(--border)] hover:border-primary hover:bg-accent hover:text-primary hover:shadow-[5px_5px_0_var(--primary)]",
                    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--primary)]"
                  )}
                >
                  {/* Hover gradient */}
                  <span className="absolute inset-0 translate-y-full bg-gradient-to-t from-primary/10 to-transparent transition-transform duration-200 group-hover:translate-y-0" />
                  
                  <GithubIcon className="relative size-4 transition-transform group-hover:scale-110" />
                  <span className="relative">{stars !== null ? `${stars}★` : "GitHub"}</span>
                </a>
              </div>

              {/* Decorative footer */}
              <div className="mt-4 flex items-center justify-center gap-1 opacity-30">
                <span className="h-1 w-1 bg-foreground" />
                <span className="h-1 w-1 bg-foreground" />
                <span className="h-1 w-1 bg-foreground" />
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

export default RetroNavigation;

