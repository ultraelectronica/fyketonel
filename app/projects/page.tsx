"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/8bit/accordion";
import { Badge } from "@/components/ui/8bit/badge";
import { Button } from "@/components/ui/8bit/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/8bit/carousel";
import { cn } from "@/lib/utils";
import RetroTerminal from "@/components/retro-terminal";

const tierOrder = ["S", "A", "B", "C", "D"] as const;

type Tier = (typeof tierOrder)[number];

const getTierPriority = (tier: Tier) => tierOrder.indexOf(tier);

type ProjectEntry = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  detail: string;
  link?: string;
  tech: string[];
  classification: {
    tier: Tier;
    codename: string;
    status: string;
    priority: number;
  };
  highlights: string[];
  images?: {
    src: string;
    alt: string;
  }[];
  placeholder?: {
    title: string;
    caption?: string;
  };
};

const projects: ProjectEntry[] = [
  {
    id: "fykes-laboratory",
    title: "Fyke's Laboratory",
    tagline: "This portfolio",
    description:
      "My current laboratory and playground—what you're browsing and tinkering with right now.",
    detail: "fykesimon.vercel.app",
    link: "https://fykesimon.vercel.app",
    tech: ["React", "TypeScript", "Next.js", "Vercel"],
    classification: {
      tier: "B",
      codename: "Living Exhibit",
      status: "Active specimen in production",
      priority: getTierPriority("B"),
    },
    highlights: [
      "Retro control center ties navigation, contact, and telemetry together.",
      "Built for rapid iteration with live deployments through Vercel.",
      "Every pixel is calibrated for an arcade-laboratory mashup aesthetic.",
    ],
    placeholder: {
      title: "You are in my laboratory right now.",
      caption: "Diagnostics paused while the exhibit is live.",
    },
  },
  {
    id: "pasada-passenger-app",
    title: "Pasada Passenger App",
    tagline: "Ride-hailing for Bayan ⇄ Malinta commuters",
    description:
      "A ride-hailing mobile application tailored for passengers of modernized jeepneys in the Philippines.",
    detail:
      "Ride-hailing features such as online booking, passenger capacity tracking, traffic data analytics, AI suggestions, weather alert, heavy traffic alert, etc.",
    tech: [
      "Flutter",
      "Dart",
      "TypeScript",
      "JavaScript",
      "SQL",
      "PL/pgSQL",
      "Supabase",
      "GCP",
      "Resend",
      "Firebase",
    ],
    classification: {
      tier: "S",
      codename: "Prime Directive",
      status: "Flagship commuter experience",
      priority: getTierPriority("S"),
    },
    highlights: [
      "End-to-end booking for the Bayan ⇄ Malinta route with live vehicle telemetry.",
      "Passenger capacity tracking keeps riders informed before they even hail.",
      "Traffic, weather, and AI-driven suggestions keep commuters proactive.",
      "Deep personal ownership—my most hands-on build across stack layers.",
    ],
    images: [
      {
        src: "/ProjectPictures/Pasada/Screenshot_20251025-002908.png",
        alt: "Pasada passenger booking flow",
      },
      {
        src: "/ProjectPictures/Pasada/Screenshot_20251025-004748.png",
        alt: "Pasada passenger capacity tracker",
      },
      {
        src: "/ProjectPictures/Pasada/Screenshot_20251025-004824.png",
        alt: "Pasada passenger AI suggestions",
      },
      {
        src: "/ProjectPictures/Pasada/Screenshot_20251025-005031.png",
        alt: "Pasada passenger analytics screen",
      },
    ],
  },
  {
    id: "pasada-driver-app",
    title: "Pasada Driver App",
    tagline: "Operational companion for modernized jeepney pilots",
    description:
      "The driver-facing application used for pick-ups, drop-offs, and quota tracking.",
    detail:
      "Not my main build originally, but I maintain it to keep operations smooth with the right UX for the drivers.",
    tech: [
      "Flutter",
      "Dart",
      "TypeScript",
      "JavaScript",
      "SQL",
      "PL/pgSQL",
      "Supabase",
      "GCP",
      "Resend",
      "Firebase",
    ],
    classification: {
      tier: "A",
      codename: "Field Ops Kit",
      status: "Maintained with driver-first UX",
      priority: getTierPriority("A"),
    },
    highlights: [
      "Streamlines pickups, drop-offs, and quota progress for each shift.",
      "Shares a contract with the passenger app for real-time sync.",
      "My attention goes into polishing the UX so drivers stay focused.",
    ],
    images: [
      {
        src: "/ProjectPictures/Pasada Driver/Screenshot_20251018_222759.jpg",
        alt: "Pasada driver manifest view",
      },
      {
        src: "/ProjectPictures/Pasada Driver/Screenshot_20251025_001652.jpg",
        alt: "Pasada driver trip controls",
      },
      {
        src: "/ProjectPictures/Pasada Driver/Screenshot_20251025_001728.jpg",
        alt: "Pasada driver capacity summary",
      },
      {
        src: "/ProjectPictures/Pasada Driver/Screenshot_20251025_002350.jpg",
        alt: "Pasada driver quota tracking",
      },
    ],
  },
  {
    id: "pasada-admin",
    title: "Pasada Admin",
    tagline: "Fleet brain for the cooperative",
    description:
      "The admin website for the cooperative—think Fleet Management System but tuned for their actual workflows.",
    detail:
      "Covers member management, vehicle oversight, quota tracking, and advanced booking + traffic analytics with forecasting.",
    tech: [
      "Flutter",
      "Dart",
      "TypeScript",
      "JavaScript",
      "SQL",
      "PL/pgSQL",
      "Supabase",
      "GCP",
      "Resend",
      "Firebase",
      "Vercel",
      "Porkbun",
      "Cloudflare",
    ],
    classification: {
      tier: "S",
      codename: "Command Deck",
      status: "Mission control for Pasada",
      priority: getTierPriority("S"),
    },
    highlights: [
      "Single pane for admins to manage members, vehicles, and quotas.",
      "Seven-day analytics plus forecasting keep ops future-ready.",
      "Yes—built entirely in Flutter for web, on purpose.",
    ],
    images: [
      {
        src: "/ProjectPictures/Pasada Admin/Screenshot_20251025_010458.png",
        alt: "Pasada admin dashboard",
      },
      {
        src: "/ProjectPictures/Pasada Admin/Screenshot_20251025_010504.png",
        alt: "Pasada admin member list",
      },
      {
        src: "/ProjectPictures/Pasada Admin/Screenshot_20251025_010516.png",
        alt: "Pasada admin vehicle config",
      },
      {
        src: "/ProjectPictures/Pasada Admin/Screenshot_20251025_010903.png",
        alt: "Pasada admin analytics",
      },
    ],
  },
  {
    id: "pasada-official-website",
    title: "Pasada Official Website",
    tagline: "Public-facing showcase & booking tracker",
    description:
      "The official marketing and information site for Pasada, combining brand storytelling with live booking context.",
    detail:
      "Showcases the cooperative, highlights booking tracking, and keeps contact paths obvious.",
    link: "https://pasadapp.com",
    tech: [
      "React",
      "TypeScript",
      "Next.js",
      "MapLibre GL JS",
      "OpenStreetMap",
      "Vercel",
      "Supabase",
      "Three.js",
      "Anime.js",
      "R3F",
    ],
    classification: {
      tier: "A",
      codename: "Beacon Site",
      status: "Always-on communication channel",
      priority: getTierPriority("A"),
    },
    highlights: [
      "Hero storytelling that funnels riders and partners quickly.",
      "3D flourishes with R3F + Anime.js for an animated brand hit.",
      "Hooks into booking and contact flows without getting in the way.",
    ],
    images: [
      {
        src: "/ProjectPictures/Pasada Website/Screenshot_20251122_020943.png",
        alt: "Pasada website hero",
      },
      {
        src: "/ProjectPictures/Pasada Website/Screenshot_20251122_020952.png",
        alt: "Pasada website booking tracker",
      },
      {
        src: "/ProjectPictures/Pasada Website/Screenshot_20251122_021002.png",
        alt: "Pasada website sections",
      },
      {
        src: "/ProjectPictures/Pasada Website/Screenshot_20251122_021011.png",
        alt: "Pasada website contact module",
      },
    ],
  },
  {
    id: "project-fyke",
    title: "Project Fyke",
    tagline: "Old portfolio (built in two hours)",
    description:
      "My previous portfolio—spun up in the middle of the night with momentum and stubbornness.",
    detail:
      "React + TypeScript + Remix deployed to Vercel, serving as the warm-up to this current lab.",
    link: "https://fyketonel.vercel.app",
    tech: ["React", "TypeScript", "Vercel", "Remix"],
    classification: {
      tier: "C",
      codename: "Legacy Vial",
      status: "Archived but referenced",
      priority: getTierPriority("C"),
    },
    highlights: [
      "Rapid-build energy in under two hours.",
      "Remix routing experiment that still informs current flows.",
      "Kept online as a time capsule of the vibe back then.",
    ],
    images: [
      {
        src: "/ProjectPictures/ProjectFyke/Screenshot_20251122_021443.png",
        alt: "Project Fyke landing section",
      },
      {
        src: "/ProjectPictures/ProjectFyke/Screenshot_20251122_021447.png",
        alt: "Project Fyke about section",
      },
      {
        src: "/ProjectPictures/ProjectFyke/Screenshot_20251122_021454.png",
        alt: "Project Fyke projects list",
      },
      {
        src: "/ProjectPictures/ProjectFyke/Screenshot_20251122_021458.png",
        alt: "Project Fyke contact section",
      },
    ],
  },
  {
    id: "appointment-scheduler",
    title: "Appointment Scheduler",
    tagline: "Pocket scheduling with offline focus",
    description:
      "A scheduler mobile application that runs fully offline with local storage and local notifications.",
    detail: "Built in Java with SQLite for data persistence.",
    tech: ["Java", "SQLite"],
    classification: {
      tier: "C",
      codename: "Pocket Lab",
      status: "Utility experiment",
      priority: getTierPriority("C"),
    },
    highlights: [
      "Local storage so appointments stay even without signal.",
      "Native notifications keep reminders punctual.",
      "Straightforward UI—made to get out of the way.",
    ],
    images: [
      {
        src: "/ProjectPictures/Appointment/Screenshot_20251122-015025.png",
        alt: "Appointment scheduler list view",
      },
      {
        src: "/ProjectPictures/Appointment/Screenshot_20251122-015027.png",
        alt: "Appointment scheduler detail",
      },
      {
        src: "/ProjectPictures/Appointment/Screenshot_20251122-015115.png",
        alt: "Appointment scheduler notifications",
      },
    ],
  },
  {
    id: "locker-app",
    title: "LockerApp",
    tagline: "Secure media vault",
    description:
      "Locker is a secure, simple media-hiding application built with Flutter.",
    detail:
      "Protects photos, videos, and documents behind a password-protected screen.",
    tech: ["Flutter", "Dart"],
    classification: {
      tier: "C",
      codename: "Vault Specimen",
      status: "Steady guardian build",
      priority: getTierPriority("C"),
    },
    highlights: [
      "Encrypts media behind a pin guard.",
      "Keeps the UI intentionally minimal for stealth usage.",
      "Focused on privacy for images, videos, and docs.",
    ],
    images: [
      {
        src: "/ProjectPictures/Locker/Screenshot_20251122-013936.png",
        alt: "Locker app lock screen",
      },
      {
        src: "/ProjectPictures/Locker/Screenshot_20251122-013947.png",
        alt: "Locker app gallery view",
      },
      {
        src: "/ProjectPictures/Locker/Screenshot_20251122-014038.png",
        alt: "Locker app media detail",
      },
    ],
  },
  {
    id: "simple-calculator",
    title: "A Simple Calculator",
    tagline: "Calculator with history",
    description: "A straightforward calculator with a running history log.",
    detail: "Built to stay offline-friendly using Java and SQLite.",
    tech: ["Java", "SQLite"],
    classification: {
      tier: "D",
      codename: "Arcade Relic",
      status: "Utility classic",
      priority: getTierPriority("D"),
    },
    highlights: [
      "Keeps a scrollable history of computations.",
      "Offline logic—no network needed to crunch numbers.",
      "Exact and tidy UI for zero distraction.",
    ],
    placeholder: {
      title: "Question block engaged.",
      caption: "Reference hardware not photographed yet!",
    },
  },
  {
    id: "building-blocks",
    title: "Building Blocks",
    tagline: "Tower Bloxx-inspired stacking game",
    description:
      "A stacking game inspired by Tower Bloxx with a local leaderboard.",
    detail: "Built with C#, SQLite, and Unity.",
    tech: ["C#", "SQLite", "Unity"],
    classification: {
      tier: "D",
      codename: "Arcade Relic",
      status: "Playable prototype",
      priority: getTierPriority("D"),
    },
    highlights: [
      "Physics-infused stacking loop tuned for mobile.",
      "Local leaderboards keep the competition couch-side.",
      "Unity build with chunky retro gradients.",
    ],
    images: [
      {
        src: "/ProjectPictures/BuildingBlocks/Screenshot_2025-10-28-20-44-13-06_4b2dce15a5ce964567536827aa910b84.jpg",
        alt: "Building Blocks gameplay 1",
      },
      {
        src: "/ProjectPictures/BuildingBlocks/Screenshot_2025-10-28-20-44-34-32_4b2dce15a5ce964567536827aa910b84.jpg",
        alt: "Building Blocks gameplay 2",
      },
      {
        src: "/ProjectPictures/BuildingBlocks/Screenshot_2025-10-28-20-44-46-65_4b2dce15a5ce964567536827aa910b84.jpg",
        alt: "Building Blocks combo streak",
      },
      {
        src: "/ProjectPictures/BuildingBlocks/Screenshot_2025-10-28-20-45-46-96_4b2dce15a5ce964567536827aa910b84.jpg",
        alt: "Building Blocks local leaderboard",
      },
    ],
  },
  {
    id: "live-calendar",
    title: "Live Calendar",
    tagline: "Timezone-aware clock",
    description:
      "A simple live calendar that strictly follows the user's timezone based on location.",
    detail: "Crafted with vanilla HTML, CSS, and JavaScript.",
    tech: ["HTML", "CSS", "JavaScript"],
    classification: {
      tier: "C",
      codename: "Pocket Lab",
      status: "Always-on utility",
      priority: getTierPriority("C"),
    },
    highlights: [
      "Auto-detects timezone to keep the clock honest.",
      "Minimal UI for embedding anywhere.",
      "Runs on vanilla web tech—no heavy bundle.",
    ],
    images: [
      {
        src: "/ProjectPictures/LiveCalendar/Screenshot_20251122_014142.png",
        alt: "Live Calendar main view",
      },
      {
        src: "/ProjectPictures/LiveCalendar/Screenshot_20251122_014147.png",
        alt: "Live Calendar timezone detail",
      },
      {
        src: "/ProjectPictures/LiveCalendar/Screenshot_20251122_014151.png",
        alt: "Live Calendar responsive view",
      },
    ],
  },
];

