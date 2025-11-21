"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";

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

export default function ProjectsPage() {
  const isVerySmall = useMediaQuery({ maxWidth: 374 });
  const isSmall = useMediaQuery({ minWidth: 375, maxWidth: 639 });
  const [activeTier, setActiveTier] = useState<TierFilter>("ALL");
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);

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

  const handleTierToggle = (tier: Tier) => {
    setActiveTier((prev) => (prev === tier ? "ALL" : tier));
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
      </section>

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
                {filteredProjects.map((project, index) => (
                  <li
                    key={project.id}
                    className="rounded-sm border border-dashed border-border/70 px-3 py-2 shadow-[2px_2px_0_var(--border)] dark:border-ring/70"
                  >
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
                ))}
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
              <p className="retro mt-3 text-center text-[0.55rem] uppercase tracking-[0.15em] text-muted-foreground">
                {activeImage.alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


