"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

import { cn } from "@/lib/utils";

export function PowerPelletHighway({ className }: { className?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const isSmall = useMediaQuery({ maxWidth: 639 });
  const isMedium = useMediaQuery({ minWidth: 640, maxWidth: 1023 });
  const isLarge = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pelletCount = useMemo(() => {
    if (!isMounted) return 16; // ensure SSR/CSR match
    if (isSmall) return 16;
    if (isMedium) return 24;
    if (isLarge) return 32;
    return 16; // default fallback
  }, [isMounted, isSmall, isMedium, isLarge]);

  const pellets = Array.from({ length: pelletCount });

  return (
    <section
      className={cn(
        "relative mt-12 mb-6 sm:mt-16 sm:mb-8 md:mt-20 md:mb-10",
        "px-3 sm:px-4 md:px-6",
        className
      )}
    >
      <div className="space-y-3 min-[375px]:space-y-4 sm:space-y-5 md:space-y-6">
        <div className="space-y-1.5 text-center min-[375px]:space-y-2 sm:space-y-2.5 md:space-y-3">
          <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
            Powering Up
          </p>
          <h2 className="retro text-lg uppercase tracking-[0.2em] sm:text-xl sm:tracking-[0.25em] md:text-2xl md:tracking-[0.3em]">
            Power Pellet Highway
          </h2>
        </div>
        <div className="relative mx-auto w-full max-w-[95vw] overflow-hidden rounded-[6px] border-y-4 border-border bg-gradient-to-b from-[var(--background)] via-[oklch(0.9_0.03_80)] to-[var(--background)] py-8 shadow-[0_0_0_4px_var(--border)] dark:border-ring dark:from-[oklch(0.18_0.03_40)] dark:via-[oklch(0.22_0.04_50)] dark:to-[oklch(0.18_0.03_40)]">
          {/* Highway edges */}
          <div className="pointer-events-none absolute inset-y-6 left-6 right-6 border-y-2 border-dashed border-border/70 dark:border-ring/70" />
          <div className="pointer-events-none absolute inset-y-0 left-3 right-3 border-y-4 border-border/60 opacity-70 blur-[1px] dark:border-ring/60" />

          {/* Pellets */}
          <div className="relative z-10 mx-auto flex w-full items-center justify-between px-4 sm:px-6 md:px-8">
            {pellets.map((_, index) => (
              <motion.span
                key={`pellet-${index}`}
                className="inline-flex size-3 rounded-full bg-primary shadow-[0_0_12px_theme(colors.primary.DEFAULT/.65)] sm:size-3.5 md:size-4"
                animate={{ opacity: [0.25, 1, 0.25], scale: [0.9, 1.1, 0.9] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.6,
                  delay: index * 0.12,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Motion trails */}
          <motion.div
            aria-hidden
            className="absolute inset-y-[30%] left-0 right-0 bg-gradient-to-r from-transparent via-[rgba(255,215,0,0.15)] to-transparent blur-2xl dark:via-[rgba(255,215,0,0.1)]"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
}

export default PowerPelletHighway;

