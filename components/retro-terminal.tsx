"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Terminal, Minimize2, Maximize2, X } from "lucide-react";
import { useTheme } from "next-themes";
import { crtOpenVariant } from "@/components/ui/8bit/motion-utils";

interface TerminalLine {
  type: "input" | "output" | "error" | "success";
  content: string;
  timestamp?: Date;
}

interface Command {
  name: string;
  description: string;
  execute: (args: string[], pipeInput?: string) => TerminalLine[];
}

interface VirtualNode {
  type: "file" | "dir";
  content?: string;
  children?: Record<string, VirtualNode>;
}

const MATH_CONSTANTS: Record<string, number> = {
  PI: Math.PI,
  E: Math.E,
  PHI: 1.618033988749895,
  TAU: Math.PI * 2,
  LN2: Math.LN2,
  LN10: Math.LN10,
  SQRT2: Math.SQRT2,
};

const MATH_FUNCTIONS: Record<string, (...args: number[]) => number> = {
  sqrt: Math.sqrt,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  log: Math.log,
  log2: Math.log2,
  log10: Math.log10,
  pow: Math.pow,
  abs: Math.abs,
  ceil: Math.ceil,
  floor: Math.floor,
  round: Math.round,
  min: Math.min,
  max: Math.max,
  exp: Math.exp,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  atan2: Math.atan2,
  sign: Math.sign,
  trunc: Math.trunc,
  cbrt: Math.cbrt,
  hypot: Math.hypot,
};

const INITIAL_FS: VirtualNode = {
  type: "dir",
  children: {
    home: {
      type: "dir",
      children: {
        orpheus: {
          type: "dir",
          children: {
            "about.txt": {
              type: "file",
              content: "Fyke Simon V. Tonel\nFull-Stack Developer\nMetro Manila, Philippines\nGuardian of Chaotic Plans",
            },
            projects: {
              type: "dir",
              children: {
                "pasada.txt": { type: "file", content: "Pasada - Transit companion app with live tracking" },
                "flick.txt": { type: "file", content: "Flick - Audio player with Rust engine and UAC 2.0" },
                "building-blocks.txt": { type: "file", content: "Building Blocks - Modular component library" },
                "revo.txt": { type: "file", content: "Revo - Revolutionary design system" },
              },
            },
            skills: {
              type: "dir",
              children: {
                "frontend.ts": { type: "file", content: "React, Next.js, Remix, Flutter, Tailwind CSS, Three.js" },
                "backend.ts": { type: "file", content: "Node.js, Express.js, Bun" },
                "devops.ts": { type: "file", content: "Docker, Git, GitHub, GitLab, GCP, Cloudflare" },
              },
            },
            "contact.txt": { type: "file", content: "GitHub: github.com/ultraelectronica\nEmail: Available on contact form" },
          },
        },
      },
    },
    etc: {
      type: "dir",
      children: {
        "orpheus.conf": { type: "file", content: "VERSION=1.0.0\nTHEME=default\nAUTHOR=Fyke\nMAX_LINES=70" },
      },
    },
    var: {
      type: "dir",
      children: {
        log: {
          type: "dir",
          children: {
            "terminal.log": { type: "file", content: "Terminal Orpheus initialized\nSystem ready\nAwaiting commands..." },
          },
        },
      },
    },
  },
};