const classificationLegend: {
  tier: Tier;
  label: string;
  description: string;
  gradient: string;
}[] = [
  {
    tier: "S",
    label: "Prime Directive",
    description: "Mission-critical Pasada platforms powering commuters.",
    gradient: "from-yellow-600 via-orange-600 to-red-700",
  },
  {
    tier: "A",
    label: "Field Ops",
    description: "Operational layers that keep Pasada visible and synced.",
    gradient: "from-lime-600 via-emerald-600 to-green-700",
  },
  {
    tier: "B",
    label: "Living Exhibit",
    description: "Active builds you're currently exploring.",
    gradient: "from-sky-600 via-cyan-600 to-blue-700",
  },
  {
    tier: "C",
    label: "Pocket Labs",
    description: "Utility experiments and mobile helpers.",
    gradient: "from-purple-600 via-fuchsia-600 to-pink-700",
  },
  {
    tier: "D",
    label: "Arcade Relics",
    description: "Retro mini-builds and prototypes revisited for fun.",
    gradient: "from-zinc-600 via-slate-600 to-stone-700",
  },
];

const LabSpecimenScanner = () => (
  <motion.div
    className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Primary scan line */}
    <motion.div
      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_8px_var(--primary),0_0_16px_var(--primary)]"
      initial={{ top: "0%", opacity: 0 }}
      animate={{
        top: ["0%", "100%"],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.2,
        ease: "easeInOut",
        times: [0, 0.1, 0.9, 1],
      }}
    />
    {/* Secondary scan line (offset) */}
    <motion.div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      initial={{ top: "0%", opacity: 0 }}
      animate={{
        top: ["0%", "100%"],
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{
        duration: 1.2,
        ease: "easeInOut",
        times: [0, 0.1, 0.9, 1],
        delay: 0.1,
      }}
    />
    {/* Scan field overlay */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.4, 0] }}
      transition={{
        duration: 1.2,
        ease: "easeInOut",
      }}
    />
    {/* Grid overlay effect */}
    <motion.div
      className="absolute inset-0 bg-[linear-gradient(transparent_calc(100%_-_1px),rgba(var(--primary-rgb,147,51,234),0.1)_1px)] bg-[length:100%_4px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.3, 0] }}
      transition={{
        duration: 1.2,
        ease: "easeInOut",
      }}
    />
  </motion.div>
);

const QuestionMarkBlock = ({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}) => (
  <div className="relative flex h-full min-h-[260px] w-full flex-col items-center justify-center overflow-hidden rounded-sm border-4 border-amber-500 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 text-center text-amber-900 shadow-[0_0_0_4px_rgba(0,0,0,0.25),inset_0_-12px_0_rgba(0,0,0,0.15)]">
    <span className="retro text-7xl drop-shadow-[0_6px_0_rgba(0,0,0,0.35)]">?</span>
    <p className="retro mt-4 max-w-xs text-[0.6rem] uppercase tracking-[0.2em]">
      {title}
    </p>
    {caption ? (
      <p className="retro mt-2 px-4 text-[0.55rem] text-amber-800">
        {caption}
      </p>
    ) : null}
    <span
      aria-hidden
      className="absolute left-3 top-3 size-3 rounded-sm bg-amber-400 shadow-[0_2px_0_rgba(0,0,0,0.3)]"
    />
    <span
      aria-hidden
      className="absolute right-3 top-3 size-3 rounded-sm bg-amber-400 shadow-[0_2px_0_rgba(0,0,0,0.3)]"
    />
    <span
      aria-hidden
      className="absolute left-3 bottom-3 size-3 rounded-sm bg-amber-400 shadow-[0_2px_0_rgba(0,0,0,0.3)]"
    />
    <span
      aria-hidden
      className="absolute right-3 bottom-3 size-3 rounded-sm bg-amber-400 shadow-[0_2px_0_rgba(0,0,0,0.3)]"
    />
  </div>
);

type TierFilter = Tier | "ALL";

