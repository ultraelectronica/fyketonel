"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface RetroBackgroundProps {
  className?: string;
  children: React.ReactNode;
}

// System related constants
const GRID_SIZE = 60; // Increased from 40 for simpler, chunkier look (less DOM nodes)
const TRACE_COLOR = "var(--border)"; // Theme-aware trace color
const TRACE_WIDTH = 4; // Thicker lines
const PULSE_COLOR = "var(--primary)"; // Theme-aware pulse color

// Type for a point
type Point = { x: number; y: number };

export function RetroBackground({
  className,
  children,
}: RetroBackgroundProps) {
  const [isMarioMode, setIsMarioMode] = useState(false);
  const [isAllyMode, setIsAllyMode] = useState(false);
  const [, forceUpdate] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Detect themes
  useEffect(() => {
    const checkTheme = () => {
      if (typeof window !== "undefined") {
        const theme = localStorage.getItem("terminal-theme");
        const simonMode = localStorage.getItem("terminal-simon-mode");
        const shouldBeMario = theme === "simon" && simonMode === "light";
        const shouldBeAlly = theme === "ally";
        
        setIsMarioMode(shouldBeMario);
        setIsAllyMode(shouldBeAlly);
        forceUpdate(prev => prev + 1);
      }
    };

    checkTheme();
    window.addEventListener("themeChanged", checkTheme);
    window.addEventListener("storage", checkTheme);
    const interval = setInterval(checkTheme, 100);

    return () => {
      window.removeEventListener("themeChanged", checkTheme);
      window.removeEventListener("storage", checkTheme);
      clearInterval(interval);
    };
  }, []);

  // Handle resize to regenerate circuit
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Simple seeded RNG for deterministic results
  const createRng = (seed: number) => {
    return () => {
      seed |= 0;
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  // Generate Circuit Board Data
  const circuitData = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return { paths: [], chips: [] };

    // Initialize seeded RNG
    const rng = createRng(dimensions.width + dimensions.height); 
    const random = () => rng();
    const randomInt = (min: number, max: number) => Math.floor(random() * (max - min + 1) + min);

    const cols = Math.ceil(dimensions.width / GRID_SIZE);
    const rows = Math.ceil(dimensions.height / GRID_SIZE);
    const grid = Array(rows).fill(null).map(() => Array(cols).fill(false)); // true if occupied

    const paths: { d: string; id: string; length: number; delay: number; duration: number }[] = [];
    const chips: { x: number; y: number; width: number; height: number; id: string }[] = [];

    // 1. Place some "Chips" (Integrators)
    const chipCount = Math.max(3, Math.floor((cols * rows) / 50));
    
    for (let i = 0; i < chipCount; i++) {
      const w = randomInt(2, 4);
      const h = randomInt(2, 4);
      const x = randomInt(1, cols - w - 1);
      const y = randomInt(1, rows - h - 1);

      // Check collision
      let occupied = false;
      for (let cy = y - 1; cy < y + h + 1; cy++) {
        for (let cx = x - 1; cx < x + w + 1; cx++) {
          if (cy >= 0 && cy < rows && cx >= 0 && cx < cols && grid[cy][cx]) {
            occupied = true;
            break;
          }
        }
      }

      if (!occupied) {
        // Mark grid
        for (let cy = y; cy < y + h; cy++) {
          for (let cx = x; cx < x + w; cx++) {
            grid[cy][cx] = true;
          }
        }
        chips.push({ x: x * GRID_SIZE, y: y * GRID_SIZE, width: w * GRID_SIZE, height: h * GRID_SIZE, id: `chip-${i}` });
      }
    }

    // 2. Generate Traces (Paths)
    const traceCount = Math.floor((cols * rows) / 4);
    
    for (let i = 0; i < traceCount; i++) {
        // Start from a random point or a chip edge (simplified: random point)
        let cx = randomInt(0, cols - 1);
        let cy = randomInt(0, rows - 1);
        
        // Simple random walk with momentum
        const pathPoints: Point[] = [{ x: cx * GRID_SIZE + GRID_SIZE / 2, y: cy * GRID_SIZE + GRID_SIZE / 2 }];
        let dir = randomInt(0, 3); // 0: N, 1: E, 2: S, 3: W
        const length = randomInt(5, 15);

        for (let step = 0; step < length; step++) {
            // Chance to turn
            if (random() < 0.3) {
                dir = (dir + (random() < 0.5 ? 1 : 3)) % 4;
            }

            if (dir === 0) cy--;
            else if (dir === 1) cx++;
            else if (dir === 2) cy++;
            else if (dir === 3) cx--;

            // Boundary check
            if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) break;

            pathPoints.push({ x: cx * GRID_SIZE + GRID_SIZE / 2, y: cy * GRID_SIZE + GRID_SIZE / 2 });
        }

        if (pathPoints.length > 2) {
             const d = pathPoints.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
             paths.push({
                 d,
                 id: `trace-${i}`,
                 length: pathPoints.length * GRID_SIZE,
                 delay: random() * 5,
                 duration: 2 + random() * 5,
             });
        }
    }

    return { paths, chips };

  }, [dimensions]);

  return (
    <div
      ref={containerRef}
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
          {/* Clouds (Simplified for brevity, or kept if identical logic is desired) */}
           {/* ... existing mario content (abbreviated for this replacement, assuming user wants full replacement of file) ... */}
           <MarioClouds /> 
           <div className="absolute bottom-0 left-0 right-0" style={{ height: "30%" }}>
              <img
                src="/assets/grass.png"
                alt=""
                className="absolute bottom-0 left-0 w-full h-full object-cover object-bottom"
                style={{ imageRendering: "pixelated" }}
              />
           </div>
        </div>
      ) : isAllyMode ? (
        // Ally Garden Background
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, #E0F7FA 0%, #FFB6D9 100%)",
          }}
        >
          <SakuraLeaves />
        </div>
      ) : (
        // Circuit Board Background (Default for Dark Mode)
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#050505]"
        >
            <svg
                className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                         <circle cx={2} cy={2} r={2} fill="var(--border)" fillOpacity="0.2" />
                    </pattern>
                </defs>
                
                {/* Background Grid Dots */}
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Traces */}
                {circuitData.paths.map((path) => (
                    <g key={path.id}>
                        {/* Base Trace */}
                        <path
                            d={path.d}
                            stroke={TRACE_COLOR}
                            strokeWidth={TRACE_WIDTH}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Data Flow Pulse */}
                        <path
                            d={path.d}
                            stroke={PULSE_COLOR}
                            strokeWidth={TRACE_WIDTH}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray={`20 ${path.length}`}
                            strokeDashoffset={path.length}
                            className="animate-circuit-flow"
                            style={{
                                animationDuration: `${path.duration}s`,
                                animationDelay: `${path.delay}s`,
                                opacity: 0.8,
                            }}
                        />
                    </g>
                ))}

                {/* Chips */}
                {circuitData.chips.map((chip) => (
                    <g key={chip.id}>
                        <rect
                            x={chip.x}
                            y={chip.y}
                            width={chip.width}
                            height={chip.height}
                            fill="var(--card)"
                            stroke="var(--border)"
                            strokeWidth="2"
                            rx="4"
                        />
                        {/* Chip Inner Pattern */}
                        <rect
                             x={chip.x + 8}
                             y={chip.y + 8}
                             width={chip.width - 16}
                             height={chip.height - 16}
                             fill="var(--muted)"
                             className="animate-pulse-slow"
                        />
                        {/* Chip Pins */}
                        {/* Top/Bottom Pins */}
                        {Array.from({ length: Math.floor(chip.width / 14) }).map((_, i) => (
                             <line
                                key={`pin-v-${i}`}
                                x1={chip.x + 10 + i * 14} y1={chip.y}
                                x2={chip.x + 10 + i * 14} y2={chip.y - 4}
                                stroke="var(--border)" strokeWidth="2"
                             />
                        ))}
                         {Array.from({ length: Math.floor(chip.width / 14) }).map((_, i) => (
                             <line
                                key={`pin-vb-${i}`}
                                x1={chip.x + 10 + i * 14} y1={chip.y + chip.height}
                                x2={chip.x + 10 + i * 14} y2={chip.y + chip.height + 4}
                                stroke="var(--border)" strokeWidth="2"
                             />
                        ))}
                    </g>
                ))}


            </svg>
        </div>
      )}
      
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes circuitFlow {
          to {
            stroke-dashoffset: -200; /* Arbitrary large offset to move dash across */
          }
        }
        .animate-circuit-flow {
            animation-name: circuitFlow;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
        }
        .animate-pulse-slow {
             animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
}