// Theme configurations
const themes = {
  default: {
    name: "Default",
    class: "theme-default",
    light: {},
    dark: {}
  },
  atari: {
    name: "Atari",
    class: "theme-atari",
    light: {
      // Classic Atari 2600 inspired - warm wood grain with iconic orange/red
      "--primary": "oklch(0.6 0.22 35)",           // Atari iconic red-orange
      "--primary-foreground": "oklch(0.98 0.01 85)", // Warm cream text
      "--background": "oklch(0.92 0.04 75)",       // Light warm tan (wood grain light)
      "--foreground": "oklch(0.2 0.04 50)",        // Dark warm brown
      "--card": "oklch(0.96 0.03 80)",             // Lighter cream card
      "--card-foreground": "oklch(0.2 0.04 50)",   // Dark warm brown
      "--popover": "oklch(0.98 0.02 80)",          // Light popover
      "--popover-foreground": "oklch(0.2 0.04 50)",
      "--secondary": "oklch(0.72 0.14 55)",        // Warm amber/gold
      "--secondary-foreground": "oklch(0.15 0.03 50)",
      "--muted": "oklch(0.88 0.05 70)",            // Muted tan
      "--muted-foreground": "oklch(0.45 0.06 55)", // Medium brown
      "--accent": "oklch(0.7 0.18 85)",            // Warm yellow accent
      "--accent-foreground": "oklch(0.15 0.03 50)",
      "--destructive": "oklch(0.55 0.22 25)",      // Deep red
      "--destructive-foreground": "oklch(0.98 0.01 85)",
      "--border": "oklch(0.5 0.12 45)",            // Rich brown border
      "--input": "oklch(0.5 0.12 45)",
      "--ring": "oklch(0.6 0.22 35)",              // Atari orange ring
      "--chart-1": "oklch(0.6 0.22 35)",           // Atari red-orange
      "--chart-2": "oklch(0.72 0.18 55)",          // Amber
      "--chart-3": "oklch(0.75 0.2 90)",           // Yellow
      "--chart-4": "oklch(0.55 0.15 145)",         // Forest green
      "--chart-5": "oklch(0.5 0.15 250)",          // Deep blue
      "--visitor-counter": "oklch(0.65 0.2 145)",  // Retro green
      "--shadow-color": "oklch(0.35 0.08 45 / 0.4)", // Brown shadow
      "--hover-bg": "oklch(0.6 0.22 35 / 0.15)",
      "--hover-text": "oklch(0.55 0.22 35)",
      "--title-shadow": "oklch(0.25 0.06 45)",
    },
    dark: {
      // Dark mode: rich wood grain brown with glowing orange/amber
      "--primary": "oklch(0.7 0.2 40)",            // Bright Atari orange
      "--primary-foreground": "oklch(0.12 0.02 50)", // Near black
      "--background": "oklch(0.18 0.04 45)",       // Dark wood brown
      "--foreground": "oklch(0.9 0.06 70)",        // Warm cream text
      "--card": "oklch(0.24 0.05 50)",             // Slightly lighter wood
      "--card-foreground": "oklch(0.9 0.06 70)",
      "--popover": "oklch(0.2 0.04 48)",
      "--popover-foreground": "oklch(0.9 0.06 70)",
      "--secondary": "oklch(0.6 0.16 55)",         // Warm amber
      "--secondary-foreground": "oklch(0.12 0.02 50)",
      "--muted": "oklch(0.28 0.04 50)",            // Muted dark brown
      "--muted-foreground": "oklch(0.7 0.06 65)",  // Light tan
      "--accent": "oklch(0.78 0.18 85)",           // Bright yellow accent
      "--accent-foreground": "oklch(0.12 0.02 50)",
      "--destructive": "oklch(0.6 0.24 25)",
      "--destructive-foreground": "oklch(0.9 0.06 70)",
      "--border": "oklch(0.7 0.2 40)",             // Orange border (iconic)
      "--input": "oklch(0.4 0.08 50)",             // Medium brown input
      "--ring": "oklch(0.7 0.2 40)",
      "--chart-1": "oklch(0.7 0.2 40)",            // Atari orange
      "--chart-2": "oklch(0.75 0.18 55)",          // Amber
      "--chart-3": "oklch(0.8 0.2 90)",            // Yellow
      "--chart-4": "oklch(0.6 0.18 145)",          // Green
      "--chart-5": "oklch(0.55 0.18 250)",         // Blue
      "--visitor-counter": "oklch(0.7 0.22 145)",  // Bright retro green
      "--shadow-color": "oklch(0.7 0.2 40 / 0.5)", // Orange glow shadow
      "--hover-bg": "oklch(0.7 0.2 40 / 0.2)",
      "--hover-text": "oklch(0.75 0.2 40)",
      "--title-shadow": "oklch(0.6 0.15 45)",      // Warm glow
    }
  },
  nintendo: {
    name: "Nintendo",
    class: "theme-nintendo",
    light: {
      "--primary": "oklch(0.5 0.2 280)",
      "--primary-foreground": "oklch(0 0 0)",
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0 0 0)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0 0 0)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0 0 0)",
      "--secondary": "oklch(0.6 0.15 280)",
      "--secondary-foreground": "oklch(0 0 0)",
      "--muted": "oklch(0.95 0.02 280)",
      "--muted-foreground": "oklch(0.5 0.04 280)",
      "--accent": "oklch(0.7 0.1 260)",
      "--accent-foreground": "oklch(0 0 0)",
      "--destructive": "oklch(0.55 0.25 25)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0.5 0.2 280)",
      "--input": "oklch(0.5 0.2 280)",
      "--ring": "oklch(0.5 0.2 280)",
      "--chart-1": "oklch(0.5 0.2 280)",
      "--chart-2": "oklch(0.55 0.2 270)",
      "--chart-3": "oklch(0.6 0.2 290)",
      "--chart-4": "oklch(0.45 0.2 260)",
      "--chart-5": "oklch(0.7 0.1 260)",
      "--visitor-counter": "oklch(0.6 0.25 280)",
      "--shadow-color": "oklch(0.5 0.2 280 / 0.3)",
      "--hover-bg": "oklch(0.5 0.2 280 / 0.2)",
      "--hover-text": "oklch(0.5 0.2 280)",
      "--title-shadow": "oklch(0.2 0 0)",
    },
    dark: {
      "--primary": "oklch(0.5 0.2 280)",
      "--primary-foreground": "oklch(1 0 0)",
      "--background": "oklch(0.16 0.05 260)",
      "--foreground": "oklch(1 0 0)",
      "--card": "oklch(0.2 0.06 260)",
      "--card-foreground": "oklch(1 0 0)",
      "--popover": "oklch(0.15 0.02 260)",
      "--popover-foreground": "oklch(1 0 0)",
      "--secondary": "oklch(0.45 0.15 280)",
      "--secondary-foreground": "oklch(1 0 0)",
      "--muted": "oklch(0.25 0.03 260)",
      "--muted-foreground": "oklch(0.7 0.05 280)",
      "--accent": "oklch(0.7 0.1 260)",
      "--accent-foreground": "oklch(1 0 0)",
      "--destructive": "oklch(0.6 0.28 20)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(1 0 0)",
      "--input": "oklch(1 0 0)",
      "--ring": "oklch(0.5 0.2 280)",
      "--chart-1": "oklch(0.5 0.2 280)",
      "--chart-2": "oklch(0.55 0.2 270)",
      "--chart-3": "oklch(0.6 0.2 290)",
      "--chart-4": "oklch(0.45 0.2 260)",
      "--chart-5": "oklch(0.7 0.1 260)",
      "--visitor-counter": "oklch(0.6 0.25 280)",
      "--shadow-color": "oklch(0.5 0.2 280 / 0.4)",
      "--hover-bg": "oklch(0.5 0.2 280 / 0.2)",
      "--hover-text": "oklch(0.5 0.2 280)",
      "--title-shadow": "oklch(0.6 0 0)",
    }
  },
  vhs: {
    name: "VHS",
    class: "theme-vhs",
    light: {
      "--primary": "oklch(0.5915 0.2569 322.8961)",
      "--primary-foreground": "oklch(0.2905 0.1432 302.7167)",
      "--background": "oklch(0.9768 0.0142 308.299)",
      "--foreground": "oklch(0.2905 0.1432 302.7167)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.2905 0.1432 302.7167)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.2905 0.1432 302.7167)",
      "--secondary": "oklch(0.7 0.15 310)",
      "--secondary-foreground": "oklch(0.2905 0.1432 302.7167)",
      "--muted": "oklch(0.95 0.02 308)",
      "--muted-foreground": "oklch(0.5 0.1 310)",
      "--accent": "oklch(0.903 0.0732 319.6198)",
      "--accent-foreground": "oklch(0.2905 0.1432 302.7167)",
      "--destructive": "oklch(0.55 0.25 25)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0.9024 0.0604 306.703)",
      "--input": "oklch(0.9024 0.0604 306.703)",
      "--ring": "oklch(0.5915 0.2569 322.8961)",
      "--chart-1": "oklch(0.5915 0.2569 322.8961)",
      "--chart-2": "oklch(0.65 0.25 310)",
      "--chart-3": "oklch(0.7 0.25 330)",
      "--chart-4": "oklch(0.55 0.25 315)",
      "--chart-5": "oklch(0.903 0.0732 319.6198)",
      "--visitor-counter": "oklch(0.6 0.25 320)",
      "--shadow-color": "oklch(0.5915 0.2569 322.8961 / 0.3)",
      "--hover-bg": "oklch(0.5915 0.2569 322.8961 / 0.2)",
      "--hover-text": "oklch(0.5915 0.2569 322.8961)",
      "--title-shadow": "oklch(0.15 0.07 302.7167)",
    },
    dark: {
      "--primary": "oklch(0.6668 0.2591 322.1499)",
      "--primary-foreground": "oklch(0.9024 0.0604 306.703)",
      "--background": "oklch(0.166 0.0254 298.9423)",
      "--foreground": "oklch(0.9024 0.0604 306.703)",
      "--card": "oklch(0.1962 0.0365 301.0125)",
      "--card-foreground": "oklch(0.9024 0.0604 306.703)",
      "--popover": "oklch(0.15 0.02 300)",
      "--popover-foreground": "oklch(0.9024 0.0604 306.703)",
      "--secondary": "oklch(0.4 0.15 310)",
      "--secondary-foreground": "oklch(0.9024 0.0604 306.703)",
      "--muted": "oklch(0.25 0.03 300)",
      "--muted-foreground": "oklch(0.7 0.05 310)",
      "--accent": "oklch(0.7 0.1 320)",
      "--accent-foreground": "oklch(0.9024 0.0604 306.703)",
      "--destructive": "oklch(0.6 0.28 20)",
      "--destructive-foreground": "oklch(0.9024 0.0604 306.703)",
      "--border": "oklch(0.2905 0.1432 302.7167)",
      "--input": "oklch(0.2905 0.1432 302.7167)",
      "--ring": "oklch(0.6668 0.2591 322.1499)",
      "--chart-1": "oklch(0.6668 0.2591 322.1499)",
      "--chart-2": "oklch(0.7 0.25 310)",
      "--chart-3": "oklch(0.75 0.25 330)",
      "--chart-4": "oklch(0.6 0.25 315)",
      "--chart-5": "oklch(0.7 0.1 320)",
      "--visitor-counter": "oklch(0.6 0.25 320)",
      "--shadow-color": "oklch(0.6668 0.2591 322.1499 / 0.4)",
      "--hover-bg": "oklch(0.6668 0.2591 322.1499 / 0.2)",
      "--hover-text": "oklch(0.6668 0.2591 322.1499)",
      "--title-shadow": "oklch(0.4 0.08 302.7167)",
    }
  },
  gameboy: {
    name: "Gameboy", 
    class: "theme-gameboy",
    light: {
      "--primary": "oklch(0.7 0.2 120)",
      "--primary-foreground": "oklch(0.2 0.1 140)",
      "--background": "oklch(0.8 0.2 140)",
      "--foreground": "oklch(0.2 0.1 140)",
      "--card": "oklch(0.8 0.2 140)",
      "--card-foreground": "oklch(0.2 0.1 140)",
      "--popover": "oklch(0.8 0.2 140)",
      "--popover-foreground": "oklch(0.2 0.1 140)",
      "--secondary": "oklch(0.6 0.2 130)",
      "--secondary-foreground": "oklch(0.2 0.1 140)",
      "--muted": "oklch(0.75 0.15 135)",
      "--muted-foreground": "oklch(0.3 0.1 140)",
      "--accent": "oklch(0.3 0.2 140)",
      "--accent-foreground": "oklch(0.8 0.2 120)",
      "--destructive": "oklch(0.55 0.25 25)",
      "--destructive-foreground": "oklch(0.8 0.2 120)",
      "--border": "oklch(0.4 0.2 140)",
      "--input": "oklch(0.4 0.2 140)",
      "--ring": "oklch(0.7 0.2 120)",
      "--chart-1": "oklch(0.7 0.2 120)",
      "--chart-2": "oklch(0.65 0.2 130)",
      "--chart-3": "oklch(0.75 0.2 110)",
      "--chart-4": "oklch(0.6 0.2 150)",
      "--chart-5": "oklch(0.3 0.2 140)",
      "--visitor-counter": "oklch(0.6 0.25 140)",
      "--shadow-color": "oklch(0.7 0.2 120 / 0.3)",
      "--hover-bg": "oklch(0.7 0.2 120 / 0.2)",
      "--hover-text": "oklch(0.7 0.2 120)",
      "--title-shadow": "oklch(0.1 0.08 140)",
    },
    dark: {
      "--primary": "oklch(0.7 0.2 120)",
      "--primary-foreground": "oklch(0.2 0.1 140)",
      "--background": "oklch(0.2 0.1 140)",
      "--foreground": "oklch(0.8 0.2 120)",
      "--card": "oklch(0.2 0.1 140)",
      "--card-foreground": "oklch(0.8 0.2 120)",
      "--popover": "oklch(0.18 0.08 140)",
      "--popover-foreground": "oklch(0.8 0.2 120)",
      "--secondary": "oklch(0.35 0.15 130)",
      "--secondary-foreground": "oklch(0.8 0.2 120)",
      "--muted": "oklch(0.25 0.1 140)",
      "--muted-foreground": "oklch(0.7 0.1 135)",
      "--accent": "oklch(0.3 0.2 140)",
      "--accent-foreground": "oklch(0.8 0.2 120)",
      "--destructive": "oklch(0.6 0.28 20)",
      "--destructive-foreground": "oklch(0.8 0.2 120)",
      "--border": "oklch(0.4 0.2 140)",
      "--input": "oklch(0.4 0.2 140)",
      "--ring": "oklch(0.7 0.2 120)",
      "--chart-1": "oklch(0.7 0.2 120)",
      "--chart-2": "oklch(0.65 0.2 130)",
      "--chart-3": "oklch(0.75 0.2 110)",
      "--chart-4": "oklch(0.6 0.2 150)",
      "--chart-5": "oklch(0.3 0.2 140)",
      "--visitor-counter": "oklch(0.6 0.25 140)",
      "--shadow-color": "oklch(0.7 0.2 120 / 0.4)",
      "--hover-bg": "oklch(0.7 0.2 120 / 0.2)",
      "--hover-text": "oklch(0.7 0.2 120)",
      "--title-shadow": "oklch(0.5 0.1 120)",
    }
  },
  softpop: {
    name: "Soft-pop",
    class: "theme-softpop",
    light: {
      "--primary": "oklch(0.5106 0.2301 276.9656)",
      "--primary-foreground": "oklch(0 0 0)",
      "--background": "oklch(0.9789 0.0082 121.6272)",
      "--foreground": "oklch(0 0 0)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0 0 0)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0 0 0)",
      "--secondary": "oklch(0.7 0.15 270)",
      "--secondary-foreground": "oklch(0 0 0)",
      "--muted": "oklch(0.95 0.01 120)",
      "--muted-foreground": "oklch(0.5 0.02 270)",
      "--accent": "oklch(0.7686 0.1647 70.0804)",
      "--accent-foreground": "oklch(0 0 0)",
      "--destructive": "oklch(0.55 0.25 25)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0 0 0)",
      "--input": "oklch(0 0 0)",
      "--ring": "oklch(0.5106 0.2301 276.9656)",
      "--chart-1": "oklch(0.5106 0.2301 276.9656)",
      "--chart-2": "oklch(0.6 0.2 270)",
      "--chart-3": "oklch(0.65 0.2 280)",
      "--chart-4": "oklch(0.45 0.2 260)",
      "--chart-5": "oklch(0.7686 0.1647 70.0804)",
      "--visitor-counter": "oklch(0.6 0.25 270)",
      "--shadow-color": "oklch(0.5106 0.2301 276.9656 / 0.3)",
      "--hover-bg": "oklch(0.5106 0.2301 276.9656 / 0.2)",
      "--hover-text": "oklch(0.5106 0.2301 276.9656)",
      "--title-shadow": "oklch(0.2 0 0)",
    },
    dark: {
      "--primary": "oklch(0.6801 0.1583 276.9349)",
      "--primary-foreground": "oklch(1 0 0)",
      "--background": "oklch(0 0 0)",
      "--foreground": "oklch(1 0 0)",
      "--card": "oklch(0.2455 0.0217 257.2823)",
      "--card-foreground": "oklch(1 0 0)",
      "--popover": "oklch(0.15 0.02 260)",
      "--popover-foreground": "oklch(1 0 0)",
      "--secondary": "oklch(0.5 0.15 270)",
      "--secondary-foreground": "oklch(1 0 0)",
      "--muted": "oklch(0.25 0.02 260)",
      "--muted-foreground": "oklch(0.7 0.02 270)",
      "--accent": "oklch(0.75 0.15 70)",
      "--accent-foreground": "oklch(1 0 0)",
      "--destructive": "oklch(0.6 0.28 20)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0.4459 0 0)",
      "--input": "oklch(0.4459 0 0)",
      "--ring": "oklch(0.6801 0.1583 276.9349)",
      "--chart-1": "oklch(0.6801 0.1583 276.9349)",
      "--chart-2": "oklch(0.7 0.15 270)",
      "--chart-3": "oklch(0.75 0.15 280)",
      "--chart-4": "oklch(0.6 0.15 260)",
      "--chart-5": "oklch(0.75 0.15 70)",
      "--visitor-counter": "oklch(0.6 0.25 270)",
      "--shadow-color": "oklch(0.6801 0.1583 276.9349 / 0.4)",
      "--hover-bg": "oklch(0.6801 0.1583 276.9349 / 0.2)",
      "--hover-text": "oklch(0.6801 0.1583 276.9349)",
      "--title-shadow": "oklch(0.6 0 0)",
    }
  },
  ally: {
    name: "Ally",
    class: "theme-ally",
    light: {
      "--primary": "oklch(0.65 0.25 350)",
      "--primary-foreground": "oklch(0.98 0 0)",
      "--background": "oklch(0.98 0.02 340)",
      "--foreground": "oklch(0.2 0.05 350)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.2 0.05 350)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.2 0.05 350)",
      "--secondary": "oklch(0.8 0.2 85)",
      "--secondary-foreground": "oklch(0.2 0.05 350)",
      "--muted": "oklch(0.95 0.02 340)",
      "--muted-foreground": "oklch(0.5 0.05 350)",
      "--accent": "oklch(0.85 0.22 90)",
      "--accent-foreground": "oklch(0.2 0.05 350)",
      "--destructive": "oklch(0.55 0.25 25)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0.65 0.25 350)",
      "--input": "oklch(0.65 0.25 350)",
      "--ring": "oklch(0.65 0.25 350)",
      "--chart-1": "oklch(0.65 0.25 350)",
      "--chart-2": "oklch(0.8 0.2 85)",
      "--chart-3": "oklch(0.7 0.22 340)",
      "--chart-4": "oklch(0.75 0.18 95)",
      "--chart-5": "oklch(0.85 0.22 90)",
      "--visitor-counter": "oklch(0.7 0.25 350)",
      "--shadow-color": "oklch(0.65 0.25 350 / 0.3)",
      "--hover-bg": "oklch(0.65 0.25 350)",
      "--hover-text": "oklch(1 0 0)",
    },
    dark: {
      // Ally Dark is now just Ally Light (but maybe slightly softer/warmer to differentiate?)
      // Let's make it identical or very close to light mode as requested "light mode kind of theme"
      "--primary": "oklch(0.65 0.25 350)",
      "--primary-foreground": "oklch(0.98 0 0)",
      "--background": "oklch(0.96 0.02 340)", // Slightly darker background
      "--foreground": "oklch(0.2 0.05 350)",
      "--card": "oklch(0.98 0 0)", // Slightly darker card
      "--card-foreground": "oklch(0.2 0.05 350)",
      "--popover": "oklch(0.98 0 0)",
      "--popover-foreground": "oklch(0.2 0.05 350)",
      "--secondary": "oklch(0.8 0.2 85)",
      "--secondary-foreground": "oklch(0.2 0.05 350)",
      "--muted": "oklch(0.93 0.02 340)",
      "--muted-foreground": "oklch(0.5 0.05 350)",
      "--accent": "oklch(0.85 0.22 90)",
      "--accent-foreground": "oklch(0.2 0.05 350)",
      "--destructive": "oklch(0.55 0.25 25)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0.65 0.25 350)",
      "--input": "oklch(0.65 0.25 350)",
      "--ring": "oklch(0.65 0.25 350)",
      "--chart-1": "oklch(0.65 0.25 350)",
      "--chart-2": "oklch(0.8 0.2 85)",
      "--chart-3": "oklch(0.7 0.22 340)",
      "--chart-4": "oklch(0.75 0.18 95)",
      "--chart-5": "oklch(0.85 0.22 90)",
      "--visitor-counter": "oklch(0.7 0.25 350)",
      "--shadow-color": "oklch(0.65 0.25 350 / 0.3)",
      "--hover-bg": "oklch(0.65 0.25 350)",
      "--hover-text": "oklch(1 0 0)",
    }
  },
  simon: {
    name: "Simon",
    class: "theme-simon",
    light: {
      "--primary": "oklch(0.75 0.18 60)",
      "--primary-foreground": "oklch(0.05 0 0)",
      "--background": "oklch(0.98 0.05 60)",
      "--foreground": "oklch(0.05 0 0)",
      "--card": "oklch(0.99 0.03 60)",
      "--card-foreground": "oklch(0.05 0 0)",
      "--popover": "oklch(0.99 0.03 60)",
      "--popover-foreground": "oklch(0.05 0 0)",
      "--secondary": "oklch(0.95 0.08 60)",
      "--secondary-foreground": "oklch(0.05 0 0)",
      "--muted": "oklch(0.92 0.05 60)",
      "--muted-foreground": "oklch(0.4 0 0)",
      "--accent": "oklch(0.8 0.2 60)",
      "--accent-foreground": "oklch(0.05 0 0)",
      "--destructive": "oklch(0.55 0.25 25)",
      "--destructive-foreground": "oklch(0.99 0.03 60)",
      "--border": "oklch(0.75 0.18 60)",
      "--input": "oklch(0.75 0.18 60)",
      "--ring": "oklch(0.75 0.18 60)",
      "--chart-1": "oklch(0.75 0.18 60)",
      "--chart-2": "oklch(0.85 0.15 55)",
      "--chart-3": "oklch(0.7 0.2 65)",
      "--chart-4": "oklch(0.95 0.08 60)",
      "--chart-5": "oklch(0.8 0.2 60)",
      "--visitor-counter": "oklch(0.75 0.18 60)",
      "--shadow-color": "oklch(0.75 0.18 60 / 0.3)",
      "--hover-bg": "oklch(0.75 0.18 60 / 0.15)",
      "--hover-text": "oklch(0.75 0.18 60)",
    },
    dark: {
      "--primary": "oklch(0.85 0.2 60)",
      "--primary-foreground": "oklch(0.05 0 0)",
      "--background": "oklch(0.08 0 0)",
      "--foreground": "oklch(0.96 0.08 60)",
      "--card": "oklch(0.12 0 0)",
      "--card-foreground": "oklch(0.96 0.08 60)",
      "--popover": "oklch(0.1 0 0)",
      "--popover-foreground": "oklch(0.96 0.08 60)",
      "--secondary": "oklch(0.25 0.05 60)",
      "--secondary-foreground": "oklch(0.96 0.08 60)",
      "--muted": "oklch(0.15 0 0)",
      "--muted-foreground": "oklch(0.75 0.05 60)",
      "--accent": "oklch(0.9 0.22 60)",
      "--accent-foreground": "oklch(0.05 0 0)",
      "--destructive": "oklch(0.6 0.28 20)",
      "--destructive-foreground": "oklch(0.96 0.08 60)",
      "--border": "oklch(0.85 0.2 60)",
      "--input": "oklch(0.85 0.2 60)",
      "--ring": "oklch(0.85 0.2 60)",
      "--chart-1": "oklch(0.85 0.2 60)",
      "--chart-2": "oklch(0.9 0.18 55)",
      "--chart-3": "oklch(0.8 0.22 65)",
      "--chart-4": "oklch(0.95 0.08 60)",
      "--chart-5": "oklch(0.9 0.22 60)",
      "--visitor-counter": "oklch(0.85 0.2 60)",
      "--shadow-color": "oklch(0.85 0.2 60 / 0.5)",
      "--hover-bg": "oklch(0.85 0.2 60 / 0.2)",
      "--hover-text": "oklch(0.85 0.2 60)",
    }
  }
};

