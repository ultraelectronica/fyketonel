"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { kevlarRun } from "@/lib/kevlar/index";
import { stringify as kevlarStringify } from "@/lib/kevlar/index";
import { kevlarEval, isKevlarError } from "@/lib/kevlar/types";
import {
  Terminal,
  Minimize2,
  Maximize2,
  X,
  MoreHorizontal,
  Copy,
  RotateCcw,
} from "lucide-react";
import { OxygenEditor } from "@/lib/kevlar/oxygen";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { crtOpenVariant } from "@/components/ui/8bit/motion-utils";

import {
  kevlarReadmeRaw,
  kevlarLessonRaw,
  kevlarSyntaxRaw,
  kevlarMathRaw,
  kevlarExamplesRaw,
  kevlarLesson01Raw,
  kevlarLesson02Raw,
  kevlarLesson03Raw,
  kevlarLesson04Raw,
  kevlarTutorialRaw,
  kevlarTutor01Raw,
  kevlarTutor02Raw,
  kevlarTutor03Raw,
  kevlarTutor04Raw,
  kevlarTutor05Raw,
  kevlarTutor06Raw,
  kevlarTutor07Raw,
  kevlarTutor08Raw,
  kevlarTutor09Raw,
  kevlarTutor10Raw,
  kevlarTutor11Raw,
} from "@/lib/kevlar/docs-content";

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
                "frontend.kv": { type: "file", content: "React, Next.js, Remix, Flutter, Tailwind CSS, Three.js" },
                "backend.kv": { type: "file", content: "Node.js, Express.js, Bun" },
                "devops.kv": { type: "file", content: "Docker, Git, GitHub, GitLab, GCP, Cloudflare" },
              },
            },
            "contact.txt": { type: "file", content: "GitHub: github.com/ultraelectronica\nEmail: Available on contact form" },
            kevlar: {
              type: "dir",
              children: {
                "README.md": { type: "file", content: kevlarReadmeRaw },
                "lesson.md": { type: "file", content: kevlarLessonRaw },
                lessons: {
                  type: "dir",
                  children: {
                    "01-basics.kv": { type: "file", content: kevlarLesson01Raw },
                    "02-functions.kv": { type: "file", content: kevlarLesson02Raw },
                    "03-control-flow.kv": { type: "file", content: kevlarLesson03Raw },
                    "04-mini-project.kv": { type: "file", content: kevlarLesson04Raw },
                  },
                },
                tutorial: {
                  type: "dir",
                  children: {
                    "TUTORIAL.md": { type: "file", content: kevlarTutorialRaw },
                    "01-hello-world.kv": { type: "file", content: kevlarTutor01Raw },
                    "02-variables.kv": { type: "file", content: kevlarTutor02Raw },
                    "03-operators.kv": { type: "file", content: kevlarTutor03Raw },
                    "04-functions.kv": { type: "file", content: kevlarTutor04Raw },
                    "05-control-flow.kv": { type: "file", content: kevlarTutor05Raw },
                    "06-loops.kv": { type: "file", content: kevlarTutor06Raw },
                    "07-lists.kv": { type: "file", content: kevlarTutor07Raw },
                    "08-match.kv": { type: "file", content: kevlarTutor08Raw },
                    "09-strings.kv": { type: "file", content: kevlarTutor09Raw },
                    "10-builtins.kv": { type: "file", content: kevlarTutor10Raw },
                    "11-mini-project.kv": { type: "file", content: kevlarTutor11Raw },
                  },
                },
                "syntax.md": { type: "file", content: kevlarSyntaxRaw },
                "math.md": { type: "file", content: kevlarMathRaw },
                "examples.md": { type: "file", content: kevlarExamplesRaw },
              },
            },
          },
        },
      },
    },
    etc: {
      type: "dir",
      children: {
        "orpheus.conf": { type: "file", content: "VERSION=2.0.0\nSHELL=Hazmat\nTHEME=default\nAUTHOR=Fyke\nMAX_LINES=70" },
      },
    },
    var: {
      type: "dir",
      children: {
        log: {
          type: "dir",
          children: {
            "terminal.log": { type: "file", content: "Hazmat Shell initialized\nSystem ready\nAwaiting commands..." },
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
      "--background": "oklch(0.08 0 0 / 0.78)",
      "--foreground": "oklch(0.96 0.08 60)",
      "--card": "oklch(0.12 0 0 / 0.84)",
      "--card-foreground": "oklch(0.96 0.08 60)",
      "--popover": "oklch(0.1 0 0 / 0.9)",
      "--popover-foreground": "oklch(0.96 0.08 60)",
      "--secondary": "oklch(0.25 0.05 60 / 0.78)",
      "--secondary-foreground": "oklch(0.96 0.08 60)",
      "--muted": "oklch(0.15 0 0 / 0.72)",
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
      content: "║       HAZMAT SHELL v1.0.0                  ║",
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
  const [isClosed, setIsClosed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useState<string>("default");
  const [simonThemeMode, setSimonThemeMode] = useState<"dark" | "light">("dark");
  const [isMounted, setIsMounted] = useState(false);
  const [multiLineBuffer, setMultiLineBuffer] = useState<string[]>([]);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const [fileSystem, setFileSystem] = useState<VirtualNode>(INITIAL_FS);
  const [currentDir, setCurrentDir] = useState("/home/orpheus");
  const [aliases, setAliases] = useState<Record<string, string>>({});
  const [isInOxygen, setIsInOxygen] = useState(false);
  const [oxygenFilename, setOxygenFilename] = useState<string>("untitled.kv");
  const [oxygenCode, setOxygenCode] = useState<string>("");
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        { type: "output", content: "  kevlar [expr]     - Kevlar v2 language:" },
        { type: "output", content: "                      Rust-like syntax, Dart-like simplicity" },
        { type: "output", content: "                      let, fn, if, for, while, match" },
        { type: "output", content: "                      Also supports legacy expressions" },
        { type: "output", content: "  oxygen [file.kv]  - Open O₂ Oxygen code editor" },
        { type: "output", content: "                      Multi-line editing + syntax highlight" },
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
    kevlar: {
      name: "kevlar",
      description: "Kevlar v2 — Rust-like syntax, Dart-like simplicity",
      execute: (args) => {
        if (args.length === 0 || args[0] === "--help" || args[0] === "docs") {
          return [
            { type: "output", content: "╔════════════════════════════════════════════════╗" },
            { type: "output", content: "║          KEVLAR v2 — EXPRESSION SHELL          ║" },
            { type: "output", content: "╚════════════════════════════════════════════════╝" },
            { type: "output", content: "" },
            { type: "output", content: "  Kevlar v2: Rust-like syntax, Dart simplicity" },
            { type: "output", content: "" },
            { type: "output", content: "Variables:" },
            { type: "output", content: "  let x = 42          // immutable" },
            { type: "output", content: "  let mut y = 0       // mutable" },
            { type: "output", content: "  var z = 10          // mutable (Dart-style)" },
            { type: "output", content: "" },
            { type: "output", content: "Types (optional):   let x: int = 42" },
            { type: "output", content: "Functions:          fn add(a, b) { a + b }" },
            { type: "output", content: "Arrow functions:    fn double(n) => n * 2" },
            { type: "output", content: "Control flow:       if / else if / else" },
            { type: "output", content: "Loops:              for i in 0..10 { ... }" },
            { type: "output", content: "                    for item in [1, 2, 3] { ... }" },
            { type: "output", content: "                    while cond { ... }" },
            { type: "output", content: "Match:              match x { 0 => ... }" },
            { type: "output", content: "Lists:              [1, 2, 3]" },
            { type: "output", content: "Strings:           \"Hello ${name}!\"" },
            { type: "output", content: "Print:             print(\"hello\")" },
            { type: "output", content: "" },
            { type: "output", content: "Legacy expressions still work:" },
            { type: "output", content: "  kevlar 2 + 3 * 4          → 14" },
            { type: "output", content: "  kevlar sqrt(144)          → 12" },
            { type: "output", content: "" },
            { type: "success", content: "Use 'oxygen' to open the code editor" },
            { type: "success", content: "Use 'cat kevlar/lesson.md' for the lesson index" },
            { type: "success", content: "Use 'ls kevlar/lessons' to browse guided lessons" },
            { type: "success", content: "Use 'cat kevlar/README.md' for reference" },
          ];
        }

        const input = args.join(" ");

        try {
          const result = kevlarRun(input);
          const lines: TerminalLine[] = [];

          if (result.output.length > 0) {
            for (const line of result.output) {
              lines.push({ type: "output", content: line });
            }
          }

          if (result.value !== null && result.value !== undefined && result.output.length === 0) {
            const displayVal = kevlarStringify(result.value);
            lines.push({ type: "output", content: `${displayVal} (${result.type})` });
          }

          return lines.length > 0 ? lines : [{ type: "output", content: "(done)" }];
        } catch {
          const v1Result = kevlarEval(input);
          if (isKevlarError(v1Result)) {
            return [{ type: "error", content: v1Result.message }];
          }
          if (v1Result.isAssignment) {
            return [{ type: "success", content: `${v1Result.varName} ${v1Result.varOp} ${v1Result.value} (${v1Result.type})` }];
          }
          if (v1Result.type === "string") {
            return [{ type: "output", content: `${v1Result.value} (${v1Result.type})` }];
          }
          return [{ type: "output", content: `${v1Result.input} = ${v1Result.value} (${v1Result.type})` }];
        }
      },
    },
    oxygen: {
      name: "oxygen",
      description: "Open the O₂ Oxygen code editor for Kevlar v2",
      execute: (args) => {
        const filename = args[0] ?? "untitled.kv";
        let initialCode = "";

        if (filename !== "untitled.kv") {
          const filePath = filename.startsWith("/") ? filename : currentDir + "/" + filename;
          const node = getNode(resolvePath(filePath));
          if (node && node.type === "file" && node.content) {
            initialCode = node.content;
          }
        }

        setOxygenFilename(filename);
        setOxygenCode(initialCode);
        setIsInOxygen(true);
        return [];
      },
    },
    docs: {
      name: "docs",
      description: "Show Kevlar v2 language documentation",
      execute: () => {
        const docs: TerminalLine[] = [
          { type: "output", content: "╔════════════════════════════════════════════════╗" },
          { type: "output", content: "║          KEVLAR v2 — LANGUAGE DOCS              ║" },
          { type: "output", content: "╚════════════════════════════════════════════════╝" },
          { type: "output", content: "" },
          { type: "output", content: "VARIABLES" },
          { type: "output", content: "  let x = 42          // immutable" },
          { type: "output", content: "  let mut y = 0       // mutable" },
          { type: "output", content: "  var z = 10          // mutable (Dart-style)" },
          { type: "output", content: "  let name: string = \"hazmat\"  // typed" },
          { type: "output", content: "" },
          { type: "output", content: "FUNCTIONS" },
          { type: "output", content: "  fn add(a, b) { a + b }" },
          { type: "output", content: "  fn double(n) => n * 2" },
          { type: "output", content: "  fn greet(name) { print(\"Hello, ${name}!\") }" },
          { type: "output", content: "" },
          { type: "output", content: "CONTROL FLOW" },
          { type: "output", content: "  if x > 10 { ... } else if x > 5 { ... } else { ... }" },
          { type: "output", content: "  for i in 0..10 { print(i) }" },
          { type: "output", content: "  for item in [1, 2, 3] { print(item) }" },
          { type: "output", content: "  while cond { ... }" },
          { type: "output", content: "" },
          { type: "output", content: "MATCH EXPRESSIONS" },
          { type: "output", content: "  match x { 0 => \"zero\"  1 => \"one\"  _ => \"many\" }" },
          { type: "output", content: "" },
          { type: "output", content: "LISTS" },
          { type: "output", content: "  [1, 2, 3]  nums[0]  len(nums)  push(nums, 4)" },
          { type: "output", content: "" },
          { type: "output", content: "STRINGS" },
          { type: "output", content: "  \"Hello ${name}!\"    // interpolation" },
          { type: "output", content: "  'also valid'         // single quotes" },
          { type: "output", content: "" },
          { type: "output", content: "OPERATORS" },
          { type: "output", content: "  + - * / % **   == != < > <= >=   && || !" },
          { type: "output", content: "  = += -= *= /= %=   .. (range)   => (fat arrow)" },
          { type: "output", content: "" },
          { type: "output", content: "BUILT-INS" },
          { type: "output", content: "  print(x)  len(l)  push(l,v)  pop(l)" },
          { type: "output", content: "  str(x)  int(x)  float(x)  type(x)" },
          { type: "output", content: "  sqrt abs ceil floor round sign trunc" },
          { type: "output", content: "  sin cos tan asin acos atan atan2" },
          { type: "output", content: "  exp log log2 log10 pow cbrt" },
          { type: "output", content: "  min max hypot  rand()  rand_int(a,b)" },
          { type: "output", content: "" },
          { type: "output", content: "CONSTANTS: PI E PHI TAU LN2 LN10 SQRT2" },
          { type: "output", content: "" },
          { type: "output", content: "COMMENTS: // like this" },
          { type: "output", content: "" },
          { type: "success", content: "Type 'oxygen' to open the code editor" },
          { type: "success", content: "Type 'cat kevlar/lesson.md' for the lesson index" },
          { type: "success", content: "Type 'ls kevlar/lessons' to browse guided lessons" },
          { type: "success", content: "Type 'cat kevlar/README.md' for quick start" },
        ];
        return docs;
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
        output.push({ type: "output", content: `  Terminal    HAZMAT SHELL v1.0.0` });
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

    // Special-case: allow full logical/assignment expressions inside kevlar without splitting on && or ||
    const firstToken = trimmed.split(/\s+/)[0]?.toLowerCase();
    if (firstToken === "kevlar") {
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

    // Special-case: allow full logical/assignment expressions inside kevlar without splitting on && or ||
    const firstToken = trimmed.split(/\s+/)[0]?.toLowerCase();
    if (firstToken === "kevlar") {
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

  const handleReset = () => {
    setLines([
      {
        type: "success",
        content:
          "╔════════════════════════════════════════════════╗",
      },
      {
        type: "success",
        content:
          "║       HAZMAT SHELL v1.0.0                  ║",
      },
      {
        type: "success",
        content:
          "╚════════════════════════════════════════════════╝",
      },
      {
        type: "output",
        content: "Type 'help' to see available commands.",
      },
    ]);
    setInput("");
    setMultiLineBuffer([]);
    setIsMultiLine(false);
    setShowMenu(false);
  };

  const handleCopy = async () => {
    const text = lines.map((l) => l.content).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      addLines([
        {
          type: "success",
          content: "Terminal output copied to clipboard.",
        },
      ]);
    } catch {
      addLines([
        { type: "error", content: "Failed to copy to clipboard." },
      ]);
    }
    setShowMenu(false);
  };

  if (isClosed) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsClosed(false)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 border-4 border-border bg-card px-4 py-3 shadow-[4px_4px_0_var(--border)] transition-colors hover:bg-primary/10"
        aria-label="Open terminal"
      >
        <Terminal className="size-5 text-primary" />
        <span className="retro hidden text-xs uppercase tracking-[0.2em] text-foreground sm:inline">
          HAZMAT SHELL
        </span>
      </motion.button>
    );
  }

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
            HAZMAT SHELL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Restore" : "Minimize"}
            className="group relative rounded-none border-2 border-border bg-background p-2 shadow-[2px_2px_0_var(--border)] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--primary)] active:translate-y-0 active:shadow-[1px_1px_0_var(--border)]"
            aria-label={isMinimized ? "Restore terminal" : "Minimize terminal"}
          >
            <Minimize2 className="size-4 text-foreground transition-colors group-hover:text-primary" />
          </button>
          <button
            type="button"
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? "Restore" : "Maximize"}
            className="group relative rounded-none border-2 border-border bg-background p-2 shadow-[2px_2px_0_var(--border)] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--primary)] active:translate-y-0 active:shadow-[1px_1px_0_var(--border)]"
            aria-label={isMaximized ? "Restore terminal" : "Maximize terminal"}
          >
            <Maximize2 className="size-4 text-foreground transition-colors group-hover:text-primary" />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              title="More options"
              className={cn(
                "group relative rounded-none border-2 border-border bg-background p-2 shadow-[2px_2px_0_var(--border)] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--primary)] active:translate-y-0 active:shadow-[1px_1px_0_var(--border)]",
                showMenu && "-translate-y-0.5 shadow-[3px_3px_0_var(--primary)]"
              )}
              aria-label="More options"
              aria-expanded={showMenu}
            >
              <MoreHorizontal className="size-4 text-foreground transition-colors group-hover:text-primary" />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-48 border-2 border-border bg-card shadow-[4px_4px_0_var(--border)]"
                >
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-primary/10"
                  >
                    <RotateCcw className="size-4 text-muted-foreground" />
                    <span className="retro">Reset Terminal</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-primary/10"
                  >
                    <Copy className="size-4 text-muted-foreground" />
                    <span className="retro">Copy Output</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={() => setIsClosed(true)}
            title="Close"
            className="group relative rounded-none border-2 border-border bg-background p-2 shadow-[2px_2px_0_var(--border)] transition-all hover:-translate-y-0.5 hover:border-red-500 hover:shadow-[3px_3px_0_#ef4444] active:translate-y-0 active:shadow-[1px_1px_0_var(--border)]"
            aria-label="Close terminal"
          >
            <X className="size-4 text-foreground transition-colors group-hover:text-red-500" />
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
            {isInOxygen ? (
              <div className={cn(isMaximized ? "h-[calc(100vh-8rem)]" : "h-96")}>
                <OxygenEditor
                  initialCode={oxygenCode}
                  filename={oxygenFilename}
                  onRun={(code) => {
                    try {
                      const result = kevlarRun(code);
                      return { output: result.output, value: kevlarStringify(result.value), type: result.type };
                    } catch (err) {
                      return {
                        output: [],
                        value: "",
                        type: "error",
                        error: err instanceof Error ? err.message : String(err),
                      };
                    }
                  }}
                  onSave={(filename, code) => {
                    const filePath = filename.startsWith("/") ? filename : currentDir + "/" + filename;
                    setNode(filePath, { type: "file", content: code });
                    addLines([{ type: "success", content: `Saved: ${filename}` }]);
                  }}
                  onQuit={() => {
                    setIsInOxygen(false);
                    addLines([{ type: "success", content: "Exited Oxygen editor" }]);
                  }}
                />
              </div>
            ) : (
            <>
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
            </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default RetroTerminal;