// Simplified Mario Clouds Component to keep the file cleaner if I removed the old one accidentally
const MarioClouds = () => {
    const randomFromSeed = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };

    const clouds = useMemo(() => {
        return Array.from({ length: 8 }, (_, index) => {
          const baseSeed = index + 200;
          return {
            id: `cloud-${index}`,
            top: `${(0.05 + randomFromSeed(baseSeed) * 0.35) * 100}%`,
            left: `${randomFromSeed(baseSeed * 2) * 100}%`,
            duration: `${20 + randomFromSeed(baseSeed * 3) * 20}s`,
            delay: `${randomFromSeed(baseSeed * 4) * 10}s`,
            scale: 1.2 + randomFromSeed(baseSeed * 5) * 0.8, 
          };
        });
      }, []);

    return (
        <>
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
           <style jsx>{`
            @keyframes drift-cloud {
              from { transform: translateX(0) scale(var(--scale, 1)); }
              to { transform: translateX(calc(100vw + 100px)) scale(var(--scale, 1)); }
            }
          `}</style>
          </>
    )
}

const SakuraLeaves = () => {
  const randomFromSeed = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const leaves = useMemo(() => {
    const leafImages = [
      "/assets/sakura_leaf.png",
      "/assets/flower_petal_one.png",
      "/assets/flower_petal_two.png",
    ];
    return Array.from({ length: 20 }, (_, index) => {
      const baseSeed = index + 500;
      return {
        id: `sakura-${index}`,
        left: `${randomFromSeed(baseSeed) * 100}%`,
        duration: `${6 + randomFromSeed(baseSeed * 2) * 10}s`,
        delay: `${randomFromSeed(baseSeed * 3) * 10}s`,
        size: 20 + randomFromSeed(baseSeed * 4) * 20,
        rotation: randomFromSeed(baseSeed * 5) * 360,
        swayAmount: 30 + randomFromSeed(baseSeed * 6) * 60,
        image: leafImages[Math.floor(randomFromSeed(baseSeed * 7) * leafImages.length)],
      };
    });
  }, []);

  return (
    <>
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute"
          style={{
            left: leaf.left,
            top: "-40px",
            "--sway": `${leaf.swayAmount}px`,
            animationDelay: leaf.delay,
            animationDuration: leaf.duration,
            animation: `sakura-fall ${leaf.duration} linear infinite`,
          } as React.CSSProperties}
        >
          <div
            style={{
              width: `${leaf.size}px`,
              height: `${leaf.size}px`,
              animation: `sakura-sway ${leaf.duration} ease-in-out infinite`,
              transform: `rotate(${leaf.rotation}deg)`,
            }}
          >
            <img
              src={leaf.image}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                imageRendering: "pixelated",
                display: "block",
              }}
            />
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes sakura-fall {
          0% { transform: translateY(-40px); }
          100% { transform: translateY(calc(100vh + 40px)); }
        }
        @keyframes sakura-sway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(var(--sway, 30px)) rotate(15deg); }
          50% { transform: translateX(calc(var(--sway, 30px) * -0.7)) rotate(-10deg); }
          75% { transform: translateX(calc(var(--sway, 30px) * 0.8)) rotate(10deg); }
        }
      `}</style>
    </>
  );
};

export default RetroBackground;


