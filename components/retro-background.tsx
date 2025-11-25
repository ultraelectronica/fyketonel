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

  const butterflies = useMemo(() => {
    return Array.from({ length: 15 }, (_, index) => {
      const baseSeed = index + 300;
      return {
        id: `butterfly-${index}`,
        top: percent(0.1 + randomFromSeed(baseSeed) * 0.8),
        left: percent(randomFromSeed(baseSeed * 2)),
        duration: seconds(15 + randomFromSeed(baseSeed * 3) * 15),
        delay: seconds(randomFromSeed(baseSeed * 4) * 5),
        scale: 0.5 + randomFromSeed(baseSeed * 5) * 0.5,
        color: randomFromSeed(baseSeed * 6) > 0.5 ? "#FF69B4" : "#FFD700", // Pink or Gold
        flutterSpeed: seconds(0.1 + randomFromSeed(baseSeed * 7) * 0.2),
      };
    });
  }, []);

  const flowers = useMemo(() => {
    return Array.from({ length: 20 }, (_, index) => {
      const baseSeed = index + 400;
      return {
        id: `flower-${index}`,
        left: percent(randomFromSeed(baseSeed) * 0.95),
        bottom: percent(randomFromSeed(baseSeed * 2) * 0.15), // Bottom 15%
        scale: 0.8 + randomFromSeed(baseSeed * 3) * 0.7,
        type: Math.floor(randomFromSeed(baseSeed * 4) * 3), // 0, 1, 2
        swayDuration: seconds(2 + randomFromSeed(baseSeed * 5) * 2),
        swayDelay: seconds(randomFromSeed(baseSeed * 6) * 2),
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

          {/* Grass section with pixel details */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: "30%" }}>
            {/* Darker grass base with multiple layers for texture */}
            <div className="absolute inset-0">
              {/* Layer 1: Dark grass blades */}
              {Array.from({ length: 80 }, (_, i) => (
                <div
                  key={`grass-dark-${i}`}
                  className="absolute"
                  style={{
                    bottom: `${randomFromSeed(i * 7) * 25}%`,
                    left: `${(i * 1.25) % 100}%`,
                    width: "6px",
                    height: `${12 + randomFromSeed(i * 11) * 20}px`,
                    backgroundColor: "#3A7D1E",
                    opacity: 0.6 + randomFromSeed(i * 13) * 0.3,
                  }}
                />
              ))}
              {/* Layer 2: Medium grass blades */}
              {Array.from({ length: 60 }, (_, i) => (
                <div
                  key={`grass-med-${i}`}
                  className="absolute"
                  style={{
                    bottom: `${randomFromSeed(i * 17) * 20}%`,
                    left: `${(i * 1.67) % 100}%`,
                    width: "4px",
                    height: `${10 + randomFromSeed(i * 19) * 18}px`,
                    backgroundColor: "#4A9D2E",
                    opacity: 0.5 + randomFromSeed(i * 23) * 0.4,
                  }}
                />
              ))}
              {/* Layer 3: Light grass highlights */}
              {Array.from({ length: 40 }, (_, i) => (
                <div
                  key={`grass-light-${i}`}
                  className="absolute"
                  style={{
                    bottom: `${randomFromSeed(i * 29) * 15}%`,
                    left: `${(i * 2.5) % 100}%`,
                    width: "3px",
                    height: `${8 + randomFromSeed(i * 31) * 14}px`,
                    backgroundColor: "#5EBD3E",
                    opacity: 0.4 + randomFromSeed(i * 37) * 0.3,
                  }}
                />
              ))}
            </div>
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
            background: "linear-gradient(to bottom, #E0F7FA 0%, #FFF9C4 100%)", // Light blue to pale yellow
          }}
        >
          {/* Butterflies */}
          {butterflies.map((butterfly) => (
            <div
              key={butterfly.id}
              className="absolute"
              style={{
                top: butterfly.top,
                left: butterfly.left,
                animationDelay: butterfly.delay,
                animationDuration: butterfly.duration,
                transform: `scale(${butterfly.scale})`,
                animation: "drift-butterfly linear infinite",
              }}
            >
              {/* Pixel-art butterfly */}
              <div 
                className="relative" 
                style={{ 
                  width: "20px", 
                  height: "20px",
                  animation: `flutter ${butterfly.flutterSpeed} ease-in-out infinite alternate`
                }}
              >
                <div className="absolute" style={{ top: "4px", left: "4px", width: "6px", height: "6px", backgroundColor: butterfly.color, borderRadius: "50%" }} />
                <div className="absolute" style={{ top: "4px", right: "4px", width: "6px", height: "6px", backgroundColor: butterfly.color, borderRadius: "50%" }} />
                <div className="absolute" style={{ top: "10px", left: "6px", width: "4px", height: "6px", backgroundColor: butterfly.color, opacity: 0.8, borderRadius: "50%" }} />
                <div className="absolute" style={{ top: "10px", right: "6px", width: "4px", height: "6px", backgroundColor: butterfly.color, opacity: 0.8, borderRadius: "50%" }} />
                <div className="absolute bg-black" style={{ top: "6px", left: "9px", width: "2px", height: "10px", borderRadius: "1px" }} />
              </div>
            </div>
          ))}

          {/* Flowers at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
            {flowers.map((flower) => (
              <div
                key={flower.id}
                className="absolute origin-bottom"
                style={{
                  left: flower.left,
                  bottom: flower.bottom,
                  transform: `scale(${flower.scale})`,
                  animation: `sway ${flower.swayDuration} ease-in-out infinite alternate`,
                  animationDelay: flower.swayDelay,
                }}
              >
                {/* Pixel-art flower */}
                <div className="relative flex flex-col items-center">
                  {/* Flower Head */}
                  <div className="relative z-10 size-6">
                    <div className="absolute inset-0 m-auto size-3 rounded-full bg-yellow-400" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 size-3 rounded-full bg-pink-400" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 rounded-full bg-pink-400" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 size-3 rounded-full bg-pink-400" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 size-3 rounded-full bg-pink-400" />
                  </div>
                  {/* Stem */}
                  <div className="h-12 w-1 bg-green-500" />
                  {/* Leaves */}
                  <div className="absolute bottom-4 -left-3 h-3 w-3 rounded-tr-full bg-green-500" />
                  <div className="absolute bottom-6 -right-3 h-3 w-3 rounded-tl-full bg-green-500" />
                </div>
              </div>
            ))}
          </div>

          <style jsx>{`
            @keyframes drift-butterfly {
              from {
                transform: translateX(-10vw) translateY(0) scale(var(--scale, 1));
              }
              25% {
                transform: translateX(20vw) translateY(-5vh) scale(var(--scale, 1));
              }
              50% {
                transform: translateX(50vw) translateY(0) scale(var(--scale, 1));
              }
              75% {
                transform: translateX(80vw) translateY(5vh) scale(var(--scale, 1));
              }
              to {
                transform: translateX(110vw) translateY(0) scale(var(--scale, 1));
              }
            }
            @keyframes flutter {
              0% {
                transform: scaleX(1);
              }
              100% {
                transform: scaleX(0.6);
              }
            }
            @keyframes sway {
              0% {
                transform: rotate(-5deg) scale(var(--scale, 1));
              }
              100% {
                transform: rotate(5deg) scale(var(--scale, 1));
              }
            }
          `}</style>
        </div>
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

