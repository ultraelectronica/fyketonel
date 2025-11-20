"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

const shootingStarPresets = [
  { id: "shoot-1", top: "12%", delay: "4s", duration: "6s", scale: 0.8 },
  { id: "shoot-2", top: "28%", delay: "12s", duration: "7s", scale: 1 },
  { id: "shoot-3", top: "46%", delay: "20s", duration: "5.5s", scale: 0.7 },
  { id: "shoot-4", top: "63%", delay: "9s", duration: "6.5s", scale: 0.9 },
  { id: "shoot-5", top: "78%", delay: "16s", duration: "8s", scale: 1.1 },
];

interface RetroBackgroundProps {
  className?: string;
  children: React.ReactNode;
}

export function RetroBackground({
  className,
  children,
}: RetroBackgroundProps) {
  const stars = useMemo(() => {
    const randomFromSeed = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 140 }, (_, index) => {
      const baseSeed = index + 1;
      const size = 1 + randomFromSeed(baseSeed) * 2.2;
      return {
        id: `star-${index}`,
        top: `${randomFromSeed(baseSeed * 2) * 100}%`,
        left: `${randomFromSeed(baseSeed * 3) * 100}%`,
        size: `${size}px`,
        blur: `${size * 0.6}px`,
        opacity: 0.4 + randomFromSeed(baseSeed * 4) * 0.6,
        twinkleDelay: `${randomFromSeed(baseSeed * 5) * 6}s`,
        driftDuration: `${50 + randomFromSeed(baseSeed * 6) * 40}s`,
      };
    });
  }, []);

  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden bg-background text-foreground",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="retro-background retro-background--stars absolute inset-0"
      >
        {stars.map((star) => (
          <span
            key={star.id}
            className="retro-background__star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              filter: `blur(${star.blur})`,
              opacity: star.opacity,
              animationDelay: star.twinkleDelay,
              animationDuration: star.driftDuration,
            }}
          />
        ))}

        {shootingStarPresets.map((preset) => (
          <span
            key={preset.id}
            className="retro-background__shooting-star"
            style={{
              top: preset.top,
              animationDelay: preset.delay,
              animationDuration: preset.duration,
              transform: `scale(${preset.scale})`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default RetroBackground;

