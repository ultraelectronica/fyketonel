"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";


const roundTo = (value: number, decimals = 3) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const percent = (value: number) => `${roundTo(value * 100, 3)}%`;
const px = (value: number) => `${roundTo(value, 3)}px`;
const seconds = (value: number) => `${roundTo(value, 3)}s`;

interface RetroBackgroundProps {
  className?: string;
  children: React.ReactNode;
}

export function RetroBackground({
  className,
  children,
}: RetroBackgroundProps) {
  const randomFromSeed = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const stars = useMemo(() => {
    return Array.from({ length: 300 }, (_, index) => {
      const baseSeed = index + 1;
      const size = 1 + randomFromSeed(baseSeed) * 2.2;
      return {
        id: `star-${index}`,
        top: percent(randomFromSeed(baseSeed * 2)),
        left: percent(randomFromSeed(baseSeed * 3)),
        size: px(size),
        blur: px(size * 0.1),
        opacity: roundTo(1.0 + randomFromSeed(baseSeed * 4) * 0.3, 6),
        twinkleDelay: seconds(randomFromSeed(baseSeed * 5) * 6),
        driftDuration: seconds(50 + randomFromSeed(baseSeed * 6) * 40),
      };
    });
  }, []);

  const shootingStars = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const baseSeed = index + 100;
      return {
        id: `shoot-${index}`,
        top: percent(randomFromSeed(baseSeed)),
        left: percent(-0.2 + randomFromSeed(baseSeed * 2) * 0.1),
        delay: seconds(randomFromSeed(baseSeed * 3) * 20),
        duration: seconds(5 + randomFromSeed(baseSeed * 4) * 4),
        scale: 0.6 + randomFromSeed(baseSeed * 5) * 0.6,
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

        {shootingStars.map((star) => (
          <span
            key={star.id}
            className="retro-background__shooting-star"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              animationDuration: star.duration,
              transform: `scale(${star.scale})`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default RetroBackground;

