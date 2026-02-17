"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GithubIcon, Menu, X, Battery, Wifi, Gamepad2 } from "lucide-react";
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
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function fetchStars() {
      try {
        const response = await fetch("https://api.github.com/repos/ultraelectronica/fyketonel");
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

    // Clock for HUD
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
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
      <header className="sticky top-0 z-50 w-full border-b-4 border-border bg-card text-card-foreground shadow-md">
        {/* HUD Decoration Line */}
        <div className="h-1 w-full bg-primary/20" />
        
        <div className="mx-auto flex h-16 max-w-[95vw] items-center justify-between px-2 sm:px-4">
          
          {/* Left HUD Section: Status Bar info style */}
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-2">
               <div className="relative flex h-10 w-10 items-center justify-center border-2 border-primary bg-primary/10 overflow-hidden">
                  <Image
                    src="/assets/minippix.png"
                    alt="P1"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-primary/50" />
               </div>
               <div className="hidden flex-col sm:flex">
                  <span className="retro text-[0.6rem] uppercase tracking-widest text-muted-foreground">Player 1</span>
                  <span className="retro text-xs font-bold uppercase tracking-widest text-primary group-hover:underline">FYKE</span>
               </div>
            </Link>

            {/* Separator */}
            <div className="hidden h-8 w-0.5 bg-border sm:block" />

            {/* HP/MP bars decoration for HUD feel */}
            <div className="hidden flex-col gap-1 sm:flex min-w-[80px]">
                <div className="flex items-center gap-1">
                    <span className="retro text-[0.4rem] font-bold text-red-500">HP</span>
                    <div className="h-1.5 flex-1 bg-red-900/30 border border-red-900/50">
                        <div className="h-full w-[92%] bg-red-500" />
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <span className="retro text-[0.4rem] font-bold text-blue-500">MP</span>
                    <div className="h-1.5 flex-1 bg-blue-900/30 border border-blue-900/50">
                        <div className="h-full w-[78%] bg-blue-500" />
                    </div>
                </div>
            </div>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
             <NavigationMenu viewport={false}>
              <NavigationMenuList className="gap-2 bg-background/50 border-2 border-border p-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <NavigationMenuItem key={link.label}>
                      <Link
                        href={link.href}
                        className={cn(
                          "retro px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] transition-all hover:bg-primary hover:text-primary-foreground",
                          isActive ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
             </NavigationMenu>
          </div>

          {/* Right HUD Section: System Info */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden items-center gap-4 sm:flex">
                <div className="flex flex-col items-end">
                    <span className="retro text-[0.5rem] uppercase tracking-widest text-muted-foreground">SCORE</span>
                    <span className="retro text-xs font-bold tracking-widest">{stars !== null ? stars.toString().padStart(6, '0') : "000000"}</span>
                </div>
                
                <div className="h-8 w-0.5 bg-border" />
                
                <div className="flex flex-col items-end min-w-[60px]">
                    <span className="retro text-[0.5rem] uppercase tracking-widest text-muted-foreground">TIME</span>
                    <span className="retro text-xs font-bold tracking-widest">{time}</span>
                </div>
                
                <div className="h-8 w-0.5 bg-border" />
            </div>

             <a
              href="https://github.com/ultraelectronica/fyketonel"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-9 w-9 items-center justify-center border-2 border-border bg-card transition-all hover:border-primary hover:bg-primary/10"
              aria-label="GitHub"
            >
              <GithubIcon className="size-4 transition-transform group-hover:scale-110" />
            </a>

            {/* Mobile Menu Toggle */}
             <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 border-2 border-border md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>
        
        {/* Bottom decorative border */}
        <div className="h-1 w-full bg-border" />
      </header>

      {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
        <div className="fixed inset-0 top-[70px] z-40 flex flex-col bg-background/95 backdrop-blur-sm md:hidden">
            <nav className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
            {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                    "retro text-xl uppercase tracking-[0.2em] transition-all hover:scale-110",
                    isActive ? "text-primary decoration-4 underline-offset-8 underline" : "text-foreground"
                    )}
                >
                    {link.label}
                </Link>
                );
            })}
             <div className="mt-8 flex flex-col items-center gap-2 text-muted-foreground">
                 <div className="retro text-xs uppercase tracking-widest">System Status</div>
                 <div className="flex gap-4">
                     <div className="flex items-center gap-1"><Battery className="size-4" /> <span>92%</span></div>
                     <div className="flex items-center gap-1"><Wifi className="size-4" /> <span>ON</span></div>
                 </div>
             </div>
            </nav>
        </div>
        )}
    </>
  );
}

export default RetroNavigation;