const motivationalQuotes = [
  "Code is poetry in motion.",
  "Debugging is the art of removing bugs you didn't know you had.",
  "Keep calm and push to production.",
  "Coffee: because adulting is hard.",
  "There's no place like 127.0.0.1",
  "I speak fluent sarcasm and code.",
  "Ctrl+Z is my superpower.",
  "Sleep is for the weak... or well-rested.",
  "In code we trust.",
  "May your builds be green and your coffee be strong.",
  "Syntax errors are just happy little accidents.",
  "If at first you don't succeed, call it version 1.0",
  "I don't always test my code, but when I do, I do it in production.",
  "Programmer (noun): a machine that turns coffee into code.",
  "Reality is just a poorly implemented simulation.",
];

const labNotes = [
  "This one kept me up for 3 days straight.",
  "My obra maestra, a work of art.",
  "Dealing with the UX devil himself.",
  "My magnum opus 🎨",
  "Fueled entirely by coffee and spite",
  "Started at 3 AM, finished at 3 AM (next day)",
  "\"It's just a small change\" they said... 1st project that worked.",
  "Debugged this for longer than I built it",
  "Random 3 AM motivation.",
  "A short practice for the codefest.",
  "Peak programming flow achieved here",
  "Made me question my career choices",
  "Client loved it. I'm still confused.",
  "This shouldn't work... but it does 🤷",
  "Refactored 6 times. Still not happy.",
  "The documentation is lying",
  "Future me will hate past me for this",
  "Stack Overflow saved my life here",
  "Wrote this on a plane with no WiFi",
  "The deadline was yesterday",
  "Best code I've ever written (no cap)",
  "I was too tired to give up",
  "Worth every hour of sleep I lost",
  "Client said 'make it pop' 💥",
];

const StickyNote = ({ note, index }: { note: string; index: number }) => {
  // Randomize sticky note colors and rotations
  const colors = [
    "bg-yellow-200 dark:bg-yellow-600",
    "bg-pink-200 dark:bg-pink-600",
    "bg-blue-200 dark:bg-blue-600",
    "bg-green-200 dark:bg-green-600",
    "bg-purple-200 dark:bg-purple-600",
  ];
  
  const rotations = ["rotate-2", "-rotate-2", "rotate-1", "-rotate-1", "rotate-3", "-rotate-3"];
  
  const color = colors[index % colors.length];
  const rotation = rotations[index % rotations.length];

  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute -top-2 left-1/2 z-20 w-48 -translate-x-1/2 p-3 shadow-lg",
        color,
        rotation
      )}
      initial={{ opacity: 0, y: 10, scale: 0.8 }}
      animate={{ opacity: 1, y: -10, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.9 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
      }}
    >
      {/* Tape effect */}
      <div className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 bg-white/40 dark:bg-white/20" 
        style={{ 
          clipPath: "polygon(0 20%, 100% 20%, 100% 80%, 0 80%)",
        }}
      />
      
      <p className="retro text-center text-[0.5rem] leading-relaxed text-gray-800 dark:text-gray-200">
        {note}
      </p>
      
      {/* Paper texture lines */}
      <div className="absolute inset-x-3 top-8 space-y-2 opacity-20">
        <div className="h-px bg-gray-600" />
        <div className="h-px bg-gray-600" />
        <div className="h-px bg-gray-600" />
      </div>
    </motion.div>
  );
};

const RetroVisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState("0000000");
  const [displayMode, setDisplayMode] = useState<"decimal" | "binary" | "hex">("decimal");

  useEffect(() => {
    // Generate ridiculous numbers that keep incrementing
    const counterInterval = setInterval(() => {
      const modes = ["decimal", "binary", "hex"] as const;
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      setDisplayMode(randomMode);

      // Generate absurd numbers
      const absurdNumbers = [
        "9999999", // Over 9 million!
        "1337420", // Leet + meme
        "8008135", // Classic calculator
        "4242424", // The answer times many
        "6660666", // Spooky
        "1234567", // Sequential
        "7777777", // Lucky
        "0000001", // Just started (obviously fake)
        "9876543", // Reverse
        "5318008", // Classic upside-down calculator
        "1111111", // All ones
        "3141592", // Pi
        "2718281", // e
        "1618033", // Golden ratio
        "8675309", // Jenny's number
      ];

      const randomNumber = absurdNumbers[Math.floor(Math.random() * absurdNumbers.length)];
      
      if (randomMode === "binary") {
        // Convert to binary and pad
        const num = parseInt(randomNumber);
        setVisitorCount(num.toString(2).padStart(24, "0"));
      } else if (randomMode === "hex") {
        // Convert to hex and pad
        const num = parseInt(randomNumber);
        setVisitorCount("0x" + num.toString(16).toUpperCase().padStart(7, "0"));
      } else {
        setVisitorCount(randomNumber);
      }
    }, 3000);

    return () => clearInterval(counterInterval);
  }, []);

  const getLabel = () => {
    switch (displayMode) {
      case "binary":
        return "Visitors (Binary)";
      case "hex":
        return "Visitors (Hexadecimal)";
      default:
        return "Total Lab Visitors";
    }
  };

  return (
    <motion.div
      className="mx-auto w-full max-w-xl px-3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={cn(
        "rounded-none border-4 border-border p-3 shadow-[4px_4px_0_var(--border)]",
        "bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400 dark:border-ring dark:from-yellow-700 dark:via-yellow-800 dark:to-yellow-900",
        // Override for Ally theme
        "theme-ally:bg-gradient-to-b theme-ally:from-white theme-ally:via-white theme-ally:to-gray-100"
      )}>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <motion.span
              className="text-lg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🎉
            </motion.span>
            <p className={cn(
              "retro text-center text-[0.5rem] uppercase tracking-[0.25em]",
              "text-yellow-900 dark:text-yellow-200",
              // Override for Ally theme
              "theme-ally:text-pink-500"
            )}>
              {getLabel()}
            </p>
            <motion.span
              className="text-lg"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              🎊
            </motion.span>
          </div>
          
          <div className={cn(
            "rounded-sm border-2 border-yellow-800 bg-black px-4 py-2 dark:border-yellow-400",
            // Override for Ally theme
            "theme-ally:border-pink-300 theme-ally:bg-white"
          )}>
            <div className="max-w-full overflow-x-auto">
              <motion.div
                key={visitorCount}
                className={cn(
                  "retro mx-auto text-center font-mono text-xl tabular-nums sm:text-2xl md:text-3xl",
                  // Override for Ally theme
                  "theme-ally:text-pink-500 theme-ally:drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"
                )}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  color: "var(--visitor-counter, oklch(0.6 0.25 140))",
                  textShadow: "0 0 10px var(--visitor-counter, oklch(0.6 0.25 140) / 0.8), 0 0 20px var(--visitor-counter, oklch(0.6 0.25 140) / 0.4)",
                  letterSpacing: displayMode === "binary" ? "0.08em" : "0.18em",
                  fontSize: displayMode === "binary" ? "0.7rem" : undefined,
                  wordBreak: "break-all",
                  whiteSpace: "nowrap",
                }}

              >
                {visitorCount}
              </motion.div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1">
            <motion.span
              className="inline-block size-1.5 rounded-full bg-red-600"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="retro text-center text-[0.4rem] italic text-yellow-900 dark:text-yellow-300">
              {displayMode === "binary" 
                ? "Counting in machine language..." 
                : displayMode === "hex"
                ? "Elite hacker mode enabled"
                : "You are visitor number [REDACTED]"}
            </p>
            <motion.span
              className="inline-block size-1.5 rounded-full bg-red-600"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
            />
          </div>
        </div>

        {/* Fake "since 1996" badge */}
        <div className="mt-2 border-t-2 border-dashed border-yellow-800 pt-2 dark:border-yellow-400">
          <div className="flex items-center justify-center gap-2 text-[0.4rem] text-yellow-900 dark:text-yellow-300">
            <span className="retro">EST. 1996</span>
            <span>•</span>
            <span className="retro">GEOCITIES CERTIFIED</span>
            <span>•</span>
            <motion.span
              className="retro"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              UNDER CONSTRUCTION
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RetroLoadingScreen = ({ tier }: { tier: string }) => {
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);

  const loadingMessages = useMemo(
    () => [
      `ACCESSING TIER ${tier} ARCHIVES...`,
      "CALIBRATING SPECIMEN FILTERS...",
      "ESTABLISHING SECURE CONNECTION...",
      "DECRYPTING DATABASE RECORDS...",
      `LOADING TIER ${tier} PROJECTS...`,
    ],
    [tier]
  );

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 30);

    // Phase changes
    const phaseInterval = setInterval(() => {
      setLoadingPhase((prev) => (prev + 1) % loadingMessages.length);
    }, 400);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, [tier, loadingMessages.length]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-full max-w-md space-y-6 px-4">
        {/* Terminal-style header */}
        <div className="rounded-sm border-2 border-primary bg-background p-4 shadow-[0_0_30px_var(--primary)]">
          {/* Blinking cursor line */}
          <div className="mb-4 flex items-center gap-2 border-b-2 border-dashed border-border pb-2">
            <span className="retro text-xs uppercase tracking-[0.2em] text-primary">
              LAB ARCHIVE SYSTEM
            </span>
            <motion.span
              className="inline-block size-2 bg-primary"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </div>

          {/* Loading messages */}
          <div className="space-y-2">
            {loadingMessages.map((msg, index) => (
              <motion.div
                key={msg}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: index <= loadingPhase ? 1 : 0.3,
                  x: 0,
                }}
                transition={{ delay: index * 0.1 }}
              >
                {index < loadingPhase && (
                  <span className="retro text-green-500">✓</span>
                )}
                {index === loadingPhase && (
                  <motion.span
                    className="retro text-primary"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    ▶
                  </motion.span>
                )}
                {index > loadingPhase && (
                  <span className="retro text-muted-foreground">○</span>
                )}
                <span
                  className={`retro text-[0.55rem] uppercase tracking-[0.15em] ${
                    index === loadingPhase
                      ? "text-foreground"
                      : index < loadingPhase
                      ? "text-muted-foreground line-through"
                      : "text-muted-foreground/50"
                  }`}
                >
                  {msg}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">
                Progress
              </span>
              <span className="retro text-[0.5rem] tabular-nums text-primary">
                {progress}%
              </span>
            </div>

            {/* Pixel art progress bar */}
            <div className="relative h-6 overflow-hidden rounded-sm border-2 border-border bg-background dark:border-ring">
              {/* Background grid pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(var(--primary-rgb,147,51,234),0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary-rgb,147,51,234),0.3) 1px, transparent 1px)",
                  backgroundSize: "4px 4px",
                }}
              />

              {/* Progress fill with pixel effect */}
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/80 to-primary"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              >
                {/* Animated scanline */}
                <motion.div
                  className="absolute inset-y-0 w-1 bg-white/50"
                  animate={{ x: ["0%", "100%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Pixel blocks */}
                <div className="flex h-full items-center gap-0.5 px-1">
                  {Array.from({ length: Math.floor(progress / 5) }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="size-1 bg-white/30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Status indicators */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                <motion.div
                  className="size-2 rounded-full bg-green-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="retro text-[0.45rem] uppercase tracking-wider text-green-600 dark:text-green-400">
                  System Active
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="size-1 bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Warning label */}
        <motion.div
          className="flex items-center justify-center gap-2"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="retro text-[0.45rem] uppercase tracking-[0.3em] text-primary">
            Do Not Interrupt
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/50" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProjectDependenciesGraph = ({
  projects,
  panelClass,
}: {
  projects: ProjectEntry[];
  panelClass: string;
}) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // Define project relationships
  const relationships = useMemo(() => {
    const relations: Array<{
      from: string;
      to: string;
      type: "parent" | "sibling" | "related";
      description: string;
    }> = [];

    // Pasada ecosystem connections
    const pasadaProjects = projects.filter((p) =>
      p.title.toLowerCase().includes("pasada")
    );

    if (pasadaProjects.length > 1) {
      // Admin connects to all Pasada apps
      const admin = pasadaProjects.find((p) => p.title.includes("Admin"));
      const passenger = pasadaProjects.find((p) => p.title.includes("Passenger"));
      const driver = pasadaProjects.find((p) => p.title.includes("Driver"));
      const website = pasadaProjects.find((p) => p.title.includes("Website"));

      if (admin && passenger) {
        relations.push({
          from: admin.id,
          to: passenger.id,
          type: "parent",
          description: "Manages user data & analytics",
        });
      }
      if (admin && driver) {
        relations.push({
          from: admin.id,
          to: driver.id,
          type: "parent",
          description: "Fleet & quota management",
        });
      }
      if (passenger && driver) {
        relations.push({
          from: passenger.id,
          to: driver.id,
          type: "sibling",
          description: "Real-time ride coordination",
        });
      }
      if (website && passenger) {
        relations.push({
          from: website.id,
          to: passenger.id,
          type: "related",
          description: "Booking status tracking",
        });
      }
      if (website && driver) {
        relations.push({
          from: website.id,
          to: driver.id,
          type: "related",
          description: "Driver info & updates",
        });
      }
      if (website && admin) {
        relations.push({
          from: website.id,
          to: admin.id,
          type: "related",
          description: "Public data display",
        });
      }
    }

    // Portfolio lineage
    const oldPortfolio = projects.find((p) => p.id === "project-fyke");
    const currentPortfolio = projects.find((p) => p.id === "fykes-laboratory");
    if (oldPortfolio && currentPortfolio) {
      relations.push({
        from: oldPortfolio.id,
        to: currentPortfolio.id,
        type: "related",
        description: "Portfolio evolution",
      });
    }

    // Tech stack relationships - Only connect non-Pasada Flutter projects
    const flutterProjects = projects.filter((p) =>
      p.tech.some((t) => t.toLowerCase() === "flutter")
    );

    // Connect Flutter projects only if neither is a Pasada project
    flutterProjects.forEach((p1, i) => {
      flutterProjects.slice(i + 1).forEach((p2) => {
        const p1IsPasada = p1.title.toLowerCase().includes("pasada");
        const p2IsPasada = p2.title.toLowerCase().includes("pasada");
        
        // Skip if either is a Pasada project (they already have explicit connections)
        if (p1IsPasada || p2IsPasada) return;
        
        // Skip if connection already exists
        if (
          !relations.some(
            (r) =>
              (r.from === p1.id && r.to === p2.id) ||
              (r.from === p2.id && r.to === p1.id)
          )
        ) {
          relations.push({
            from: p1.id,
            to: p2.id,
            type: "related",
            description: "Flutter ecosystem",
          });
        }
      });
    });

    return relations;
  }, [projects]);

  const activeProject = hoveredProject || selectedProject;

  // Get connected projects
  const connectedProjects = useMemo(() => {
    if (!activeProject) return new Set<string>();

    const connected = new Set<string>([activeProject]);
    relationships.forEach((rel) => {
      if (rel.from === activeProject) connected.add(rel.to);
      if (rel.to === activeProject) connected.add(rel.from);
    });

    return connected;
  }, [activeProject, relationships]);

  const getNodeColor = (project: ProjectEntry) => {
    const tier = project.classification.tier;
    if (tier === "S") return "from-yellow-500 to-orange-600";
    if (tier === "A") return "from-green-500 to-emerald-600";
    if (tier === "B") return "from-blue-500 to-cyan-600";
    if (tier === "C") return "from-purple-500 to-pink-600";
    return "from-gray-500 to-slate-600";
  };

  const getConnectionColor = (type: string) => {
    if (type === "parent") return "stroke-yellow-500";
    if (type === "sibling") return "stroke-cyan-500";
    return "stroke-purple-500";
  };

  return (
    <div className={cn(panelClass, "overflow-hidden")}>
      <div className="space-y-4">
        <div className="flex flex-col gap-1 text-left">
          <p className="retro text-[0.55rem] uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.6rem]">
            Project Dependencies Graph
          </p>
          <p className="retro text-[0.55rem] leading-relaxed text-muted-foreground">
            <span className="hidden sm:inline">Hover or tap</span>
            <span className="sm:hidden">Tap</span> to explore connections between
            projects.
          </p>
        </div>

        {/* Project Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-sm border border-dashed border-border/40 bg-background/60 p-2 sm:gap-3 sm:p-3 dark:border-ring/40">
          {projects.map((project, index) => {
            const isActive = activeProject === project.id;
            const isConnected = connectedProjects.has(project.id);
            const isHidden = activeProject && !isConnected;

            return (
              <motion.button
                key={project.id}
                type="button"
                className={cn(
                  "retro rounded-sm border-2 px-3 py-1 text-[0.5rem] uppercase tracking-[0.18em] transition-all duration-300 sm:text-[0.55rem]",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_0_12px_var(--primary)]"
                    : isConnected
                    ? "border-primary/70 bg-primary/20 text-foreground active:bg-primary/40 sm:hover:bg-primary/30"
                    : "border-border bg-background/80 text-foreground active:border-primary/50 active:bg-primary/10 sm:hover:border-primary/50 sm:hover:bg-primary/10 dark:border-ring"
                )}
                style={{
                  opacity: isHidden ? 0.35 : 1,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onTouchStart={() => setHoveredProject(project.id)}
                onClick={() =>
                  setSelectedProject(selectedProject === project.id ? null : project.id)
                }
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: isHidden ? 0.35 : 1,
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                {project.title}
              </motion.button>
            );
          })}
        </div>

        {/* Graph Container */}
        <div className="relative min-h-[350px] overflow-hidden rounded-sm border-2 border-dashed border-border/40 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb,147,51,234),0.03)_0%,transparent_50%)] p-3 sm:min-h-[450px] sm:p-4 dark:border-ring/40">
          {/* Circuit board grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(var(--primary-rgb,147,51,234),0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary-rgb,147,51,234),0.3) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Connection Lines */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {relationships.map((rel, i) => {
              const fromIndex = projects.findIndex((p) => p.id === rel.from);
              const toIndex = projects.findIndex((p) => p.id === rel.to);

              if (fromIndex === -1 || toIndex === -1) return null;

              const isActive =
                activeProject && (rel.from === activeProject || rel.to === activeProject);
              const isConnected =
                activeProject &&
                connectedProjects.has(rel.from) &&
                connectedProjects.has(rel.to);

              // Calculate positions (circular layout)
              const angleFrom = (fromIndex / projects.length) * 2 * Math.PI - Math.PI / 2;
              const angleTo = (toIndex / projects.length) * 2 * Math.PI - Math.PI / 2;

              const radius = 35; // percentage
              const centerX = 50;
              const centerY = 50;

              const x1 = centerX + radius * Math.cos(angleFrom);
              const y1 = centerY + radius * Math.sin(angleFrom);
              const x2 = centerX + radius * Math.cos(angleTo);
              const y2 = centerY + radius * Math.sin(angleTo);

              return (
                <g key={`${rel.from}-${rel.to}-${i}`}>
                  <motion.line
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    strokeWidth={isActive ? 3 : 2}
                    className={cn(
                      "transition-all duration-300",
                      isActive
                        ? getConnectionColor(rel.type)
                        : isConnected
                        ? `${getConnectionColor(rel.type)} opacity-40`
                        : "stroke-muted-foreground/20"
                    )}
                    strokeDasharray={rel.type === "related" ? "5,5" : "none"}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: isActive ? 1 : isConnected ? 0.4 : 0.2,
                    }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Project Nodes */}
          <div className="pointer-events-none absolute inset-0">
            {projects.map((project, index) => {
              const angle = (index / projects.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 35;
              const centerX = 50;
              const centerY = 50;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);
              const isActive = activeProject === project.id;
              const isConnected = connectedProjects.has(project.id);
              const gradient = getNodeColor(project);

              return (
                <div
                  key={`node-${project.id}`}
                  className={cn(
                    "absolute size-3 rounded-full border-2 transition-all duration-300",
                    isActive
                      ? "border-primary bg-primary shadow-[0_0_12px_var(--primary)]"
                      : isConnected
                      ? "border-primary/70 bg-primary/30"
                      : "border-muted-foreground/40 bg-muted-foreground/20"
                  )}
                  style={{
                    left: `calc(${x}% - 8px)`,
                    top: `calc(${y}% - 8px)`,
                    backgroundImage: isActive ? undefined : `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))`,
                  }}
                  data-gradient={gradient}
                />
              );
            })}
          </div>

          {/* Info Panel */}
          <AnimatePresence>
            {activeProject && (
              <motion.div
                className="absolute bottom-2 left-2 right-2 rounded-sm border-2 border-primary/60 bg-card/95 p-2 backdrop-blur-sm sm:bottom-4 sm:left-4 sm:right-4 sm:p-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="retro text-xs font-bold text-primary sm:text-sm">
                      {projects.find((p) => p.id === activeProject)?.title}
                    </p>
                    <p className="retro mt-1 text-[0.45rem] text-muted-foreground sm:text-[0.5rem]">
                      Connected to {connectedProjects.size - 1} project(s)
                    </p>
                    <div className="mt-2 space-y-1">
                      {relationships
                        .filter(
                          (r) => r.from === activeProject || r.to === activeProject
                        )
                        .map((rel) => {
                          const otherId =
                            rel.from === activeProject ? rel.to : rel.from;
                          const other = projects.find((p) => p.id === otherId);
                          return (
                            <div
                              key={`${rel.from}-${rel.to}`}
                              className="flex items-center gap-1.5"
                            >
                              <div
                                className={cn(
                                  "size-2 rounded-full",
                                  rel.type === "parent"
                                    ? "bg-yellow-500"
                                    : rel.type === "sibling"
                                    ? "bg-cyan-500"
                                    : "bg-purple-500"
                                )}
                              />
                              <span className="retro text-[0.4rem] text-foreground sm:text-[0.45rem]">
                                {other?.title}: {rel.description}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProject(null);
                      setHoveredProject(null);
                    }}
                    className="retro flex size-5 shrink-0 items-center justify-center rounded-sm border border-border bg-background text-[0.6rem] touch-manipulation active:bg-primary/20 sm:size-6 sm:text-xs sm:hover:bg-primary/20 dark:border-ring"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend - Below Graph */}
        <div className="mt-3 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-sm border border-border/60 bg-background/80 px-3 py-2 backdrop-blur-sm dark:border-ring/60 sm:gap-4 sm:px-4">
            <p className="retro text-[0.4rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.45rem]">
              Connection Types:
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1">
                <div className="h-px w-3 bg-yellow-500" />
                <span className="retro text-[0.35rem] text-foreground sm:text-[0.4rem]">
                  Parent
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-px w-3 bg-cyan-500" />
                <span className="retro text-[0.35rem] text-foreground sm:text-[0.4rem]">
                  Sibling
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-px w-3 border-t border-dashed border-purple-500" />
                <span className="retro text-[0.35rem] text-foreground sm:text-[0.4rem]">
                  Related
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechStackConstellation = ({ 
  projects, 
  panelClass 
}: { 
  projects: ProjectEntry[];
  panelClass: string;
}) => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Generate stable random positions for stars (only on client to avoid hydration mismatch)
  const [starPositions, setStarPositions] = useState<Array<{
    left: number;
    top: number;
    duration: number;
    delay: number;
  }>>([]);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only generate positions once on client side after mount to prevent hydration mismatch
    // Using startTransition to make this a non-blocking update
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      startTransition(() => {
        setStarPositions(
          Array.from({ length: 30 }).map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
          }))
        );
      });
    }
  }, []);

  // Build tech stack data
  const techData = useMemo(() => {
    const techMap = new Map<string, { projects: string[]; count: number }>();
    
    projects.forEach((project) => {
      project.tech.forEach((tech) => {
        if (!techMap.has(tech)) {
          techMap.set(tech, { projects: [], count: 0 });
        }
        const data = techMap.get(tech)!;
        data.projects.push(project.title);
        data.count += 1;
      });
    });

    return Array.from(techMap.entries())
      .map(([name, data]) => ({
        name,
        projects: data.projects,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [projects]);

  // Find connections between technologies
  const connections = useMemo(() => {
    const conns: Array<{ from: string; to: string; strength: number }> = [];
    
    projects.forEach((project) => {
      for (let i = 0; i < project.tech.length; i++) {
        for (let j = i + 1; j < project.tech.length; j++) {
          const from = project.tech[i];
          const to = project.tech[j];
          
          const existing = conns.find(
            (c) => (c.from === from && c.to === to) || (c.from === to && c.to === from)
          );
          
          if (existing) {
            existing.strength += 1;
          } else {
            conns.push({ from, to, strength: 1 });
          }
        }
      }
    });
    
    return conns;
  }, [projects]);

  const activeTech = hoveredTech || selectedTech;

  // Get connected technologies
  const connectedTechs = useMemo(() => {
    if (!activeTech) return new Set<string>();
    
    const connected = new Set<string>([activeTech]);
    connections.forEach((conn) => {
      if (conn.from === activeTech) connected.add(conn.to);
      if (conn.to === activeTech) connected.add(conn.from);
    });
    
    return connected;
  }, [activeTech, connections]);

  const getTechSize = (count: number) => {
    if (count >= 8) return "text-xl sm:text-2xl px-4 py-2";
    if (count >= 5) return "text-lg sm:text-xl px-3.5 py-1.5";
    if (count >= 3) return "text-base sm:text-lg px-3 py-1.5";
    return "text-sm sm:text-base px-2.5 py-1";
  };

  const getTechGlow = (count: number) => {
    if (count >= 8) return "shadow-[0_0_20px_var(--primary),0_0_40px_var(--primary)]";
    if (count >= 5) return "shadow-[0_0_15px_var(--primary),0_0_30px_var(--primary)]";
    if (count >= 3) return "shadow-[0_0_10px_var(--primary),0_0_20px_var(--primary)]";
    return "shadow-[0_0_8px_var(--primary)]";
  };

  const formatPercent = (value: number) => value.toFixed(3);

  return (
    <div className={cn(panelClass, "overflow-hidden")}>
      <div className="space-y-4">
        <div className="flex flex-col gap-1 text-left">
          <p className="retro text-[0.55rem] uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.6rem]">
            Tech Stack Constellation
          </p>
          <p className="retro text-[0.55rem] leading-relaxed text-muted-foreground">
            <span className="hidden sm:inline">Hover or tap</span>
            <span className="sm:hidden">Tap</span> to see connections between technologies across projects.
          </p>
        </div>

        {/* Tech Stack Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-sm border border-dashed border-border/40 bg-background/60 p-2 sm:gap-3 sm:p-3 dark:border-ring/40">
          {techData.map((tech, index) => {
            const isActive = activeTech === tech.name;
            const isConnected = connectedTechs.has(tech.name);
            const isHidden = activeTech && !isConnected;

            return (
              <motion.button
                key={tech.name}
                type="button"
                className={cn(
                  "retro rounded-sm border-2 transition-all duration-300 touch-manipulation",
                  getTechSize(tech.count),
                  isActive
                    ? cn(
                        "border-primary bg-primary text-primary-foreground",
                        getTechGlow(tech.count)
                      )
                    : isConnected
                    ? "border-primary/70 bg-primary/20 text-foreground active:bg-primary/40 sm:hover:bg-primary/30"
                    : "border-border bg-background/80 text-foreground active:border-primary/50 active:bg-primary/10 sm:hover:border-primary/50 sm:hover:bg-primary/10 dark:border-ring"
                )}
                style={{
                  opacity: isHidden ? 0.35 : 1,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
                onMouseEnter={() => setHoveredTech(tech.name)}
                onMouseLeave={() => setHoveredTech(null)}
                onTouchStart={() => setHoveredTech(tech.name)}
                onClick={() =>
                  setSelectedTech(selectedTech === tech.name ? null : tech.name)
                }
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: isHidden ? 0.35 : 1,
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                <span className="text-[0.55rem] sm:text-[0.6rem] md:text-[0.7rem]">
                  {tech.name}
                </span>
                <span className="ml-1 text-[0.45rem] opacity-70 sm:ml-1.5 sm:text-[0.5rem]">
                  ×{tech.count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Constellation Container */}
        <div className="relative min-h-[300px] overflow-hidden rounded-sm border-2 border-dashed border-border/40 bg-gradient-to-b from-background via-background/50 to-background p-3 sm:min-h-[400px] sm:p-4 dark:border-ring/40">
          {/* Background stars effect */}
          <div className="pointer-events-none absolute inset-0">
            {starPositions.map((star, i) => (
              <motion.div
                key={i}
                className="absolute size-1 rounded-full bg-primary/20"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                }}
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                }}
              />
            ))}
          </div>

          {/* Connection Lines */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {connections.map((conn, i) => {
              const fromIndex = techData.findIndex((t) => t.name === conn.from);
              const toIndex = techData.findIndex((t) => t.name === conn.to);
              
              if (fromIndex === -1 || toIndex === -1) return null;

              const isActive =
                activeTech &&
                (conn.from === activeTech || conn.to === activeTech);
              const isConnected =
                activeTech &&
                (connectedTechs.has(conn.from) && connectedTechs.has(conn.to));

              // Simple positioning in a circular/scattered layout
              const angle1 = (fromIndex / techData.length) * 2 * Math.PI;
              const angle2 = (toIndex / techData.length) * 2 * Math.PI;
              
              const radius = 40; // percentage
              const centerX = 50;
              const centerY = 50;
              
              const x1 = formatPercent(centerX + radius * Math.cos(angle1));
              const y1 = formatPercent(centerY + radius * Math.sin(angle1));
              const x2 = formatPercent(centerX + radius * Math.cos(angle2));
              const y2 = formatPercent(centerY + radius * Math.sin(angle2));

              return (
                <motion.line
                  key={`${conn.from}-${conn.to}-${i}`}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="currentColor"
                  strokeWidth={isActive ? 2 : 1}
                  className={cn(
                    "transition-all duration-300",
                    isActive
                      ? "text-primary opacity-80"
                      : isConnected
                      ? "text-primary/50 opacity-50"
                      : "text-muted-foreground/20 opacity-20"
                  )}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isActive ? 0.8 : isConnected ? 0.5 : 0.2 }}
                  transition={{ duration: 1, delay: i * 0.02 }}
                />
              );
            })}
          </svg>

          {/* Tech Stack Nodes */}
          <div className="pointer-events-none absolute inset-0">
            {techData.map((tech, index) => {
              const angle = (index / techData.length) * 2 * Math.PI;
              const radius = 40;
              const centerX = 50;
              const centerY = 50;
              const x = formatPercent(centerX + radius * Math.cos(angle));
              const y = formatPercent(centerY + radius * Math.sin(angle));
              const isActive = activeTech === tech.name;
              const isConnected = connectedTechs.has(tech.name);

              return (
                <div
                  key={`${tech.name}-node`}
                  className={cn(
                    "absolute size-2 rounded-full border-2 transition-all duration-300",
                    isActive
                      ? "border-primary bg-primary shadow-[0_0_12px_var(--primary)]"
                      : isConnected
                      ? "border-primary/70 bg-primary/30"
                      : "border-muted-foreground/50 bg-muted-foreground/20"
                  )}
                  style={{
                    left: `calc(${x}% - 6px)`,
                    top: `calc(${y}% - 6px)`,
                  }}
                />
              );
            })}
          </div>

        </div>

        {/* Info Panel */}
        <AnimatePresence>
          {activeTech && (
            <motion.div
              className="rounded-sm border-2 border-primary/60 bg-card/95 p-3 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 overflow-hidden">
                  <p className="retro text-xs font-bold text-primary sm:text-sm">
                    {activeTech}
                  </p>
                  <p className="retro mt-0.5 text-[0.45rem] text-muted-foreground sm:mt-1 sm:text-[0.5rem]">
                    Used in {techData.find((t) => t.name === activeTech)?.count} project
                    {(techData.find((t) => t.name === activeTech)?.count ?? 0) === 1 ? "" : "s"}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1 sm:mt-2">
                    {techData
                      .find((t) => t.name === activeTech)
                      ?.projects.slice(0, 6)
                      .map((project) => (
                        <span
                          key={project}
                          className="retro rounded-sm bg-primary/20 px-1.5 py-0.5 text-[0.4rem] leading-tight text-foreground sm:px-2 sm:text-[0.45rem]"
                        >
                          {project}
                        </span>
                      ))}
                    {(techData.find((t) => t.name === activeTech)?.projects.length ?? 0) > 6 && (
                      <span className="retro rounded-sm bg-primary/20 px-1.5 py-0.5 text-[0.4rem] leading-tight text-foreground/70 sm:px-2 sm:text-[0.45rem]">
                        +
                        {(techData.find((t) => t.name === activeTech)?.projects.length ?? 0) - 6}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTech(null);
                    setHoveredTech(null);
                  }}
                  className="retro flex size-6 shrink-0 items-center justify-center rounded-sm border border-border bg-background text-[0.6rem] touch-manipulation active:bg-primary/20 sm:text-xs sm:hover:bg-primary/20 dark:border-ring"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const LabStatusMonitor = ({ 
  activeCount, 
  archivedCount 
}: { 
  activeCount: number; 
  archivedCount: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  // Initialize as null to avoid hydration mismatch, set after mount
  const [labTime, setLabTime] = useState<Date | null>(null);
  const [caffeineLevel, setCaffeineLevel] = useState(75);
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    // Set initial time on client mount to avoid hydration mismatch
    startTransition(() => {
      setLabTime(new Date());
    });
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setLabTime(new Date());
    }, 1000);

    // Randomly fluctuate caffeine level every 5 seconds
    const caffeineInterval = setInterval(() => {
      setCaffeineLevel((prev) => {
        const change = Math.random() > 0.5 ? 5 : -5;
        const newLevel = prev + change;
        return Math.max(10, Math.min(100, newLevel));
      });
    }, 5000);

    // Change quote every 15 seconds
    const quoteInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
    }, 15000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(caffeineInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  const getCaffeineColor = () => {
    if (caffeineLevel >= 70) return "bg-green-600";
    if (caffeineLevel >= 40) return "bg-yellow-600";
    return "bg-red-600";
  };

  const getInspirationLevel = () => {
    if (!labTime) return { level: 60, color: "bg-slate-600" };
    const hour = labTime.getHours();
    if (hour >= 9 && hour < 12) return { level: 85, color: "bg-blue-600" };
    if (hour >= 14 && hour < 17) return { level: 72, color: "bg-cyan-600" };
    if (hour >= 20 || hour < 2) return { level: 95, color: "bg-purple-600" };
    return { level: 60, color: "bg-slate-600" };
  };

  const inspiration = getInspirationLevel();

  return (
    <>
      {/* Desktop Version */}
      <motion.aside
        className="fixed right-4 top-24 z-40 hidden w-72 lg:block"
        initial={{ x: 320 }}
        animate={{ x: isExpanded ? 0 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Pull Tab Button */}
        <motion.button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="absolute -left-8 top-1/2 flex h-16 w-8 -translate-y-1/2 items-center justify-center rounded-l-sm border-4 border-r-0 border-border bg-card/95 shadow-[4px_4px_0_var(--border)] backdrop-blur-sm transition-colors hover:bg-primary/20 dark:border-ring"
          animate={{ opacity: isExpanded ? 0 : 1, pointerEvents: isExpanded ? "none" : "auto" }}
          transition={{ duration: 0.2 }}
          aria-label="Open lab status monitor"
        >
          <motion.span
            className="retro text-xl text-primary"
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ◀
          </motion.span>
        </motion.button>

        <div className="rounded-none border-4 border-border bg-card/95 shadow-[6px_6px_0_var(--border)] backdrop-blur-sm dark:border-ring">
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-border bg-primary/10 px-3 py-2 dark:border-ring">
          <div className="flex items-center gap-2">
            <motion.span
              className="inline-block size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="retro text-[0.6rem] uppercase tracking-[0.2em] text-foreground">
              Lab Status
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="retro flex size-6 items-center justify-center rounded-none border-2 border-border bg-background text-xs transition-transform hover:scale-110 active:scale-95 dark:border-ring"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? "−" : "+"}
          </button>
        </div>

        {/* Content */}
        <motion.div
          className="space-y-3 p-3"
          initial={false}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Lab Time */}
          <div className="space-y-1">
            <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">
              Lab Time
            </p>
            <div className="rounded-sm border border-dashed border-border/60 bg-background/70 px-2 py-1.5 dark:border-ring/60">
              <p className="retro text-center text-sm tabular-nums text-primary">
                {labTime ? labTime.toLocaleTimeString('en-US', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                }) : '--:--:--'}
              </p>
              <p className="retro text-center text-[0.45rem] text-muted-foreground">
                {labTime ? labTime.toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                }) : '---'}
              </p>
            </div>
          </div>

          {/* Experiments Status */}
          <div className="space-y-1">
            <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">
              Specimen Status
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between rounded-sm border border-border/60 bg-green-600/10 px-2 py-1 dark:border-ring/60">
                <span className="retro text-[0.5rem] uppercase tracking-[0.15em] text-foreground">
                  Active
                </span>
                <span className="retro text-sm font-bold text-green-600">
                  {activeCount}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-sm border border-border/60 bg-slate-600/10 px-2 py-1 dark:border-ring/60">
                <span className="retro text-[0.5rem] uppercase tracking-[0.15em] text-foreground">
                  Archived
                </span>
                <span className="retro text-sm font-bold text-slate-600">
                  {archivedCount}
                </span>
              </div>
            </div>
          </div>

          {/* Caffeine Level */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">
                Caffeine Level
              </p>
              <span className="retro text-[0.5rem] text-foreground">
                {caffeineLevel}%
              </span>
            </div>
            <div className="h-3 rounded-sm border-2 border-border bg-background dark:border-ring">
              <motion.div
                className={cn("h-full rounded-sm", getCaffeineColor())}
                initial={{ width: "0%" }}
                animate={{ width: `${caffeineLevel}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="retro text-[0.45rem] italic text-muted-foreground">
              {caffeineLevel >= 70
                ? "Optimal coding conditions"
                : caffeineLevel >= 40
                ? "Refill recommended"
                : "CRITICAL: Coffee needed!"}
            </p>
          </div>

          {/* Inspiration Meter */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">
                Inspiration Meter
              </p>
              <span className="retro text-[0.5rem] text-foreground">
                {inspiration.level}%
              </span>
            </div>
            <div className="h-3 rounded-sm border-2 border-border bg-background dark:border-ring">
              <motion.div
                className={cn("h-full rounded-sm", inspiration.color)}
                animate={{ width: `${inspiration.level}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="rounded-sm border border-dashed border-primary/40 bg-primary/5 px-2 py-2">
            <motion.p
              key={currentQuote}
              className="retro text-center text-[0.5rem] leading-relaxed text-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              &quot;{currentQuote}&quot;
            </motion.p>
          </div>
        </motion.div>
        </div>
      </motion.aside>

      {/* Mobile Version */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
        initial={{ y: 100 }}
        animate={{ y: isExpanded ? 0 : "calc(100% - 48px)" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="rounded-t-none border-4 border-b-0 border-border bg-card/95 shadow-[0_-4px_0_var(--border)] backdrop-blur-sm dark:border-ring">
          {/* Mobile Header */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-between border-b-4 border-border bg-primary/10 px-4 py-3 dark:border-ring"
          >
            <div className="flex items-center gap-2">
              <motion.span
                className="inline-block size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="retro text-[0.6rem] uppercase tracking-[0.2em] text-foreground">
                Lab Status Monitor
              </span>
            </div>
            <motion.span
              className="retro text-lg text-primary"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </button>

          {/* Mobile Content - Horizontal Scroll */}
          <motion.div
            className="overflow-x-auto overflow-y-hidden p-3"
            initial={false}
            animate={{ 
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-3 pb-2" style={{ minWidth: "max-content" }}>
              {/* Lab Time */}
              <div className="w-40 shrink-0 space-y-1">
                <p className="retro text-[0.45rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Lab Time
                </p>
                <div className="rounded-sm border border-dashed border-border/60 bg-background/70 px-2 py-1.5 dark:border-ring/60">
                  <p className="retro text-center text-xs tabular-nums text-primary">
                    {labTime ? labTime.toLocaleTimeString('en-US', { 
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }) : '--:--:--'}
                  </p>
                  <p className="retro text-center text-[0.4rem] text-muted-foreground">
                    {labTime ? labTime.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    }) : '---'}
                  </p>
                </div>
              </div>

              {/* Experiments Status */}
              <div className="w-36 shrink-0 space-y-1">
                <p className="retro text-[0.45rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Specimens
                </p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between rounded-sm border border-border/60 bg-green-600/10 px-2 py-0.5 dark:border-ring/60">
                    <span className="retro text-[0.45rem] uppercase tracking-[0.15em] text-foreground">
                      Active
                    </span>
                    <span className="retro text-xs font-bold text-green-600">
                      {activeCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-sm border border-border/60 bg-slate-600/10 px-2 py-0.5 dark:border-ring/60">
                    <span className="retro text-[0.45rem] uppercase tracking-[0.15em] text-foreground">
                      Archived
                    </span>
                    <span className="retro text-xs font-bold text-slate-600">
                      {archivedCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Caffeine Level */}
              <div className="w-44 shrink-0 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="retro text-[0.45rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Caffeine
                  </p>
                  <span className="retro text-[0.45rem] text-foreground">
                    {caffeineLevel}%
                  </span>
                </div>
                <div className="h-2.5 rounded-sm border-2 border-border bg-background dark:border-ring">
                  <motion.div
                    className={cn("h-full rounded-sm", getCaffeineColor())}
                    animate={{ width: `${caffeineLevel}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="retro text-[0.4rem] italic text-muted-foreground">
                  {caffeineLevel >= 70
                    ? "Optimal"
                    : caffeineLevel >= 40
                    ? "Refill rec."
                    : "CRITICAL!"}
                </p>
              </div>

              {/* Inspiration Meter */}
              <div className="w-44 shrink-0 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="retro text-[0.45rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Inspiration
                  </p>
                  <span className="retro text-[0.45rem] text-foreground">
                    {inspiration.level}%
                  </span>
                </div>
                <div className="h-2.5 rounded-sm border-2 border-border bg-background dark:border-ring">
                  <motion.div
                    className={cn("h-full rounded-sm", inspiration.color)}
                    animate={{ width: `${inspiration.level}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="w-64 shrink-0 rounded-sm border border-dashed border-primary/40 bg-primary/5 px-2 py-2">
                <motion.p
                  key={currentQuote}
                  className="retro text-center text-[0.45rem] leading-relaxed text-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  &quot;{currentQuote}&quot;
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default function ProjectsPage() {
  const isVerySmall = useMediaQuery({ maxWidth: 374 });
  const isSmall = useMediaQuery({ minWidth: 375, maxWidth: 639 });
  const [activeTier, setActiveTier] = useState<TierFilter>("ALL");
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string>("");

  const isClient =
    typeof window !== "undefined" &&
    (isVerySmall !== undefined || isSmall !== undefined);

  const shellClass = isClient && isVerySmall
    ? "rounded-none border border-border bg-card/80 p-2 shadow-[1px_1px_0_var(--border)] backdrop-blur-sm dark:border-ring"
    : isClient && isSmall
    ? "rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring"
    : "rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring min-[375px]:border-3 min-[375px]:p-4 min-[375px]:shadow-[3px_3px_0_var(--border)] sm:border-4 sm:p-6 sm:shadow-[6px_6px_0_var(--border)] md:p-8 md:shadow-[8px_8px_0_var(--border)]";

  const panelBaseClass = isClient && isVerySmall
    ? "rounded-none border border-border bg-card/80 p-2 shadow-[1px_1px_0_var(--border)] backdrop-blur-sm dark:border-ring"
    : isClient && isSmall
    ? "rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring"
    : "rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring min-[375px]:border-3 min-[375px]:p-4 min-[375px]:shadow-[3px_3px_0_var(--border)] sm:border-4 sm:p-5 sm:shadow-[4px_4px_0_var(--border)] md:p-6 md:shadow-[6px_6px_0_var(--border)]";

  const gridGap = isClient && isVerySmall
    ? "gap-12"
    : isClient && isSmall
    ? "gap-12"
    : "gap-8 min-[375px]:gap-10 sm:gap-10 md:gap-10";

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) =>
        a.classification.priority === b.classification.priority
          ? a.title.localeCompare(b.title)
          : a.classification.priority - b.classification.priority
      ),
    []
  );

  const tierCounts = useMemo(
    () =>
      sortedProjects.reduce<Record<Tier, number>>(
        (acc, project) => {
          acc[project.classification.tier] =
            (acc[project.classification.tier] ?? 0) + 1;
          return acc;
        },
        {
          S: 0,
          A: 0,
          B: 0,
          C: 0,
          D: 0,
        }
      ),
    [sortedProjects]
  );

  const filteredProjects = useMemo(
    () =>
      activeTier === "ALL"
        ? sortedProjects
        : sortedProjects.filter(
            (project) => project.classification.tier === activeTier
          ),
    [activeTier, sortedProjects]
  );

  const activeProjectsCount = useMemo(
    () => sortedProjects.filter((project) => project.link).length,
    [sortedProjects]
  );

  const archivedProjectsCount = useMemo(
    () => sortedProjects.filter((project) => !project.link).length,
    [sortedProjects]
  );

  const handleTierToggle = (tier: Tier) => {
    const newTier = activeTier === tier ? "ALL" : tier;
    
    // Show loading screen only when changing to a specific tier (not when clearing)
    if (newTier !== "ALL") {
      setIsLoading(true);
      setLoadingTier(newTier);
      
      // Show loading screen for 1.5 seconds
      setTimeout(() => {
        setActiveTier(newTier);
        setIsLoading(false);
      }, 1500);
    } else {
      setActiveTier(newTier);
    }
  };

  const handleImageZoom = (image: { src: string; alt: string }) => {
    setActiveImage(image);
  };

  const handleImageClose = () => setActiveImage(null);

  useEffect(() => {
    if (!activeImage) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleImageClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.removeProperty("overflow");
    };
  }, [activeImage]);

  return (
    <>
      {/* Retro Loading Screen */}
      <AnimatePresence>
        {isLoading && <RetroLoadingScreen tier={loadingTier} />}
      </AnimatePresence>

      <LabStatusMonitor 
        activeCount={activeProjectsCount} 
        archivedCount={archivedProjectsCount} 
      />
      <main className="mx-auto flex min-h-screen w-full max-w-[95vw] flex-col gap-6 px-3 py-6 text-foreground min-[375px]:gap-7 min-[375px]:px-4 min-[375px]:py-8 sm:gap-10 sm:px-6 sm:py-12 md:gap-12 md:py-16">
        <section className="flex flex-col items-center gap-3 text-center min-[375px]:gap-4 sm:gap-5 md:gap-6">
        <div className="space-y-2 sm:space-y-3">
          <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
            Project Intel
          </p>
          <h1 className="retro text-xl uppercase leading-tight tracking-[0.2em] sm:text-2xl sm:tracking-[0.25em] md:text-3xl md:tracking-[0.3em]">
            Lab Archive Citadel
          </h1>
          <p className="retro text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
            A catalog of experiments, relics, and mission-critical deployments.
          </p>
        </div>
        <Button
          asChild
          font="retro"
          className="retro h-10 px-6 text-[0.6rem] uppercase tracking-[0.2em] sm:h-11 sm:px-8 sm:text-sm sm:tracking-[0.25em] md:h-12 md:px-10 md:text-base md:tracking-[0.3em]"
        >
          <Link href="#archive-container">Skip to Citadel</Link>
        </Button>
        <RetroVisitorCounter />
      </section>

      {/* TERMINAL ORPHEUS - Positioned for visibility */}
      <RetroTerminal />

      <section
        id="archive-container"
        className={cn(
          shellClass,
          "border-dashed border-foreground/50 dark:border-ring/50 space-y-6 sm:space-y-8"
        )}
      >
        <p className="retro text-center text-[0.5rem] uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.3em] md:text-xs md:tracking-[0.35em]">
          Lab Archive Citadel
        </p>

        <div className={`grid ${gridGap} lg:grid-cols-[1.1fr_0.9fr]`}>
          <div className={cn(panelBaseClass, "space-y-4 text-left")}>
            <div className="flex items-center justify-between">
              <p className="retro text-[0.55rem] uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.6rem]">
                Project Manifest
              </p>
              <span className="retro text-[0.5rem] text-muted-foreground">
                {filteredProjects.length} specimen
                {filteredProjects.length === 1 ? "" : "s"}
                {activeTier !== "ALL" ? ` · Tier ${activeTier}` : ""}
              </span>
            </div>
            {filteredProjects.length > 0 ? (
              <ol className="grid gap-3 min-[520px]:grid-cols-2">
                {filteredProjects.map((project, index) => {
                  const noteIndex = sortedProjects.findIndex(p => p.id === project.id);
                  const note = labNotes[noteIndex % labNotes.length];
                  
                  return (
                    <li
                      key={project.id}
                      className="relative rounded-sm border border-dashed border-border/70 px-3 py-2 shadow-[2px_2px_0_var(--border)] transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-[3px_3px_0_var(--primary)] dark:border-ring/70"
                      onMouseEnter={() => setHoveredProjectId(project.id)}
                      onMouseLeave={() => setHoveredProjectId(null)}
                    >
                      <AnimatePresence>
                        {hoveredProjectId === project.id && (
                          <StickyNote note={note} index={noteIndex} />
                        )}
                      </AnimatePresence>
                      
                      <div className="flex items-center justify-between text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">
                        <span className="retro">
                          Case {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="retro">
                          Tier {project.classification.tier}
                        </span>
                      </div>
                      <p className="retro mt-1 text-sm uppercase tracking-[0.1em]">
                        {project.title}
                      </p>
                      <p className="retro text-[0.55rem] text-primary/80">
                        {project.tagline}
                      </p>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="rounded-sm border border-dashed border-border/70 bg-background/70 px-4 py-6 text-center shadow-[2px_2px_0_var(--border)] dark:border-ring/70">
                <p className="retro text-xs text-muted-foreground">
                  No specimens cataloged under Tier {activeTier} yet. Select a different tier to continue exploring.
                </p>
              </div>
            )}
          </div>

          <div className={cn(panelBaseClass, "space-y-4")}>
            <div className="flex flex-col gap-1 text-left">
              <p className="retro text-[0.55rem] uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.6rem]">
                Containment Sortation Matrix
              </p>
              <p className="retro text-[0.55rem] leading-relaxed text-muted-foreground">
                Unique tiering that keeps the archive organized by lab priority.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {classificationLegend.map((tier) => (
                <button
                  type="button"
                  key={tier.tier}
                  className={cn(
                    "rounded-sm border border-dashed border-border/60 p-3 text-left shadow-[2px_2px_0_var(--border)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60 dark:border-ring/70",
                    "bg-gradient-to-br text-white",
                    tier.gradient,
                    activeTier === tier.tier
                      ? "ring-4 ring-primary shadow-[0_0_0_4px_var(--primary)]"
                      : "hover:-translate-y-1 hover:shadow-[3px_3px_0_var(--border)]"
                  )}
                  onClick={() => handleTierToggle(tier.tier)}
                  aria-pressed={activeTier === tier.tier}
                  aria-label={`Toggle Tier ${tier.tier} filter`}
                >
                  <div className="flex items-center justify-between">
                    <span className="retro text-[0.6rem] uppercase tracking-[0.2em]">
                      Tier {tier.tier}
                    </span>
                    <span className="retro text-[0.6rem]">
                      {tierCounts[tier.tier]}x
                    </span>
                  </div>
                  <p className="retro mt-1 text-sm uppercase tracking-[0.15em]">
                    {tier.label}
                  </p>
                  <p className="retro text-[0.55rem] leading-relaxed text-white/90">
                    {tier.description}
                  </p>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <p className="retro text-[0.5rem] uppercase tracking-[0.25em] text-muted-foreground">
                {activeTier === "ALL"
                  ? "Viewing all tiers"
                  : `Filtering by Tier ${activeTier}`}
              </p>
              {activeTier !== "ALL" && (
                <Button
                  type="button"
                  variant="outline"
                  font="retro"
                  className="retro h-8 px-3 text-[0.55rem] uppercase tracking-[0.18em]"
                  onClick={() => setActiveTier("ALL")}
                >
                  Clear Filter
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Project Dependencies Graph */}
        <ProjectDependenciesGraph projects={sortedProjects} panelClass={panelBaseClass} />

        {/* Tech Stack Constellation - Between Matrix and Accordions */}
        <TechStackConstellation projects={sortedProjects} panelClass={panelBaseClass} />

        <div className={cn(panelBaseClass, "p-0 sm:p-0 md:p-0 lg:p-0")}>
          {filteredProjects.length > 0 ? (
            <Accordion
              key={activeTier}
              type="multiple"
              defaultValue={[filteredProjects[0].id]}
              className="divide-y-4 divide-border dark:divide-ring"
            >
              {filteredProjects.map((project) => (
              <AccordionItem key={project.id} value={project.id}>
                <AccordionTrigger className="flex flex-col gap-2 px-3 py-4 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="space-y-1">
                    <p className="retro text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
                      Tier {project.classification.tier} ·{" "}
                      {project.classification.codename}
                    </p>
                    <p className="retro text-lg uppercase tracking-[0.2em]">
                      {project.title}
                    </p>
                    <p className="retro text-xs text-primary/80">
                      {project.tagline}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="retro text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
                      {project.classification.status}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-background/70 relative overflow-hidden">
                  <LabSpecimenScanner />
                  <div className="flex flex-col gap-6 p-3 sm:p-4">
                    <motion.div
                      className="flex items-center gap-2 rounded-sm border border-dashed border-primary/40 bg-primary/5 px-3 py-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
                    >
                      <motion.span
                        className="inline-block size-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: 2, ease: "easeInOut" }}
                      />
                      <span className="retro text-[0.5rem] uppercase tracking-[0.25em] text-primary">
                        Specimen Analysis in Progress...
                      </span>
                    </motion.div>
                    <div className="space-y-4">
                      <div>
                        <p className="retro text-sm text-foreground">
                          {project.description}
                        </p>
                        <p className="retro mt-1 text-xs uppercase tracking-[0.2em] text-primary">
                          {project.detail}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="retro text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
                          Lab Notes
                        </p>
                        <ul className="space-y-2">
                          {project.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="retro text-xs leading-relaxed text-foreground"
                            >
                              • {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <p className="retro text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
                          Tech Stack
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech) => (
                            <Badge
                              key={tech}
                              font="retro"
                              variant="secondary"
                              className="border border-border bg-background px-3 py-1 text-[0.55rem] uppercase tracking-[0.2em] text-foreground"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {project.link ? (
                        <Button
                          asChild
                          font="retro"
                          className="retro h-9 w-fit px-5 text-[0.6rem] uppercase tracking-[0.2em]"
                        >
                          <Link
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Build
                          </Link>
                        </Button>
                      ) : null}
                    </div>

                    <div className="w-full px-6 sm:px-8 md:px-14">
                      <Carousel className="relative w-full">
                        <CarouselContent className="h-full">
                          {(project.images && project.images.length > 0
                            ? project.images
                            : [
                                {
                                  src: "",
                                  alt: "placeholder",
                                },
                              ]
                          ).map((image, idx) => {
                            const hasGalleryImages =
                              project.images && project.images.length > 0;
                            return (
                              <CarouselItem key={`${project.id}-img-${idx}`}>
                                <div className="overflow-hidden rounded-sm border-4 border-border bg-background shadow-[4px_4px_0_var(--border)] dark:border-ring flex items-center justify-center">
                                  {hasGalleryImages ? (
                                    <button
                                      type="button"
                                      className="group relative block w-full cursor-zoom-in focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                                      onClick={() =>
                                        handleImageZoom({ src: image.src, alt: image.alt })
                                      }
                                      title="Open zoomed preview"
                                    >
                                      <div className="relative flex h-[240px] w-full items-center justify-center sm:h-[320px] md:h-[360px]">
                                        <Image
                                          src={image.src}
                                          alt={image.alt}
                                          fill
                                          sizes="(min-width: 1024px) 800px, 90vw"
                                          className="object-contain"
                                        />
                                      </div>
                                      <span className="retro absolute bottom-3 right-3 rounded-sm border border-border bg-background/80 px-3 py-1 text-[0.5rem] uppercase tracking-[0.2em] text-foreground shadow-[2px_2px_0_var(--border)] opacity-0 transition group-hover:opacity-100">
                                        Zoom
                                      </span>
                                    </button>
                                  ) : (
                                    <QuestionMarkBlock
                                      title={project.placeholder?.title ?? "Mystery build"}
                                      caption={project.placeholder?.caption}
                                    />
                                  )}
                                </div>
                              </CarouselItem>
                            );
                          })}
                        </CarouselContent>
                        <CarouselPrevious aria-label="Previous project image" />
                        <CarouselNext aria-label="Next project image" />
                      </Carousel>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="p-6 text-center">
              <p className="retro text-sm text-muted-foreground">
                No archive entries match the current filter. Toggle another tier to continue exploring the lab files.
              </p>
            </div>
            )}
          </div>
        </section>
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6"
          onClick={handleImageClose}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-4xl rounded-sm border-4 border-border bg-background p-4 shadow-[0_0_0_4px_var(--border)] dark:border-ring"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <p className="retro text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Zoomed Preview
              </p>
              <Button
                type="button"
                variant="outline"
                font="retro"
                className="retro h-8 px-3 text-[0.55rem] uppercase tracking-[0.18em]"
                onClick={handleImageClose}
              >
                Close
              </Button>
            </div>
            <div className="mt-4">
              <div className="relative h-[60vh] w-full">
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
    </>
  );
}


