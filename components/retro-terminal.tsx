"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Terminal, Minimize2, Maximize2, X } from "lucide-react";
import { useTheme } from "next-themes";

interface TerminalLine {
  type: "input" | "output" | "error" | "success";
  content: string;
  timestamp?: Date;
}

interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => TerminalLine[];
}

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
      "--primary": "oklch(0.5 0.2 60)",
      "--primary-foreground": "oklch(0 0 0)",
      "--background": "oklch(0.7 0 0)",
      "--foreground": "oklch(0 0 0)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0 0 0)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0 0 0)",
      "--secondary": "oklch(0.6 0.15 60)",
      "--secondary-foreground": "oklch(0 0 0)",
      "--muted": "oklch(0.75 0.05 60)",
      "--muted-foreground": "oklch(0.3 0.05 60)",
      "--accent": "oklch(0.5 0.2 60)",
      "--accent-foreground": "oklch(0 0 0)",
      "--destructive": "oklch(0.55 0.25 25)",
      "--destructive-foreground": "oklch(1 0 0)",
      "--border": "oklch(0.5 0.2 60)",
      "--input": "oklch(0.5 0.2 60)",
      "--ring": "oklch(0.5 0.2 60)",
      "--chart-1": "oklch(0.5 0.2 60)",
      "--chart-2": "oklch(0.55 0.2 50)",
      "--chart-3": "oklch(0.6 0.2 40)",
      "--chart-4": "oklch(0.45 0.2 70)",
      "--chart-5": "oklch(0.5 0.2 60)",
      "--visitor-counter": "oklch(0.6 0.25 140)",
      "--shadow-color": "oklch(0.5 0.2 60 / 0.3)",
      "--hover-bg": "oklch(0.5 0.2 60 / 0.2)",
      "--hover-text": "oklch(0.5 0.2 60)",
      "--title-shadow": "oklch(0.2 0.05 60)",
    },
    dark: {
      "--primary": "oklch(0.4 0.2 60)",
      "--primary-foreground": "oklch(0.9 0 0)",
      "--background": "oklch(0.2 0 0)",
      "--foreground": "oklch(0.9 0 0)",
      "--card": "oklch(0.4 0 0)",
      "--card-foreground": "oklch(0.9 0 0)",
      "--popover": "oklch(0.15 0 0)",
      "--popover-foreground": "oklch(0.9 0 0)",
      "--secondary": "oklch(0.35 0.15 60)",
      "--secondary-foreground": "oklch(0.9 0 0)",
      "--muted": "oklch(0.25 0.03 60)",
      "--muted-foreground": "oklch(0.7 0.05 60)",
      "--accent": "oklch(0.4 0.2 60)",
      "--accent-foreground": "oklch(0.9 0 0)",
      "--destructive": "oklch(0.6 0.28 20)",
      "--destructive-foreground": "oklch(0.9 0 0)",
      "--border": "oklch(0.4 0 0)",
      "--input": "oklch(0.4 0 0)",
      "--ring": "oklch(0.4 0.2 60)",
      "--chart-1": "oklch(0.4 0.2 60)",
      "--chart-2": "oklch(0.45 0.2 50)",
      "--chart-3": "oklch(0.5 0.2 40)",
      "--chart-4": "oklch(0.35 0.2 70)",
      "--chart-5": "oklch(0.4 0.2 60)",
      "--visitor-counter": "oklch(0.6 0.25 140)",
      "--shadow-color": "oklch(0.4 0.2 60 / 0.4)",
      "--hover-bg": "oklch(0.4 0.2 60 / 0.2)",
      "--hover-text": "oklch(0.4 0.2 60)",
      "--title-shadow": "oklch(0.25 0.04 60)",
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
        { type: "output", content: "  ls                - List portfolio sections" },
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
        { type: "output", content: "  shout [expr]      - Evaluate expressions with full support:" },
        { type: "output", content: "                      Math: +, -, *, /, %, ** (power)" },
        { type: "output", content: "                      Comparison: ==, !=, <, >, <=, >=" },
        { type: "output", content: "                      Logical: &&, ||, !" },
        { type: "output", content: "                      Assignment: =, +=, -=, *=, /=, %=" },
        { type: "output", content: "                      Types: int, float, bool, string" },
        { type: "output", content: "  date              - Display current date/time" },
        { type: "output", content: "  fastfetch         - Display system information" },
        { type: "output", content: "" },
        { type: "success", content: "Use ↑/↓ arrows to navigate command history" },
        { type: "success", content: "Press Tab for autocomplete" },
        { type: "success", content: "Shift+Enter or \\ at end for multi-line input" },
        { type: "success", content: "Press Esc to cancel multi-line input" },
      ],
    },
    ls: {
      name: "ls",
      description: "List portfolio sections",
      execute: () => [
        { type: "output", content: "Portfolio Sections:" },
        { type: "output", content: "" },
        { type: "output", content: "  📂 Projects/        - Lab Archive Citadel" },
        { type: "output", content: "  📂 Plans/           - Future experiments" },
        { type: "output", content: "  📂 Skills/          - Tech stack inventory" },
        { type: "output", content: "  📂 Contact/         - Communication channels" },
        { type: "output", content: "" },
        { type: "success", content: "4 sections available" },
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
            
            // Variable
            if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
              consume();
              if (token in variables) {
                return variables[token];
              }
              // Return 0 for undefined variables (common in shells)
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
        
        if (tokens.length > 0) {
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
        output.push({ type: "output", content: `  Lines       ${lines.length}` });
        output.push({ type: "output", content: `  History     ${history.length} commands` });
        output.push({ type: "output", content: "" });
        output.push({ type: "success", content: "System information retrieved successfully" });
        
        return output;
      },
    },
  };

  // Helper function to execute a single command and return success status
  const executeSingleCommand = (commandString: string): boolean => {
    const trimmed = commandString.trim();
    if (!trimmed) return true;

    // Parse command and arguments
    const parts = trimmed.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Execute command
    const command = commands[commandName];
    if (command) {
      const output = command.execute(args);
      addLines(output);
      // Command succeeded if no error lines in output
      return !output.some(line => line.type === "error");
    } else {
      addLines([
        {
          type: "error",
          content: `Command not found: ${commandName}`,
        },
        {
          type: "output",
          content: "Type 'help' to see available commands.",
        },
      ]);
      return false; // Command failed
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
        lastSuccess = executeSingleCommand(part.command);
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
        lastSuccess = executeSingleCommand(part.command);
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
      // Simple autocomplete (only on first line)
      const firstLine = input.split("\n")[0];
      if (firstLine.trim() && !isMultiLine) {
        const matches = Object.keys(commands).filter((cmd) =>
          cmd.startsWith(firstLine.toLowerCase())
        );
        if (matches.length === 1) {
          setInput(matches[0]);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className={cn(
                      "retro mb-1 whitespace-pre-wrap text-xs leading-relaxed",
                      getLineColor(line.type)
                    )}
                  >
                    {line.content}
                  </motion.div>
                ))}
              </AnimatePresence>

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
              <div className="flex items-center justify-between text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="retro">{isMultiLine || multiLineBuffer.length > 0 ? "Multi-line" : "Ready"}</span>
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
