"use client";

import { useMemo, useState, useEffect } from "react";

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
  const [isMarioMode, setIsMarioMode] = useState(false);
  const [isAllyMode, setIsAllyMode] = useState(false);
  const [, forceUpdate] = useState(0);

  // Detect Simon light theme and Ally theme from localStorage
  useEffect(() => {
    const checkTheme = () => {
      if (typeof window !== "undefined") {
        const theme = localStorage.getItem("terminal-theme");
        const simonMode = localStorage.getItem("terminal-simon-mode");
        const shouldBeMario = theme === "simon" && simonMode === "light";
        const shouldBeAlly = theme === "ally";
        
        setIsMarioMode(shouldBeMario);
        setIsAllyMode(shouldBeAlly);
        // Force re-render to ensure background updates
        forceUpdate(prev => prev + 1);
      }
    };

    checkTheme();

    // Listen for custom theme change event
    window.addEventListener("themeChanged", checkTheme);
    
    // Listen for storage changes (for cross-tab)
    window.addEventListener("storage", checkTheme);
    
    // Check more frequently in development for faster response
    const interval = setInterval(checkTheme, 100);

    return () => {
      window.removeEventListener("themeChanged", checkTheme);
      window.removeEventListener("storage", checkTheme);
      clearInterval(interval);
    };
  }, []);

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

  const clouds = useMemo(() => {
    return Array.from({ length: 8 }, (_, index) => {
      const baseSeed = index + 200;
      return {
        id: `cloud-${index}`,
        top: percent(0.05 + randomFromSeed(baseSeed) * 0.35),
        left: percent(randomFromSeed(baseSeed * 2)),
        duration: seconds(20 + randomFromSeed(baseSeed * 3) * 20), // Faster: 20-40s
        delay: seconds(randomFromSeed(baseSeed * 4) * 10),
        scale: 1.2 + randomFromSeed(baseSeed * 5) * 0.8, // Bigger: 1.2-2.0x
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
      {isMarioMode ? (
        // Mario-style background
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 70%, #4A9D2E 70%, #3A7D1E 100%)",
          }}
        >
          {/* Clouds */}
          {clouds.map((cloud) => (
            <div
              key={cloud.id}
              className="absolute"
              style={{
                top: cloud.top,
                left: cloud.left,
                animationDelay: cloud.delay,
                animationDuration: cloud.duration,
                transform: `scale(${cloud.scale})`,
                animation: "drift-cloud linear infinite",
              }}
            >
              {/* Pixel-art cloud */}
              <div className="relative" style={{ width: "80px", height: "40px" }}>
                <div className="absolute bg-white" style={{ top: "8px", left: "16px", width: "16px", height: "8px" }} />
                <div className="absolute bg-white" style={{ top: "8px", left: "32px", width: "32px", height: "8px" }} />
                <div className="absolute bg-white" style={{ top: "16px", left: "8px", width: "64px", height: "8px" }} />
                <div className="absolute bg-white" style={{ top: "24px", left: "16px", width: "48px", height: "8px" }} />
                <div className="absolute bg-white opacity-80" style={{ top: "0px", left: "24px", width: "24px", height: "8px" }} />
                <div className="absolute bg-white opacity-80" style={{ top: "32px", left: "24px", width: "32px", height: "8px" }} />
              </div>
            </div>
          ))}

          {/* Grass section with image */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: "30%" }}>
            <img
              src="/assets/grass.png"
              alt=""
              className="absolute bottom-0 left-0 w-full h-full object-cover object-bottom"
              style={{
                imageRendering: "pixelated",
              }}
            />
          </div>

          <style jsx>{`
            @keyframes drift-cloud {
              from {
                transform: translateX(0) scale(var(--scale, 1));
              }
              to {
                transform: translateX(calc(100vw + 100px)) scale(var(--scale, 1));
              }
            }
          `}</style>
        </div>
      ) : isAllyMode ? (
        // Ally Garden Background
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, #E0F7FA 0%, #FFB6D9 100%)", // Light blue to pale pink
          }}
        />
      ) : (
        // Default stars background
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
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default RetroBackground;