export function RetroTerminal() {
  const MAX_LINES = 70;
  
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: "success",
      content: "╔════════════════════════════════════════════════╗",
    },
    {
      type: "success",
      content: "║       TERMINAL ORPHEUS v1.0.0                  ║",
    },
    {
      type: "success",
      content: "╚════════════════════════════════════════════════╝",
    },
    {
      type: "output",
      content: "Type 'help' to see available commands.",
    },
  ]);

  // Helper function to limit lines to MAX_LINES
  const addLines = (newLines: TerminalLine[]) => {
    setLines((prev) => {
      const combined = [...prev, ...newLines];
      // Keep only the last MAX_LINES
      return combined.slice(-MAX_LINES);
    });
  };
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("default");
  const [simonThemeMode, setSimonThemeMode] = useState<"dark" | "light">("dark");
  const [isMounted, setIsMounted] = useState(false);
  const [multiLineBuffer, setMultiLineBuffer] = useState<string[]>([]);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const [fileSystem, setFileSystem] = useState<VirtualNode>(INITIAL_FS);
  const [currentDir, setCurrentDir] = useState("/home/orpheus");
  const [aliases, setAliases] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Load theme from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState in effect
    const rafId = requestAnimationFrame(() => {
      setIsMounted(true);
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("terminal-theme");
        const savedSimonMode = localStorage.getItem("terminal-simon-mode") as "dark" | "light" | null;
        if (savedTheme && themes[savedTheme as keyof typeof themes]) {
          setCurrentTheme(savedTheme);
        }
        if (savedSimonMode && (savedSimonMode === "dark" || savedSimonMode === "light")) {
          setSimonThemeMode(savedSimonMode);
        }
      }
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  // Apply theme by directly setting CSS variables
  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === "undefined") return;
    
    const root = document.documentElement;
    if (!root) return;
    
    const theme = themes[currentTheme as keyof typeof themes];
    // For Simon theme, use the simonThemeMode preference instead of system theme
    const effectiveResolvedTheme = resolvedTheme ?? "dark";
    const isDark = currentTheme === "simon" ? simonThemeMode === "dark" : effectiveResolvedTheme === "dark";
    
    // Get theme values based on dark/light mode
    const themeValues = currentTheme !== "default" && theme 
      ? (isDark ? theme.dark : theme.light)
      : {};
    
    // List of all CSS variables that themes can override
    const allThemeVariables = [
      "--primary", "--primary-foreground", "--background", "--foreground",
      "--card", "--card-foreground", "--popover", "--popover-foreground",
      "--secondary", "--secondary-foreground", "--muted", "--muted-foreground",
      "--accent", "--accent-foreground", "--destructive", "--destructive-foreground",
      "--border", "--input", "--ring",
      "--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5",
      "--visitor-counter", "--shadow-color", "--hover-bg", "--hover-text",
      "--title-shadow"
    ];
    
    // Apply CSS variables directly
    if (Object.keys(themeValues).length > 0) {
      // Apply theme variables
      Object.entries(themeValues).forEach(([property, value]) => {
        if (typeof value === "string") {
          root.style.setProperty(property, value, "important");
        }
      });
    } else {
      // Reset to default by removing all theme custom properties
      allThemeVariables.forEach(property => {
        root.style.removeProperty(property);
      });
    }
    
    // Also apply theme class for CSS fallback
    const body = document.body;
    const html = document.documentElement;
    
    // Remove all theme classes
    Object.values(themes).forEach(t => {
      body?.classList.remove(t.class);
      html?.classList.remove(t.class);
    });
    
    // Remove simon-light class if it exists
    body?.classList.remove("simon-light");
    html?.classList.remove("simon-light");
    
    // Add current theme class if not default
    if (currentTheme !== "default" && theme) {
      body?.classList.add(theme.class);
      html?.classList.add(theme.class);
      
      // Add simon-light class when Simon theme is in light mode
      if (currentTheme === "simon" && simonThemeMode === "light") {
        body?.classList.add("simon-light");
        html?.classList.add("simon-light");
      }
    }
  }, [currentTheme, simonThemeMode, resolvedTheme]);

  // --- Virtual filesystem helpers ---
  const resolvePath = (path: string): string => {
    if (path.startsWith("/")) return path.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
    const parts = currentDir.split("/").filter(Boolean);
    for (const seg of path.split("/")) {
      if (seg === "..") parts.pop();
      else if (seg !== ".") parts.push(seg);
    }
    return "/" + parts.join("/") || "/";
  };

  const getNode = (path: string): VirtualNode | null => {
    const resolved = resolvePath(path);
    if (resolved === "/") return fileSystem;
    const parts = resolved.split("/").filter(Boolean);
    let node: VirtualNode = fileSystem;
    for (const part of parts) {
      if (node.type !== "dir" || !node.children?.[part]) return null;
      node = node.children[part];
    }
    return node;
  };

  const setNode = (path: string, node: VirtualNode): boolean => {
    const resolved = resolvePath(path);
    if (resolved === "/") return false;
    const parts = resolved.split("/").filter(Boolean);
    const name = parts.pop()!;
    let current = fileSystem;
    for (const part of parts) {
      if (current.type !== "dir" || !current.children?.[part]) return false;
      current = current.children[part];
    }
    if (current.type !== "dir" || !current.children) return false;
    current.children[name] = node;
    setFileSystem({ ...fileSystem });
    return true;
  };

  const removeNode = (path: string): VirtualNode | null => {
    const resolved = resolvePath(path);
    if (resolved === "/" || resolved === "/home/orpheus") return null;
    const parts = resolved.split("/").filter(Boolean);
    const name = parts.pop()!;
    let current = fileSystem;
    for (const part of parts) {
      if (current.type !== "dir" || !current.children?.[part]) return null;
      current = current.children[part];
    }
    if (current.type !== "dir" || !current.children?.[name]) return null;
    const removed = current.children[name];
    delete current.children[name];
    setFileSystem({ ...fileSystem });
    return removed;
  };

  const resolveAlias = (input: string): string => {
    const parts = input.match(/^(\S+)(.*)/);
    if (!parts) return input;
    const [, cmd, rest] = parts;
    if (aliases[cmd]) return aliases[cmd] + rest;
    return input;
  };

  // Commands definition (with access to state via closures)
  const commands: Record<string, Command> = {
    help: {
      name: "help",
      description: "Show all available commands",
      execute: () => [
        { type: "output", content: "╔════════════════════════════════════════════════╗" },
        { type: "output", content: "║          AVAILABLE COMMANDS                    ║" },
        { type: "output", content: "╚════════════════════════════════════════════════╝" },
        { type: "output", content: "" },
        { type: "output", content: "  help              - Show this help message" },
        { type: "output", content: "  ls [-la] [path]   - List files and directories" },
        { type: "output", content: "  cd [path]         - Change directory" },
        { type: "output", content: "  pwd               - Print working directory" },
        { type: "output", content: "  cat <file>        - Display file contents" },
        { type: "output", content: "  mkdir <dir>       - Create directory" },
        { type: "output", content: "  rmdir <dir>       - Remove empty directory" },
        { type: "output", content: "  rm [-r] <path>    - Remove file or directory" },
        { type: "output", content: "  touch <file>      - Create empty file" },
        { type: "output", content: "  echo <text>       - Display text" },
        { type: "output", content: "  grep <pattern>    - Filter lines matching pattern" },
        { type: "output", content: "  head [-N] [file]  - Display first N lines" },
        { type: "output", content: "  tail [-N] [file]  - Display last N lines" },
        { type: "output", content: "  alias [name=val]  - Create or list command aliases" },
        { type: "output", content: "  unalias <name>    - Remove a command alias" },
        { type: "output", content: "  projects          - Show all projects" },
        { type: "output", content: "  whoami [flags]    - Display portfolio owner info" },
        { type: "output", content: "                      --name, --location, --school, --age" },
        { type: "output", content: "  skills [flags]    - List technology stack" },
        { type: "output", content: "                      --frontend, --backend, --database," },
        { type: "output", content: "                      --tools, --languages" },
        { type: "output", content: "  contact           - Show contact information" },
        { type: "output", content: "  clear             - Clear terminal output" },
        { type: "output", content: "  theme [name]      - Change color theme" },
        { type: "output", content: "                      default/atari/nintendo/vhs/" },
        { type: "output", content: "                      gameboy/softpop/ally" },
        { type: "output", content: "  shout [expr]      - Evaluate expressions:" },
        { type: "output", content: "                      Math: +, -, *, /, %, ** (power)" },
        { type: "output", content: "                      Comparison: ==, !=, <, >, <=, >=" },
        { type: "output", content: "                      Logical: &&, ||, !" },
        { type: "output", content: "                      Assignment: =, +=, -=, *=, /=, %=" },
        { type: "output", content: "                      Functions: sqrt, sin, cos, tan, log," },
        { type: "output", content: "                      pow, abs, ceil, floor, round, min, max" },
        { type: "output", content: "                      Constants: PI, E, PHI, TAU, SQRT2" },
        { type: "output", content: "                      Types: int, float, bool, string" },
        { type: "output", content: "  date              - Display current date/time" },
        { type: "output", content: "  fastfetch         - Display system information" },
        { type: "output", content: "" },
        { type: "output", content: "  Pipes: cmd1 | cmd2    Redirect: cmd > file" },
        { type: "output", content: "  Chain: cmd1 && cmd2    Or: cmd1 || cmd2" },
        { type: "output", content: "  Sequential: cmd1 ; cmd2" },
        { type: "output", content: "" },
        { type: "success", content: "Use ↑/↓ arrows to navigate command history" },
        { type: "success", content: "Press Tab for autocomplete" },
        { type: "success", content: "Shift+Enter or \\ at end for multi-line input" },
        { type: "success", content: "Press Esc to cancel multi-line input" },
        { type: "success", content: "Ctrl+Shift+C to copy terminal output to clipboard" },
      ],
    },
    projects: {
      name: "projects",
      description: "Show all projects",
      execute: () => [
        { type: "output", content: "╔════════════════════════════════════════════════╗" },
        { type: "output", content: "║          PROJECT ARCHIVE                       ║" },
        { type: "output", content: "╚════════════════════════════════════════════════╝" },
        { type: "output", content: "" },
        { type: "output", content: "Visit /projects to view the complete" },
        { type: "output", content: "Lab Archive Citadel with detailed" },
        { type: "output", content: "project information, tech stacks," },
        { type: "output", content: "and live demonstrations." },
        { type: "output", content: "" },
        { type: "success", content: "Navigate to Projects page for full details" },
      ],
    },
    whoami: {
      name: "whoami",
      description: "Display portfolio owner info",
      execute: (args) => {
        const showName = args.length === 0 || args.includes("--name");
        const showLocation = args.length === 0 || args.includes("--location");
        const showSchool = args.length === 0 || args.includes("--school");
        const showAge = args.length === 0 || args.includes("--age");
        
        const output: TerminalLine[] = [
          { type: "output", content: "╔════════════════════════════════════════════════╗" },
          { type: "output", content: "║          SYSTEM OPERATOR                       ║" },
          { type: "output", content: "╚════════════════════════════════════════════════╝" },
          { type: "output", content: "" },
        ];

        if (showName) {
          output.push({ type: "output", content: "  Name:     Fyke Simon V. Tonel" });
        }
        if (showLocation) {
          output.push({ type: "output", content: "  Location: Metro Manila, Philippines" });
        }
        if (showSchool) {
          output.push({ type: "output", content: "  School:   STI College Caloocan" });
        }
        if (showAge) {
          output.push({ type: "output", content: "  Age:      21 years old" });
        }

        output.push({ type: "output", content: "" });
        output.push({ type: "success", content: "Full-Stack Developer | Guardian of Chaotic Plans" });
        
        return output;
      },
    },
    skills: {
      name: "skills",
      description: "List technology stack",
      execute: (args) => {
        const showFrontend = args.length === 0 || args.includes("--frontend");
        const showBackend = args.length === 0 || args.includes("--backend");
        const showDatabase = args.length === 0 || args.includes("--database");
        const showTools = args.length === 0 || args.includes("--tools");
        const showLanguages = args.length === 0 || args.includes("--languages");

        const output: TerminalLine[] = [
          { type: "output", content: "╔════════════════════════════════════════════════╗" },
          { type: "output", content: "║          TECH STACK INVENTORY                  ║" },
          { type: "output", content: "╚════════════════════════════════════════════════╝" },
          { type: "output", content: "" },
        ];

        if (showLanguages) {
          output.push({ type: "output", content: "  Languages:   TypeScript, JavaScript, Dart," });
          output.push({ type: "output", content: "               PL/pgSQL, SQL" });
        }
        if (showFrontend) {
          output.push({ type: "output", content: "  Frontend:    React, Next.js, Remix, Flutter," });
          output.push({ type: "output", content: "               Tailwind CSS, Three.js" });
        }
        if (showBackend) {
          output.push({ type: "output", content: "  Backend:     Node.js, Express.js, Bun" });
        }
        if (showDatabase) {
          output.push({ type: "output", content: "  Database:    PostgreSQL, MySQL, SQLite," });
          output.push({ type: "output", content: "               Firebase, Supabase, QuestDB" });
        }
        if (showTools) {
          output.push({ type: "output", content: "  DevOps:      Docker, Git, GitHub, GitLab" });
          output.push({ type: "output", content: "  Cloud:       GCP, Cloudflare" });
          output.push({ type: "output", content: "  Editors:     VS Code, Neovim, Zed," });
          output.push({ type: "output", content: "               Android Studio" });
          output.push({ type: "output", content: "  OS:          ArchLinux, Linux, Windows" });
          output.push({ type: "output", content: "  Package:     npm, pnpm, Bun" });
        }

        output.push({ type: "output", content: "" });
        output.push({ type: "success", content: "Always learning and expanding the arsenal" });

        return output;
      },
    },
    contact: {
      name: "contact",
      description: "Show contact information",
      execute: () => [
        { type: "output", content: "╔════════════════════════════════════════════════╗" },
        { type: "output", content: "║          CONTACT CHANNELS                      ║" },
        { type: "output", content: "╚════════════════════════════════════════════════╝" },
        { type: "output", content: "" },
        { type: "output", content: "  GitHub:   github.com/ultraelectronica" },
        { type: "output", content: "  Email:    Available on contact form" },
        { type: "output", content: "  Location: Metro Manila, Philippines" },
        { type: "output", content: "" },
        { type: "success", content: "Let's build something amazing together!" },
      ],
    },
    clear: {
      name: "clear",
      description: "Clear terminal output",
      execute: () => {
        setLines([]);
        return [];
      },
    },
    theme: {
      name: "theme",
      description: "Change color theme",
      execute: (args) => {
        if (args.length === 0) {
          return [
            { type: "output", content: "Available themes:" },
            { type: "output", content: "" },
            { type: "output", content: "  • default   - Classic retro theme" },
            { type: "output", content: "  • atari     - Atari-inspired colors" },
            { type: "output", content: "  • nintendo  - Nintendo-inspired colors" },
            { type: "output", content: "  • vhs       - VHS aesthetic" },
            { type: "output", content: "  • gameboy   - Gameboy green theme" },
            { type: "output", content: "  • softpop   - Soft pastel colors" },
            { type: "output", content: "  • ally      - Pink and yellow theme" },
            { type: "output", content: "  • simon --dark - Simon dark theme" },
            { type: "output", content: "  • simon --light - Simon light theme (Mario mode)" },
            { type: "output", content: "" },
            { type: "output", content: `Current theme: ${currentTheme}` },
            { type: "output", content: "" },
            { type: "success", content: "Usage: theme [name]" },
          ];
        }

        const themeName = args[0].toLowerCase();
        
        // Special handling for Simon theme with --dark and --light flags
        if (themeName === "simon") {
          const hasLightFlag = args.includes("--light");
          
          // Determine mode: --light takes precedence, default to dark
          const mode = hasLightFlag ? "light" : "dark";
          
          setCurrentTheme("simon");
          setSimonThemeMode(mode);
          
          // Persist to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("terminal-theme", "simon");
            localStorage.setItem("terminal-simon-mode", mode);
            // Dispatch custom event to notify background component
            window.dispatchEvent(new Event("themeChanged"));
          }
          
          return [
            {
              type: "success",
              content: `Theme changed to Simon (${mode} mode)`,
            },
          ];
        }
        
        if (themes[themeName as keyof typeof themes]) {
          setCurrentTheme(themeName);
          // Persist theme to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("terminal-theme", themeName);
            // Dispatch custom event to notify background component
            window.dispatchEvent(new Event("themeChanged"));
          }
          return [
            {
              type: "success",
              content: `Theme changed to ${themes[themeName as keyof typeof themes].name}`,
            },
          ];
        } else {
          return [
            {
              type: "error",
              content: `Unknown theme: ${themeName}`,
            },
            {
              type: "output",
              content: "Use 'theme' without arguments to see available themes",
            },
          ];
        }
      },
    },
    shout: {
      name: "shout",
      description: "Shout back the text with data type, arithmetic, logical, and assignment support",
      execute: (args) => {
        if (args.length === 0) {
          return [
            {
              type: "output",
              content: "",
            },
          ];
        }

        const input = args.join(" ");
        const output: TerminalLine[] = [];

        // Variable storage for assignments (scoped to this execution context)
        // Using a ref-like pattern to persist between evaluations
        const getVariables = (): Record<string, number | boolean | string> => {
          if (typeof window !== "undefined") {
            if (!(window as unknown as Record<string, unknown>).__shoutVars) {
              (window as unknown as Record<string, Record<string, number | boolean | string>>).__shoutVars = {};
            }
            return (window as unknown as Record<string, Record<string, number | boolean | string>>).__shoutVars;
          }
          return {};
        };

        // Tokenizer for expression parsing
        const tokenize = (expr: string): string[] => {
          const tokens: string[] = [];
          let i = 0;
          while (i < expr.length) {
            // Skip whitespace
            if (/\s/.test(expr[i])) {
              i++;
              continue;
            }
            
            // Multi-character operators
            if (i + 1 < expr.length) {
              const twoChar = expr.slice(i, i + 2);
              if (["==", "!=", "<=", ">=", "&&", "||", "+=", "-=", "*=", "/=", "%=", "**"].includes(twoChar)) {
                tokens.push(twoChar);
                i += 2;
                continue;
              }
            }
            
            // Single character operators and parentheses
            if (["+", "-", "*", "/", "%", "(", ")", "<", ">", "=", "!"].includes(expr[i])) {
              tokens.push(expr[i]);
              i++;
              continue;
            }
            
            // String literals (single or double quotes)
            if (expr[i] === '"' || expr[i] === "'") {
              const quote = expr[i];
              let str = quote;
              i++;
              while (i < expr.length && expr[i] !== quote) {
                // Handle escape sequences
                if (expr[i] === '\\' && i + 1 < expr.length) {
                  str += expr[i] + expr[i + 1];
                  i += 2;
                } else {
                  str += expr[i];
                  i++;
                }
              }
              if (i < expr.length) {
                str += expr[i]; // Include closing quote
                i++;
              }
              tokens.push(str);
              continue;
            }
            
            // Numbers (including decimals and negatives handled by unary)
            if (/\d/.test(expr[i]) || (expr[i] === "." && i + 1 < expr.length && /\d/.test(expr[i + 1]))) {
              let num = "";
              while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === ".")) {
                num += expr[i];
                i++;
              }
              tokens.push(num);
              continue;
            }
            
            // Identifiers (variables, true, false)
            if (/[a-zA-Z_]/.test(expr[i])) {
              let ident = "";
              while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
                ident += expr[i];
                i++;
              }
              tokens.push(ident);
              continue;
            }
            
            // Unknown character, skip
            i++;
          }
          return tokens;
        };

        // Expression parser with operator precedence (function-based to avoid inline class)
        // Precedence (lowest to highest):
        // 1. Assignment: =, +=, -=, *=, /=, %=
        // 2. Logical OR: ||
        // 3. Logical AND: &&
        // 4. Equality: ==, !=
        // 5. Comparison: <, >, <=, >=
        // 6. Addition/Subtraction: +, -
        // 7. Multiplication/Division/Modulo: *, /, %
        // 8. Power: **
        // 9. Unary: !, - (negative)
        // 10. Parentheses: ()

        const parseExpression = (
          tokens: string[],
          variables: Record<string, number | boolean | string>
        ): number | boolean | string => {
          let pos = 0;

          const peek = (): string | null => pos < tokens.length ? tokens[pos] : null;
          const consume = (): string | null => pos < tokens.length ? tokens[pos++] : null;

          const parsePrimary = (): number | boolean | string => {
            const token = peek();
            
            if (token === null) {
              throw new Error("Unexpected end of expression");
            }
            
            // Parentheses
            if (token === "(") {
              consume();
              const result = parseAssignment();
              if (peek() !== ")") {
                throw new Error("Missing closing parenthesis");
              }
              consume();
              return result;
            }
            
            // Number
            if (/^-?\d+\.?\d*$/.test(token) || /^\.\d+$/.test(token)) {
              consume();
              return parseFloat(token);
            }
            
            // Boolean literals
            if (token.toLowerCase() === "true") {
              consume();
              return true;
            }
            if (token.toLowerCase() === "false") {
              consume();
              return false;
            }
            
            // String literals (single or double quotes)
            if ((token.startsWith('"') && token.endsWith('"')) || 
                (token.startsWith("'") && token.endsWith("'"))) {
              consume();
              // Remove quotes and handle escape sequences
              let str = token.slice(1, -1);
              str = str.replace(/\\n/g, '\n');
              str = str.replace(/\\t/g, '\t');
              str = str.replace(/\\"/g, '"');
              str = str.replace(/\\'/g, "'");
              str = str.replace(/\\\\/g, '\\');
              return str;
            }
            
            // Math constants and function calls
            if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
              // Check for function call: name(args)
              if (token in MATH_FUNCTIONS && pos + 1 < tokens.length && tokens[pos + 1] === "(") {
                consume(); // consume function name
                consume(); // consume "("
                const args: (number | boolean | string)[] = [];
                if (peek() !== ")") {
                  args.push(parseAssignment());
                  while (peek() === ",") {
                    consume(); // consume ","
                    args.push(parseAssignment());
                  }
                }
                if (peek() !== ")") {
                  throw new Error(`Missing closing parenthesis for ${token}()`);
                }
                consume(); // consume ")"
                const numArgs = args.map(a => typeof a === "number" ? a : parseFloat(String(a)) || 0);
                const fn = MATH_FUNCTIONS[token];
                return fn(...numArgs);
              }

              // Math constants
              if (token in MATH_CONSTANTS) {
                consume();
                return MATH_CONSTANTS[token];
              }

              // Variable
              consume();
              if (token in variables) {
                return variables[token];
              }
              return 0;
            }
            
            throw new Error(`Unexpected token: ${token}`);
          };

          const parseUnary = (): number | boolean | string => {
            if (peek() === "!") {
              consume();
              const operand = parseUnary();
              return !Boolean(operand);
            }
            
            if (peek() === "-") {
              consume();
              const operand = parseUnary();
              const numOperand = typeof operand === "number" ? operand : parseFloat(String(operand)) || 0;
              return -numOperand;
            }
            
            return parsePrimary();
          };

          const parsePower = (): number | boolean | string => {
            let left = parseUnary();
            
            while (peek() === "**") {
              consume();
              const right = parseUnary(); // right-associative
              const numLeft = typeof left === "number" ? left : parseFloat(String(left)) || 0;
              const numRight = typeof right === "number" ? right : parseFloat(String(right)) || 0;
              left = Math.pow(numLeft, numRight);
            }
            
            return left;
          };

          const parseMultiplicative = (): number | boolean | string => {
            let left = parsePower();
            
            while (peek() === "*" || peek() === "/" || peek() === "%") {
              const op = consume();
              const right = parsePower();
              const numLeft = typeof left === "number" ? left : parseFloat(String(left)) || 0;
              const numRight = typeof right === "number" ? right : parseFloat(String(right)) || 0;
              
              if (op === "*") {
                left = numLeft * numRight;
              } else if (op === "/") {
                if (numRight === 0) throw new Error("Division by zero");
                left = numLeft / numRight;
              } else {
                if (numRight === 0) throw new Error("Modulo by zero");
                left = numLeft % numRight;
              }
            }
            
            return left;
          };

          const parseAdditive = (): number | boolean | string => {
            let left = parseMultiplicative();
            
            while (peek() === "+" || peek() === "-") {
              const op = consume();
              const right = parseMultiplicative();
              const numLeft = typeof left === "number" ? left : parseFloat(String(left)) || 0;
              const numRight = typeof right === "number" ? right : parseFloat(String(right)) || 0;
              
              if (op === "+") {
                left = numLeft + numRight;
              } else {
                left = numLeft - numRight;
              }
            }
            
            return left;
          };

          const parseComparison = (): number | boolean | string => {
            let left = parseAdditive();
            
            while (["<", ">", "<=", ">="].includes(peek() || "")) {
              const op = consume();
              const right = parseAdditive();
              const numLeft = typeof left === "number" ? left : parseFloat(String(left)) || 0;
              const numRight = typeof right === "number" ? right : parseFloat(String(right)) || 0;
              
              switch (op) {
                case "<": left = numLeft < numRight; break;
                case ">": left = numLeft > numRight; break;
                case "<=": left = numLeft <= numRight; break;
                case ">=": left = numLeft >= numRight; break;
              }
            }
            
            return left;
          };

          const parseEquality = (): number | boolean | string => {
            let left = parseComparison();
            
            while (peek() === "==" || peek() === "!=") {
              const op = consume();
              const right = parseComparison();
              if (op === "==") {
                left = left === right;
              } else {
                left = left !== right;
              }
            }
            
            return left;
          };

          const parseLogicalAnd = (): number | boolean | string => {
            let left = parseEquality();
            
            while (peek() === "&&") {
              consume();
              const right = parseEquality();
              left = Boolean(left) && Boolean(right);
            }
            
            return left;
          };

          const parseLogicalOr = (): number | boolean | string => {
            let left = parseLogicalAnd();
            
            while (peek() === "||") {
              consume();
              const right = parseLogicalAnd();
              left = Boolean(left) || Boolean(right);
            }
            
            return left;
          };

          const parseAssignment = (): number | boolean | string => {
            // Check if this is an assignment
            if (pos + 1 < tokens.length) {
              const varName = tokens[pos];
              const op = tokens[pos + 1];
              
              if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName) && ["=", "+=", "-=", "*=", "/=", "%="].includes(op)) {
                pos += 2; // consume variable name and operator
                const value = parseAssignment(); // right-associative
                
                let finalValue: number | boolean | string;
                if (op === "=") {
                  finalValue = value;
                } else {
                  const currentValue = variables[varName];
                  const numCurrent = typeof currentValue === "number" ? currentValue : 0;
                  const numValue = typeof value === "number" ? value : parseFloat(String(value)) || 0;
                  
                  switch (op) {
                    case "+=": finalValue = numCurrent + numValue; break;
                    case "-=": finalValue = numCurrent - numValue; break;
                    case "*=": finalValue = numCurrent * numValue; break;
                    case "/=": 
                      if (numValue === 0) throw new Error("Division by zero");
                      finalValue = numCurrent / numValue; 
                      break;
                    case "%=": 
                      if (numValue === 0) throw new Error("Modulo by zero");
                      finalValue = numCurrent % numValue; 
                      break;
                    default: finalValue = value;
                  }
                }
                
                variables[varName] = finalValue;
                return finalValue;
              }
            }
            
            return parseLogicalOr();
          };

          return parseAssignment();
        };

        // Try to evaluate as an expression
        const tokens = tokenize(input);
        
        // Check if input looks like an expression (has operators, numbers, quoted strings, or assignments)
        // Otherwise treat as plain text string
        const hasOperators = /[+\-*/%<>=!&|]/.test(input);
        const isNumber = /^-?\d+\.?\d*$/.test(input.trim());
        const isQuotedString = /^["'].*["']$/.test(input.trim());
        const isBooleanLiteral = /^(true|false)$/i.test(input.trim());
        const isAssignment = /^[a-zA-Z_][a-zA-Z0-9_]*\s*[+\-*/%]?=/.test(input);
        const looksLikeExpression = hasOperators || isNumber || isQuotedString || isBooleanLiteral || isAssignment;
        
        if (tokens.length > 0 && looksLikeExpression) {
          try {
            const variables = getVariables();
            const result = parseExpression(tokens, variables);
            
            // Determine result type
            let resultType: string;
            if (typeof result === "boolean") {
              resultType = "bool";
            } else if (typeof result === "number") {
              resultType = Number.isInteger(result) ? "int" : "float";
            } else {
              resultType = "string";
            }
            
            // Check if it was an assignment
            const assignmentMatch = input.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*([+\-*/%]?=)\s*/);
            if (assignmentMatch) {
              const varName = assignmentMatch[1];
              const op = assignmentMatch[2];
              output.push({
                type: "success",
                content: `${varName} ${op} ${result} (${resultType})`,
              });
            } else if (resultType === "string") {
              // For strings, just show the value without the "= result" format
              output.push({
                type: "output",
                content: `${result} (${resultType})`,
              });
            } else {
              output.push({
                type: "output",
                content: `${input} = ${result} (${resultType})`,
              });
            }
            
            return output;
          } catch (error) {
            // If expression parsing fails, fall through to type detection
            if (error instanceof Error && (
              error.message.includes("Division by zero") || 
              error.message.includes("Modulo by zero")
            )) {
              output.push({
                type: "error",
                content: error.message,
              });
              return output;
            }
            // Continue to type detection for non-expression inputs
          }
        }
        
        // Plain text without operators/expressions - treat as string
        if (!looksLikeExpression && tokens.length > 0) {
          output.push({
            type: "output",
            content: `${input} (string)`,
          });
          return output;
        }

        // Try to detect and format data types (fallback for non-expressions)
        // Check for boolean
        if (input.toLowerCase() === "true" || input.toLowerCase() === "false") {
          const boolValue = input.toLowerCase() === "true";
          output.push({
            type: "output",
            content: `${input} (bool: ${boolValue})`,
          });
        }
        // Check for integer
        else if (/^-?\d+$/.test(input)) {
          const intValue = parseInt(input, 10);
          output.push({
            type: "output",
            content: `${input} (int: ${intValue})`,
          });
        }
        // Check for float/double
        else if (/^-?\d+\.\d+$/.test(input)) {
          const floatValue = parseFloat(input);
          output.push({
            type: "output",
            content: `${input} (float: ${floatValue})`,
          });
        }
        // Check for null
        else if (input.toLowerCase() === "null") {
          output.push({
            type: "output",
            content: `${input} (null)`,
          });
        }
        // Check for undefined
        else if (input.toLowerCase() === "undefined") {
          output.push({
            type: "output",
            content: `${input} (undefined)`,
          });
        }
        // Check for array-like syntax [item1, item2, ...]
        else if (/^\[.*\]$/.test(input)) {
          output.push({
            type: "output",
            content: `${input} (array)`,
          });
        }
        // Check for object-like syntax {key: value, ...}
        else if (/^\{.*\}$/.test(input)) {
          output.push({
            type: "output",
            content: `${input} (object)`,
          });
        }
        // Default: treat as string
        else {
          output.push({
            type: "output",
            content: `${input} (string)`,
          });
        }

        return output;
      },
    },
    date: {
      name: "date",
      description: "Display current date/time",
      execute: () => {
        const now = new Date();
        return [
          {
            type: "output",
            content: now.toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          },
        ];
      },
    },
    fastfetch: {
      name: "fastfetch",
      description: "Display system information",
      execute: () => {
        const output: TerminalLine[] = [];
        
        // Get browser/system information
        const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
        const platform = typeof navigator !== "undefined" ? navigator.platform : "Unknown";
        const language = typeof navigator !== "undefined" ? navigator.language : "Unknown";
        const screenWidth = typeof window !== "undefined" ? window.screen.width : 0;
        const screenHeight = typeof window !== "undefined" ? window.screen.height : 0;
        const now = new Date();
        
        // Detect browser
        let browser = "Unknown";
        if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) browser = "Chrome";
        else if (userAgent.includes("Firefox")) browser = "Firefox";
        else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
        else if (userAgent.includes("Edg")) browser = "Edge";
        else if (userAgent.includes("Opera")) browser = "Opera";
        
        // Set OS to ORPHEUS
        const os = "ORPHEUS";
        
        // ASCII art banner - Eye
        output.push({ type: "output", content: "" });
        output.push({ type: "output", content: "          ╔═══════════════════════╗" });
        output.push({ type: "output", content: "         ║                       ║" });
        output.push({ type: "output", content: "        ║    ╔═══════════════╗    ║" });
        output.push({ type: "output", content: "       ║    ║               ║    ║" });
        output.push({ type: "output", content: "      ║    ║   ╔═══════╗   ║    ║" });
        output.push({ type: "output", content: "     ║    ║   ║       ║   ║    ║" });
        output.push({ type: "output", content: "    ║    ║   ║   ●   ║   ║    ║" });
        output.push({ type: "output", content: "     ║    ║   ║       ║   ║    ║" });
        output.push({ type: "output", content: "      ║    ║   ╚═══════╝   ║    ║" });
        output.push({ type: "output", content: "       ║    ║               ║    ║" });
        output.push({ type: "output", content: "        ║    ╚═══════════════╝    ║" });
        output.push({ type: "output", content: "         ║                       ║" });
        output.push({ type: "output", content: "          ╚═══════════════════════╝" });
        output.push({ type: "output", content: "" });
        output.push({ type: "output", content: "╔════════════════════════════════════════════════╗" });
        output.push({ type: "output", content: "║          SYSTEM INFORMATION                    ║" });
        output.push({ type: "output", content: "╚════════════════════════════════════════════════╝" });
        output.push({ type: "output", content: "" });
        output.push({ type: "output", content: `  OS          ${os}` });
        output.push({ type: "output", content: `  Platform    ${platform}` });
        output.push({ type: "output", content: `  Browser     ${browser}` });
        output.push({ type: "output", content: `  Language    ${language}` });
        output.push({ type: "output", content: `  Resolution  ${screenWidth}x${screenHeight}` });
        output.push({ type: "output", content: `  Time        ${now.toLocaleTimeString()}` });
        output.push({ type: "output", content: `  Date        ${now.toLocaleDateString()}` });
        output.push({ type: "output", content: "" });
        output.push({ type: "output", content: "╔════════════════════════════════════════════════╗" });
        output.push({ type: "output", content: "║          TERMINAL INFO                        ║" });
        output.push({ type: "output", content: "╚════════════════════════════════════════════════╝" });
        output.push({ type: "output", content: "" });
        output.push({ type: "output", content: `  Terminal    TERMINAL ORPHEUS v1.0.0` });
        output.push({ type: "output", content: `  Theme       ${themes[currentTheme as keyof typeof themes].name}` });
        output.push({ type: "output", content: `  Cwd         ${currentDir}` });
        output.push({ type: "output", content: `  Lines       ${lines.length}` });
        output.push({ type: "output", content: `  History     ${history.length} commands` });
        output.push({ type: "output", content: `  Aliases     ${Object.keys(aliases).length}` });
        output.push({ type: "output", content: "" });
        output.push({ type: "success", content: "System information retrieved successfully" });
        
        return output;
      },
    },
    pwd: {
      name: "pwd",
      description: "Print working directory",
      execute: () => [{ type: "output", content: currentDir }],
    },
    cd: {
      name: "cd",
      description: "Change directory",
      execute: (args) => {
        if (!args[0] || args[0] === "~") {
          setCurrentDir("/home/orpheus");
          return [{ type: "success", content: "Changed to /home/orpheus" }];
        }
        const target = resolvePath(args[0]);
        const node = getNode(target);
        if (!node) return [{ type: "error", content: `cd: no such directory: ${args[0]}` }];
        if (node.type !== "dir") return [{ type: "error", content: `cd: not a directory: ${args[0]}` }];
        setCurrentDir(target);
        return [];
      },
    },
    mkdir: {
      name: "mkdir",
      description: "Create a directory",
      execute: (args) => {
        if (!args[0]) return [{ type: "error", content: "mkdir: missing operand" }];
        const results: TerminalLine[] = [];
        for (const arg of args) {
          const target = resolvePath(arg);
          if (getNode(target)) {
            results.push({ type: "error", content: `mkdir: already exists: ${arg}` });
            continue;
          }
          const ok = setNode(arg, { type: "dir", children: {} });
          results.push(ok
            ? { type: "success", content: `Created directory: ${arg}` }
            : { type: "error", content: `mkdir: cannot create '${arg}': parent path not found` });
        }
        return results;
      },
    },
    cat: {
      name: "cat",
      description: "Display file contents",
      execute: (args, pipeInput) => {
        if (pipeInput) return [{ type: "output", content: pipeInput }];
        if (!args[0]) return [{ type: "error", content: "cat: missing file operand" }];
        const node = getNode(resolvePath(args[0]));
        if (!node) return [{ type: "error", content: `cat: ${args[0]}: No such file` }];
        if (node.type === "dir") return [{ type: "error", content: `cat: ${args[0]}: Is a directory` }];
        return (node.content ?? "").split("\n").map(line => ({ type: "output" as const, content: line }));
      },
    },
    rm: {
      name: "rm",
      description: "Remove files or directories (use -r for dirs)",
      execute: (args) => {
        const recursive = args.includes("-r") || args.includes("-R") || args.includes("-rf");
        const targets = args.filter(a => !a.startsWith("-"));
        if (!targets.length) return [{ type: "error", content: "rm: missing operand" }];
        const results: TerminalLine[] = [];
        for (const t of targets) {
          const node = getNode(resolvePath(t));
          if (!node) { results.push({ type: "error", content: `rm: cannot remove '${t}': No such file or directory` }); continue; }
          if (node.type === "dir" && !recursive) { results.push({ type: "error", content: `rm: cannot remove '${t}': Is a directory (use -r)` }); continue; }
          const removed = removeNode(t);
          results.push(removed ? { type: "success", content: `Removed: ${t}` } : { type: "error", content: `rm: cannot remove '${t}'` });
        }
        return results;
      },
    },
    rmdir: {
      name: "rmdir",
      description: "Remove empty directory",
      execute: (args) => {
        if (!args[0]) return [{ type: "error", content: "rmdir: missing operand" }];
        const node = getNode(resolvePath(args[0]));
        if (!node) return [{ type: "error", content: `rmdir: '${args[0]}': No such directory` }];
        if (node.type !== "dir") return [{ type: "error", content: `rmdir: '${args[0]}': Not a directory` }];
        if (node.children && Object.keys(node.children).length > 0) return [{ type: "error", content: `rmdir: '${args[0]}': Directory not empty` }];
        const removed = removeNode(args[0]);
        return removed ? [{ type: "success", content: `Removed directory: ${args[0]}` }] : [{ type: "error", content: `rmdir: failed to remove '${args[0]}'` }];
      },
    },
    touch: {
      name: "touch",
      description: "Create an empty file",
      execute: (args) => {
        if (!args[0]) return [{ type: "error", content: "touch: missing operand" }];
        const target = resolvePath(args[0]);
        if (getNode(target)) return [];
        const ok = setNode(args[0], { type: "file", content: "" });
        return ok ? [{ type: "success", content: `Created: ${args[0]}` }] : [{ type: "error", content: `touch: cannot create '${args[0]}'` }];
      },
    },
    echo: {
      name: "echo",
      description: "Display text or pipe output",
      execute: (args, pipeInput) => {
        if (pipeInput) return [{ type: "output", content: pipeInput }];
        return [{ type: "output", content: args.join(" ") }];
      },
    },
    grep: {
      name: "grep",
      description: "Filter lines matching a pattern",
      execute: (args, pipeInput) => {
        if (!args[0]) return [{ type: "error", content: "grep: missing pattern" }];
        const text = pipeInput ?? "";
        if (!text) return [{ type: "error", content: "grep: no input (pipe data or use with ls)" }];
        const pattern = args[0];
        const caseInsensitive = args.includes("-i");
        try {
          const regex = new RegExp(pattern, caseInsensitive ? "i" : "");
          const matches = text.split("\n").filter(l => regex.test(l));
          if (matches.length === 0) return [{ type: "output", content: "(no matches)" }];
          return matches.map(l => ({ type: "output" as const, content: l }));
        } catch {
          const filtered = text.split("\n").filter(l => caseInsensitive ? l.toLowerCase().includes(pattern.toLowerCase()) : l.includes(pattern));
          if (filtered.length === 0) return [{ type: "output", content: "(no matches)" }];
          return filtered.map(l => ({ type: "output" as const, content: l }));
        }
      },
    },
    head: {
      name: "head",
      description: "Display first N lines (default 10)",
      execute: (args, pipeInput) => {
        let n = 10;
        const numArg = args.find(a => a.startsWith("-"));
        if (numArg) n = parseInt(numArg.slice(1), 10) || 10;
        const filePath = args.find(a => !a.startsWith("-"));

        let text: string;
        if (pipeInput) {
          text = pipeInput;
        } else if (filePath) {
          const node = getNode(resolvePath(filePath));
          if (!node || node.type === "dir") return [{ type: "error", content: `head: cannot read '${filePath}'` }];
          text = node.content ?? "";
        } else {
          return [{ type: "error", content: "head: no input" }];
        }

        return text.split("\n").slice(0, n).map(l => ({ type: "output" as const, content: l }));
      },
    },
    tail: {
      name: "tail",
      description: "Display last N lines (default 10)",
      execute: (args, pipeInput) => {
        let n = 10;
        const numArg = args.find(a => a.startsWith("-"));
        if (numArg) n = parseInt(numArg.slice(1), 10) || 10;
        const filePath = args.find(a => !a.startsWith("-"));

        let text: string;
        if (pipeInput) {
          text = pipeInput;
        } else if (filePath) {
          const node = getNode(resolvePath(filePath));
          if (!node || node.type === "dir") return [{ type: "error", content: `tail: cannot read '${filePath}'` }];
          text = node.content ?? "";
        } else {
          return [{ type: "error", content: "tail: no input" }];
        }

        const lines = text.split("\n");
        return lines.slice(-n).map(l => ({ type: "output" as const, content: l }));
      },
    },
    alias: {
      name: "alias",
      description: "Create or list command aliases",
      execute: (args) => {
        if (args.length === 0) {
          const entries = Object.entries(aliases);
          if (entries.length === 0) return [{ type: "output", content: "No aliases defined. Use: alias name=command" }];
          return [
            { type: "output", content: "╔════════════════════════════════════════════════╗" },
            { type: "output", content: "║          DEFINED ALIASES                      ║" },
            { type: "output", content: "╚════════════════════════════════════════════════╝" },
            ...entries.map(([k, v]) => ({ type: "output" as const, content: `  ${k} = '${v}'` })),
          ];
        }
        const joined = args.join(" ");
        const eqIndex = joined.indexOf("=");
        if (eqIndex === -1) {
          const name = args[0];
          if (aliases[name]) return [{ type: "output", content: `alias ${name}='${aliases[name]}'` }];
          return [{ type: "error", content: `alias: '${name}' not found` }];
        }
        const name = joined.slice(0, eqIndex).trim();
        const value = joined.slice(eqIndex + 1).trim();
        if (!name) return [{ type: "error", content: "alias: name required" }];
        setAliases(prev => ({ ...prev, [name]: value }));
        return [{ type: "success", content: `Alias set: ${name} = '${value}'` }];
      },
    },
    unalias: {
      name: "unalias",
      description: "Remove a command alias",
      execute: (args) => {
        if (!args[0]) return [{ type: "error", content: "unalias: name required" }];
        if (!(args[0] in aliases)) return [{ type: "error", content: `unalias: '${args[0]}' not found` }];
        setAliases(prev => {
          const next = { ...prev };
          delete next[args[0]];
          return next;
        });
        return [{ type: "success", content: `Alias removed: ${args[0]}` }];
      },
    },
    ls: {
      name: "ls",
      description: "List files and directories",
      execute: (args) => {
        const showLong = args.includes("-l") || args.includes("-la") || args.includes("-al");
        const showAll = args.includes("-a") || args.includes("-la") || args.includes("-al");
        const targetPath = args.find(a => !a.startsWith("-")) || currentDir;
        const node = getNode(resolvePath(targetPath));
        if (!node) return [{ type: "error", content: `ls: cannot access '${targetPath}': No such file or directory` }];
        if (node.type === "file") return [{ type: "output", content: targetPath }];

        const entries = Object.keys(node.children ?? {});
        if (entries.length === 0) return [{ type: "output", content: "(empty directory)" }];

        const displayEntries = showAll ? [".", "..", ...entries] : entries;
        if (showLong) {
          return [
            { type: "output", content: `total ${entries.length}` },
            ...displayEntries.map(name => {
              if (name === "." || name === "..") return { type: "output" as const, content: `drwxr-xr-x  -  ${name}` };
              const child = (node.children ?? {})[name];
              if (!child) return { type: "output" as const, content: `??????????  -  ${name}` };
              if (child.type === "dir") return { type: "output" as const, content: `drwxr-xr-x  -  ${name}/` };
              const size = (child.content ?? "").length;
              return { type: "output" as const, content: `-rw-r--r--  ${size}  ${name}` };
            }),
          ];
        }
        return [
          { type: "output", content: `Contents of ${resolvePath(targetPath)}:` },
          { type: "output", content: "" },
          ...entries.map(name => {
            const child = (node.children ?? {})[name];
            return { type: "output" as const, content: child?.type === "dir" ? `  📂 ${name}/` : `  📄 ${name}` };
          }),
        ];
      },
    },
  };

  // Helper function to execute a single command and return success status
  const executeSingleCommand = (commandString: string, pipeInput?: string): { success: boolean; textOutput: string } => {
    let trimmed = commandString.trim();
    if (!trimmed) return { success: true, textOutput: "" };

    // Resolve aliases
    trimmed = resolveAlias(trimmed);

    // Handle output redirection: command > file
    const redirMatch = trimmed.match(/^(.+?)\s*>\s*(\S+)\s*$/);
    let redirectPath: string | null = null;
    if (redirMatch) {
      trimmed = redirMatch[1].trim();
      redirectPath = redirMatch[2];
    }

    // Handle pipe: cmd1 | cmd2
    const pipeParts = trimmed.split(/\s*\|\s*/);
    if (pipeParts.length > 1) {
      let currentPipeInput = pipeInput ?? "";
      let success = true;
      for (let i = 0; i < pipeParts.length; i++) {
        const result = executeSingleCommand(pipeParts[i].trim(), currentPipeInput);
        success = result.success;
        currentPipeInput = result.textOutput;
      }
      if (redirectPath) {
        const ok = setNode(redirectPath, { type: "file", content: currentPipeInput });
        if (ok) addLines([{ type: "success", content: `Output written to ${redirectPath}` }]);
        else addLines([{ type: "error", content: `Cannot write to ${redirectPath}` }]);
      }
      return { success, textOutput: currentPipeInput };
    }

    // Parse command and arguments
    const parts = trimmed.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Execute command
    const command = commands[commandName];
    if (command) {
      const output = command.execute(args, pipeInput);
      if (!redirectPath) {
        addLines(output);
      } else {
        const textContent = output.map(l => l.content).join("\n");
        const ok = setNode(redirectPath, { type: "file", content: textContent });
        if (ok) addLines([{ type: "success", content: `Output written to ${redirectPath}` }]);
        else addLines(output);
      }
      const textOutput = output.map(l => l.content).join("\n");
      const success = !output.some(line => line.type === "error");
      return { success, textOutput };
    } else {
      addLines([
        { type: "error", content: `Command not found: ${commandName}` },
        { type: "output", content: "Type 'help' to see available commands." },
      ]);
      return { success: false, textOutput: "" };
    }
  };

  const executeCommand = (commandString: string) => {
    const trimmed = commandString.trim();
    if (!trimmed) return;

    // Add command to history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Add input line
    addLines([{ type: "input", content: `$ ${trimmed}`, timestamp: new Date() }]);

    // Special-case: allow full logical/assignment expressions inside shout without splitting on && or ||
    const firstToken = trimmed.split(/\s+/)[0]?.toLowerCase();
    if (firstToken === "shout") {
      executeSingleCommand(trimmed);
      setInput("");
      return;
    }

    // Parse command string for logical operators: &&, ||, ;
    // Smart parsing: combine flags from the same command
    const parts: Array<{ command: string; operator?: "&&" | "||" | ";" }> = [];
    
    // Use regex to match operators with whitespace boundaries to avoid splitting within arguments
    // Match: whitespace + operator + whitespace OR start/end + operator + whitespace
    const operatorPattern = /(\s+&&\s+|\s+\|\|\s+|\s+;\s+|^&&\s+|\s+&&$|^\|\|\s+|\s+\|\|$|^;\s+|\s+;$)/;
    
    // Split by operators, keeping them in the array
    const tokens = trimmed.split(operatorPattern).filter(token => token.trim());
    
    let currentOperator: "&&" | "||" | ";" | undefined = undefined;
    let previousCommandName = "";
    let previousCommandBase = "";
    
    for (const token of tokens) {
      const trimmedToken = token.trim();
      
      if (trimmedToken === "&&") {
        currentOperator = "&&";
      } else if (trimmedToken === "||") {
        currentOperator = "||";
      } else if (trimmedToken === ";") {
        currentOperator = ";";
      } else if (trimmedToken) {
        // If token starts with -- (a flag) and we have a previous command with && operator,
        // combine flags with the previous command
        if (trimmedToken.startsWith("--") && previousCommandName && currentOperator === "&&") {
          // Combine flags: merge with previous command
          const previousIndex = parts.length - 1;
          if (previousIndex >= 0) {
            // Extract flags from current token
            const newFlags = trimmedToken.split(/\s+/);
            // Combine with previous command
            const combinedCommand = `${previousCommandBase} ${newFlags.join(" ")}`.trim();
            parts[previousIndex].command = combinedCommand;
            // Update previousCommandBase so more flags can be chained
            previousCommandBase = combinedCommand;
            // Don't add a new part, just update the previous one
            currentOperator = undefined;
            continue;
          }
        }
        
        // Extract command name for next iteration
        const commandParts = trimmedToken.split(/\s+/);
        previousCommandName = commandParts[0].toLowerCase();
        previousCommandBase = trimmedToken;
        
        // It's a command
        if (parts.length > 0 && currentOperator) {
          // Add operator to previous entry
          parts[parts.length - 1].operator = currentOperator;
        }
        parts.push({ command: trimmedToken });
        currentOperator = undefined;
      }
    }

    // Execute commands based on operators
    let lastSuccess = true;

    for (let j = 0; j < parts.length; j++) {
      const part = parts[j];
      let shouldExecute = true;

      // Determine if we should execute based on operator from previous command
      if (j > 0 && parts[j - 1].operator) {
        const operator = parts[j - 1].operator;
        if (operator === "&&") {
          // Execute only if previous succeeded
          shouldExecute = lastSuccess;
        } else if (operator === "||") {
          // Execute only if previous failed
          shouldExecute = !lastSuccess;
        } else if (operator === ";") {
          // Always execute (sequential)
          shouldExecute = true;
        }
      }

      // Execute command if conditions are met
      if (shouldExecute && part.command) {
        lastSuccess = executeSingleCommand(part.command).success;
      } else if (part.command) {
        // Command skipped due to operator logic
        lastSuccess = false;
      }
    }

    setInput("");
  };

  // Execute command without displaying input line (for multi-line mode where input is already shown)
  const executeCommandDirect = (commandString: string) => {
    const trimmed = commandString.trim();
    if (!trimmed) return;

    // Add command to history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Special-case: allow full logical/assignment expressions inside shout without splitting on && or ||
    const firstToken = trimmed.split(/\s+/)[0]?.toLowerCase();
    if (firstToken === "shout") {
      executeSingleCommand(trimmed);
      return;
    }

    // Parse command string for logical operators: &&, ||, ;
    const parts: Array<{ command: string; operator?: "&&" | "||" | ";" }> = [];
    const operatorPattern = /(\s+&&\s+|\s+\|\|\s+|\s+;\s+|^&&\s+|\s+&&$|^\|\|\s+|\s+\|\|$|^;\s+|\s+;$)/;
    const tokens = trimmed.split(operatorPattern).filter(token => token.trim());
    
    let currentOperator: "&&" | "||" | ";" | undefined = undefined;
    let previousCommandName = "";
    let previousCommandBase = "";
    
    for (const token of tokens) {
      const trimmedToken = token.trim();
      
      if (trimmedToken === "&&") {
        currentOperator = "&&";
      } else if (trimmedToken === "||") {
        currentOperator = "||";
      } else if (trimmedToken === ";") {
        currentOperator = ";";
      } else if (trimmedToken) {
        if (trimmedToken.startsWith("--") && previousCommandName && currentOperator === "&&") {
          const previousIndex = parts.length - 1;
          if (previousIndex >= 0) {
            const newFlags = trimmedToken.split(/\s+/);
            const combinedCommand = `${previousCommandBase} ${newFlags.join(" ")}`.trim();
            parts[previousIndex].command = combinedCommand;
            previousCommandBase = combinedCommand;
            currentOperator = undefined;
            continue;
          }
        }
        
        const commandParts = trimmedToken.split(/\s+/);
        previousCommandName = commandParts[0].toLowerCase();
        previousCommandBase = trimmedToken;
        
        if (parts.length > 0 && currentOperator) {
          parts[parts.length - 1].operator = currentOperator;
        }
        parts.push({ command: trimmedToken });
        currentOperator = undefined;
      }
    }

    let lastSuccess = true;

    for (let j = 0; j < parts.length; j++) {
      const part = parts[j];
      let shouldExecute = true;

      if (j > 0 && parts[j - 1].operator) {
        const operator = parts[j - 1].operator;
        if (operator === "&&") {
          shouldExecute = lastSuccess;
        } else if (operator === "||") {
          shouldExecute = !lastSuccess;
        } else if (operator === ";") {
          shouldExecute = true;
        }
      }

      if (shouldExecute && part.command) {
        lastSuccess = executeSingleCommand(part.command).success;
      } else if (part.command) {
        lastSuccess = false;
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      // Shift+Enter adds a new line without executing
      if (e.shiftKey) {
        e.preventDefault();
        setInput(prev => prev + "\n");
        setIsMultiLine(true);
        return;
      }
      
      e.preventDefault();
      const currentInput = input.trim();
      
      // Check if line ends with backslash (line continuation)
      if (currentInput.endsWith("\\")) {
        // Remove the backslash and add to buffer
        const lineWithoutBackslash = currentInput.slice(0, -1);
        setMultiLineBuffer(prev => [...prev, lineWithoutBackslash]);
        setIsMultiLine(true);
        
        // Show continuation line in output
        addLines([{ type: "input", content: `${isMultiLine ? ">" : "$"} ${currentInput}`, timestamp: new Date() }]);
        setInput("");
        return;
      }
      
      // If we're in multi-line mode, combine all lines
      if (isMultiLine || multiLineBuffer.length > 0) {
        const fullCommand = [...multiLineBuffer, currentInput].join(" ");
        
        // Show the final line
        addLines([{ type: "input", content: `> ${currentInput}`, timestamp: new Date() }]);
        
        // Reset multi-line state
        setMultiLineBuffer([]);
        setIsMultiLine(false);
        
        // Execute the combined command (skip the input line display since we already added it)
        executeCommandDirect(fullCommand);
        setInput("");
        return;
      }
      
      // Normal single-line execution
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      // Only navigate history if not in multi-line mode and cursor is at start
      if (!isMultiLine && !input.includes("\n")) {
        e.preventDefault();
        if (history.length > 0) {
          const newIndex =
            historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    } else if (e.key === "ArrowDown") {
      // Only navigate history if not in multi-line mode
      if (!isMultiLine && !input.includes("\n")) {
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= history.length) {
            setHistoryIndex(-1);
            setInput("");
          } else {
            setHistoryIndex(newIndex);
            setInput(history[newIndex]);
          }
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const firstLine = input.split("\n")[0];
      if (firstLine.trim() && !isMultiLine) {
        const allCommands = [...Object.keys(commands), ...Object.keys(aliases)];
        const matches = allCommands.filter((cmd) =>
          cmd.startsWith(firstLine.toLowerCase())
        );
        if (matches.length === 1) {
          setInput(matches[0]);
        } else if (matches.length > 1 && matches.length <= 10) {
          addLines([
            { type: "output", content: matches.join("  ") },
          ]);
        }
      }
    } else if (e.key === "Escape") {
      // Cancel multi-line mode
      if (isMultiLine || multiLineBuffer.length > 0) {
        setMultiLineBuffer([]);
        setIsMultiLine(false);
        setInput("");
        addLines([{ type: "output", content: "^C (multi-line input cancelled)" }]);
      }
    } else if (e.key === "c" && e.ctrlKey && e.shiftKey) {
      // Clipboard - Copy output with Ctrl+Shift+C
      e.preventDefault();
      
      // Get all output lines (excluding the input prompt line)
      const outputLines = lines
        .filter(line => line.type !== "input")
        .map(line => line.content)
        .join("\n");
      
      if (outputLines.trim()) {
        navigator.clipboard.writeText(outputLines).then(() => {
          addLines([
            { type: "success", content: "📋 Copied terminal output to clipboard" }
          ]);
        }).catch(() => {
          addLines([
            { type: "error", content: "❌ Failed to copy to clipboard" }
          ]);
        });
      } else {
        addLines([
          { type: "output", content: "⚠️ No output to copy" }
        ]);
      }
    }
  };

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input":
        return "text-primary";
      case "error":
        return "text-red-500";
      case "success":
        return "text-green-500";
      default:
        return "text-foreground";
    }
  };

  const [isAllyMode, setIsAllyMode] = useState(false);
  
  useEffect(() => {
    const checkTheme = () => {
      if (typeof window !== "undefined") {
        const theme = localStorage.getItem("terminal-theme");
        setIsAllyMode(theme === "ally");
      }
    };
    checkTheme();
    window.addEventListener("themeChanged", checkTheme);
    const interval = setInterval(checkTheme, 100);
    return () => {
      window.removeEventListener("themeChanged", checkTheme);
      clearInterval(interval);
    };
  }, []);



  return (
    <motion.div
      variants={crtOpenVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "relative overflow-hidden rounded-none",
        isMaximized
          ? "fixed inset-4 z-50 border-4 border-border bg-card shadow-[8px_8px_0_var(--border)] dark:border-ring"
          : "border-4 border-border bg-card shadow-[6px_6px_0_var(--border)] dark:border-ring"
      )}
    >
      {/* Cat background for Ally theme */}
      {isAllyMode && (
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <Image
            src="/assets/cat.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>
      )}
      {/* Scanline effect */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.03)_50%)] bg-[length:100%_4px] opacity-30" />

      {/* Terminal Header */}
      <div className="relative flex items-center justify-between border-b-4 border-border bg-primary/10 px-4 py-3 dark:border-ring">
        <div className="flex items-center gap-3">
          <Terminal className="size-5 text-primary" />
          <span className="retro text-xs uppercase tracking-[0.2em] text-foreground">
            TERMINAL ORPHEUS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="group rounded-none border-2 border-border bg-background p-1.5 shadow-[2px_2px_0_var(--border)] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--primary)] active:translate-y-0 active:shadow-[1px_1px_0_var(--border)] dark:border-ring"
            aria-label="Minimize terminal"
          >
            <Minimize2 className="size-3 text-foreground transition-colors group-hover:text-primary" />
          </button>
          <button
            type="button"
            onClick={() => setIsMaximized(!isMaximized)}
            className="group rounded-none border-2 border-border bg-background p-1.5 shadow-[2px_2px_0_var(--border)] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--primary)] active:translate-y-0 active:shadow-[1px_1px_0_var(--border)] dark:border-ring"
            aria-label={isMaximized ? "Restore terminal" : "Maximize terminal"}
          >
            <Maximize2 className="size-3 text-foreground transition-colors group-hover:text-primary" />
          </button>
          <button
            type="button"
            onClick={() => setLines([
              {
                type: "success",
                content: "╔════════════════════════════════════════════════╗",
              },
              {
                type: "success",
                content: "║       TERMINAL ORPHEUS v1.0.0                  ║",
              },
              {
                type: "success",
                content: "╚════════════════════════════════════════════════╝",
              },
              {
                type: "output",
                content: "Type 'help' to see available commands.",
              },
            ])}
            className="group rounded-none border-2 border-border bg-background p-1.5 shadow-[2px_2px_0_var(--border)] transition-all hover:-translate-y-0.5 hover:border-red-500 hover:shadow-[3px_3px_0_#ef4444] active:translate-y-0 active:shadow-[1px_1px_0_var(--border)] dark:border-ring"
            aria-label="Reset terminal"
          >
            <X className="size-3 text-foreground transition-colors group-hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Output Area */}
            <div
              ref={outputRef}
              className={cn(
                "relative overflow-y-auto bg-background/95 p-4 font-mono",
                isMaximized ? "h-[calc(100vh-12rem)]" : "h-80"
              )}
              onClick={() => inputRef.current?.focus()}
            >
              <AnimatePresence mode="popLayout">
                {lines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0 }}
                    className={cn(
                      "retro mb-1 whitespace-pre-wrap text-xs leading-relaxed",
                      getLineColor(line.type)
                    )}
                  >
                   {line.content}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Current Directory */}
              <div className="retro mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                {currentDir}
              </div>

              {/* Input Line */}
              <div className="mt-2 flex items-start gap-2">
                <span className="retro text-xs text-primary">{isMultiLine || multiLineBuffer.length > 0 ? ">" : "$"}</span>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Auto-detect multi-line from pasted content
                    if (e.target.value.includes("\n")) {
                      setIsMultiLine(true);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  rows={Math.max(1, input.split("\n").length)}
                  className="retro flex-1 resize-none bg-transparent text-xs text-foreground outline-none caret-primary"
                  placeholder={isMultiLine ? "...continue (Enter to execute, Esc to cancel)" : "Type a command... (Shift+Enter for multi-line)"}
                  autoFocus
                  style={{ minHeight: "1.5em" }}
                />
              </div>
            </div>

            {/* Status Bar */}
            <div className="relative border-t-4 border-border bg-primary/10 px-4 py-2 dark:border-ring">
              <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                <span className="retro">{isMultiLine || multiLineBuffer.length > 0 ? "Multi-line" : "Ready"}</span>
                <span className="retro">{currentDir}</span>
                <span className="retro">Theme: {isMounted ? themes[currentTheme as keyof typeof themes].name : "Default"}</span>
                <span className="retro">Lines: {lines.length}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default RetroTerminal;
