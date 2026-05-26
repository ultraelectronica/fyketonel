"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  gamerscore: number;
  icon: string;
  pixelArt: React.ReactNode;
  unlocked: boolean;
  rarity?: "common" | "rare" | "legendary";
  unlockedDate?: string;
}

/* ───────── Pixel-art achievement icons (preserved) ───────── */

const OwlPixel = () => (
  <div className="flex flex-col items-center gap-0.5">
    <div className="relative">
      <div className="absolute -left-1.5 -top-0.5 h-2 w-1 bg-amber-700 dark:bg-amber-600 sm:h-2.5 sm:w-1.5" />
      <div className="absolute -right-1.5 -top-0.5 h-2 w-1 bg-amber-700 dark:bg-amber-600 sm:h-2.5 sm:w-1.5" />
      <div className="relative h-6 w-7 border-2 border-foreground bg-amber-700 dark:bg-amber-600 sm:h-7 sm:w-8 sm:border-[3px]">
        <div className="absolute left-1 top-1.5 h-2 w-2 border border-foreground bg-yellow-200 dark:bg-yellow-100 sm:h-2.5 sm:w-2.5" />
        <div className="absolute right-1 top-1.5 h-2 w-2 border border-foreground bg-yellow-200 dark:bg-yellow-100 sm:h-2.5 sm:w-2.5" />
        <div className="absolute left-1.5 top-2 h-1 w-1 bg-foreground sm:h-1.5 sm:w-1.5" />
        <div className="absolute right-1.5 top-2 h-1 w-1 bg-foreground sm:h-1.5 sm:w-1.5" />
        <div className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 bg-orange-500 sm:h-2 sm:w-2" style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
      </div>
    </div>
  </div>
);

const BugPixel = () => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <div className="absolute -left-1 -top-1.5 h-2 w-0.5 origin-bottom rotate-[-30deg] bg-foreground sm:h-2.5" />
      <div className="absolute -right-1 -top-1.5 h-2 w-0.5 origin-bottom rotate-[30deg] bg-foreground sm:h-2.5" />
      <div className="flex flex-col gap-0.5">
        <div className="h-2 w-6 border-2 border-foreground bg-green-600 dark:bg-green-500 sm:h-2.5 sm:w-7 sm:border-[3px]" />
        <div className="relative h-2.5 w-7 border-2 border-foreground bg-green-700 dark:bg-green-600 sm:h-3 sm:w-8 sm:border-[3px]">
          <div className="absolute left-1 top-3 h-1 w-1 bg-foreground/50 sm:h-1.5 sm:w-1.5" />
          <div className="absolute right-1 top-3 h-1 w-1 bg-foreground/50 sm:h-1.5 sm:w-1.5" />
        </div>
      </div>
      <div className="absolute -left-1 top-2 h-0.5 w-2 bg-foreground sm:w-2.5" />
      <div className="absolute -right-1 top-2 h-0.5 w-2 bg-foreground sm:w-2.5" />
    </div>
  </div>
);

const CoffeePixel = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="absolute -top-2 left-1/2 flex -translate-x-1/2 gap-0.5">
        <div className="h-1.5 w-0.5 bg-muted-foreground/50 sm:h-2 sm:w-1" />
        <div className="h-2 w-0.5 bg-muted-foreground/50 sm:h-2.5 sm:w-1" />
        <div className="h-1.5 w-0.5 bg-muted-foreground/50 sm:h-2 sm:w-1" />
      </div>
      <div className="h-6 w-5 border-2 border-foreground bg-red-100 dark:bg-red-950 sm:h-7 sm:w-6 sm:border-[3px]">
        <div className="absolute bottom-0.5 left-0.5 right-0.5 h-3 bg-amber-900 dark:bg-amber-950 sm:h-3.5" />
      </div>
      <div className="absolute -right-1 top-1 h-4 w-2 rounded-r-full border-2 border-l-0 border-foreground sm:-right-1.5 sm:h-5 sm:w-2.5 sm:border-[3px]" />
    </div>
  </div>
);

const TrophyPixel = () => (
  <div className="flex flex-col items-center gap-0.5">
    <div className="h-1 w-2 bg-amber-400 dark:bg-amber-500 sm:h-1.5 sm:w-2.5" />
    <div className="relative h-4 w-6 border-2 border-foreground bg-amber-400 dark:bg-amber-500 sm:h-5 sm:w-7 sm:border-[3px]">
      <div className="absolute -left-1.5 top-0.5 h-3 w-1.5 rounded-l-full border-2 border-r-0 border-foreground sm:h-3.5 sm:w-2" />
      <div className="absolute -right-1.5 top-0.5 h-3 w-1.5 rounded-r-full border-2 border-l-0 border-foreground sm:h-3.5 sm:w-2" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 bg-amber-600 dark:bg-amber-700 sm:h-2 sm:w-2" />
    </div>
    <div className="h-1 w-4 border-2 border-t-0 border-foreground bg-amber-600 dark:bg-amber-700 sm:h-1.5 sm:w-5" />
    <div className="h-0.5 w-5 bg-amber-700 dark:bg-amber-800 sm:h-1 sm:w-6" />
  </div>
);

const RocketPixel = () => (
  <div className="flex flex-col items-center">
    <div className="h-2 w-2 bg-red-500 sm:h-2.5 sm:w-2.5" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
    <div className="relative h-5 w-4 border-2 border-foreground bg-gray-300 dark:bg-gray-600 sm:h-6 sm:w-5 sm:border-[3px]">
      <div className="absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-foreground bg-blue-300 dark:bg-blue-900 sm:h-2 sm:w-2" />
    </div>
    <div className="relative flex w-full justify-between">
      <div className="h-2 w-1.5 bg-red-600 sm:h-2.5 sm:w-2" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
      <div className="h-2 w-1.5 bg-red-600 sm:h-2.5 sm:w-2" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
    </div>
    <div className="flex gap-0.5">
      <div className="h-1.5 w-1 bg-orange-500 sm:h-2 sm:w-1.5" />
      <div className="h-1 w-1 bg-yellow-400 sm:h-1.5 sm:w-1.5" />
      <div className="h-1.5 w-1 bg-orange-500 sm:h-2 sm:w-1.5" />
    </div>
  </div>
);

const MergePixel = () => (
  <div className="flex items-center justify-center gap-1">
    <div className="flex flex-col items-end gap-0.5">
      <div className="h-0.5 w-3 bg-purple-500 sm:h-1 sm:w-4" />
      <div className="h-0.5 w-2 bg-purple-500 sm:h-1 sm:w-2.5" />
    </div>
    <div className="h-3 w-3 border-2 border-purple-500 bg-purple-500/20 sm:h-4 sm:w-4 sm:border-[3px]" />
    <div className="flex flex-col items-start gap-0.5">
      <div className="h-0.5 w-3 bg-purple-500 sm:h-1 sm:w-4" />
      <div className="h-0.5 w-2 bg-purple-500 sm:h-1 sm:w-2.5" />
    </div>
  </div>
);

const BookStackPixel = () => (
  <div className="flex flex-col gap-0.5">
    <div className="h-1.5 w-6 border-2 border-foreground bg-red-600 dark:bg-red-700 sm:h-2 sm:w-7" />
    <div className="h-1.5 w-7 border-2 border-foreground bg-green-600 dark:bg-green-700 sm:h-2 sm:w-8" />
    <div className="relative h-2 w-6 border-2 border-foreground bg-blue-600 dark:bg-blue-700 sm:h-2.5 sm:w-7">
      <div className="absolute left-1 top-0 h-3 w-1 bg-amber-400 sm:h-3.5 sm:w-1.5" />
    </div>
  </div>
);

const LightningPixel = () => (
  <div className="flex items-center justify-center">
    <div className="relative h-7 w-4 sm:h-8 sm:w-5">
      <div className="absolute left-1/2 top-0 h-3 w-2 -translate-x-1/2 bg-yellow-400 sm:h-3.5 sm:w-2.5" style={{ clipPath: "polygon(0 0, 100% 0, 20% 50%, 100% 50%, 0 100%, 80% 50%)" }} />
      <div className="absolute bottom-0 left-1/2 h-3 w-2 -translate-x-1/2 bg-yellow-300 sm:h-3.5 sm:w-2.5" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%, 80% 50%)" }} />
      <div className="absolute inset-0 bg-yellow-400/30 blur-sm" />
    </div>
  </div>
);

/* ───────── Data (preserved) ───────── */

const achievements: Achievement[] = [
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Committed code at 3 AM",
    gamerscore: 50,
    icon: "🦉",
    pixelArt: <OwlPixel />,
    unlocked: true,
    rarity: "common",
    unlockedDate: "Oct 2024",
  },
  {
    id: "bug-hunter",
    title: "Bug Hunter",
    description: "Fixed 100 bugs this month",
    gamerscore: 25,
    icon: "🐛",
    pixelArt: <BugPixel />,
    unlocked: true,
    rarity: "common",
    unlockedDate: "Sep 2024",
  },
  {
    id: "coffee-addict",
    title: "Coffee Addict",
    description: "Drank 500 cups of coffee",
    gamerscore: 10,
    icon: "☕",
    pixelArt: <CoffeePixel />,
    unlocked: true,
    rarity: "common",
    unlockedDate: "Aug 2024",
  },
  {
    id: "stackoverflow-survivor",
    title: "Stack Overflow Survivor",
    description: "Found solution without Stack Overflow",
    gamerscore: 100,
    icon: "🏆",
    pixelArt: <TrophyPixel />,
    unlocked: true,
    rarity: "legendary",
    unlockedDate: "Nov 2024",
  },
  {
    id: "first-deploy",
    title: "First Deploy",
    description: "Successfully deployed first project",
    gamerscore: 15,
    icon: "🚀",
    pixelArt: <RocketPixel />,
    unlocked: true,
    rarity: "common",
    unlockedDate: "June 2021",
  },
  {
    id: "merge-master",
    title: "Merge Master",
    description: "Resolved 50 merge conflicts",
    gamerscore: 30,
    icon: "🔀",
    pixelArt: <MergePixel />,
    unlocked: true,
    rarity: "rare",
    unlockedDate: "Oct 2024",
  },
  {
    id: "documentation-hero",
    title: "Documentation Hero",
    description: "Wrote comprehensive docs",
    gamerscore: 40,
    icon: "📚",
    pixelArt: <BookStackPixel />,
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Optimized load time by 80%",
    gamerscore: 75,
    icon: "⚡",
    pixelArt: <LightningPixel />,
    unlocked: false,
    rarity: "legendary",
  },
];

/* ───────── Rarity config ───────── */

const rarityConfig = {
  common: {
    border: "border-border dark:border-ring",
    bg: "bg-card/80",
    glow: "",
    badgeBorder: "border-border dark:border-ring",
    badgeBg: "bg-muted/30",
    badgeText: "text-muted-foreground",
    iconBox: "border-border bg-background/80 dark:border-ring",
  },
  rare: {
    border: "border-blue-500 dark:border-blue-400",
    bg: "bg-gradient-to-br from-card/80 to-blue-500/10",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    badgeBorder: "border-blue-500 bg-blue-500/10",
    badgeText: "text-blue-600 dark:text-blue-400",
    iconBox: "border-blue-500/60 bg-blue-500/5 dark:border-blue-400/60",
  },
  legendary: {
    border: "border-amber-500 dark:border-amber-400",
    bg: "bg-gradient-to-br from-card/80 to-amber-500/10",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.5)]",
    badgeBorder: "border-amber-500 bg-amber-500/10",
    badgeText: "text-amber-600 dark:text-amber-400",
    iconBox: "border-amber-500/60 bg-amber-500/5 dark:border-amber-400/60",
  },
} as const;

/* ───────── Question-mark block for locked achievements ───────── */

const QuestionBlock = () => (
  <div className="relative flex h-full min-h-[56px] w-full flex-col items-center justify-center overflow-hidden rounded-sm border-4 border-amber-500 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 text-center text-amber-900 shadow-[0_0_0_4px_rgba(0,0,0,0.25),inset_0_-12px_0_rgba(0,0,0,0.15)] sm:min-h-[64px]">
    <span className="retro text-2xl drop-shadow-[0_3px_0_rgba(0,0,0,0.35)] sm:text-3xl">?</span>
    <span
      aria-hidden
      className="absolute left-1.5 top-1.5 size-2 rounded-sm bg-amber-400 shadow-[0_2px_0_rgba(0,0,0,0.3)] sm:size-2.5"
    />
    <span
      aria-hidden
      className="absolute right-1.5 top-1.5 size-2 rounded-sm bg-amber-400 shadow-[0_2px_0_rgba(0,0,0,0.3)] sm:size-2.5"
    />
    <span
      aria-hidden
      className="absolute bottom-1.5 left-1.5 size-2 rounded-sm bg-amber-400 shadow-[0_2px_0_rgba(0,0,0,0.3)] sm:size-2.5"
    />
    <span
      aria-hidden
      className="absolute bottom-1.5 right-1.5 size-2 rounded-sm bg-amber-400 shadow-[0_2px_0_rgba(0,0,0,0.3)] sm:size-2.5"
    />
  </div>
);

/* ───────── Circular progress ring ───────── */

function ProgressRing({
  value,
  max,
  size = 48,
  stroke = 4,
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-muted/30"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${c}`}
        strokeLinecap="butt"
        className="text-primary"
        initial={{ strokeDasharray: `0 ${c}` }}
        animate={{ strokeDasharray: `${dash} ${c}` }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      />
    </svg>
  );
}

/* ───────── Main component ───────── */

export function AchievementWall({ className }: { className?: string }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);
  const totalScore = unlocked.reduce((s, a) => s + a.gamerscore, 0);
  const maxScore = achievements.reduce((s, a) => s + a.gamerscore, 0);
  const unlockedCount = unlocked.length;
  const totalCount = achievements.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 260, damping: 20 },
    },
  };

  return (
    <section className={cn("relative", className)}>
      {/* ── Header ── */}
      <motion.div
        className="mb-5 text-center sm:mb-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em]">
          Developer Achievements
        </p>
        <h2 className="retro mt-1.5 text-lg uppercase tracking-[0.2em] sm:text-xl sm:tracking-[0.25em] md:text-2xl md:tracking-[0.3em]">
          Trophy Case
        </h2>
      </motion.div>

      {/* ── Gamerscore dashboard ── */}
      <motion.div
        className="mb-6 flex flex-col items-center justify-center gap-4 sm:mb-8 sm:flex-row sm:gap-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Score */}
        <div className="flex items-center gap-3 rounded-none border-2 border-border bg-card/80 px-4 py-3 shadow-[3px_3px_0_var(--border)] backdrop-blur-sm dark:border-ring sm:px-5 sm:py-4 md:shadow-[4px_4px_0_var(--border)]">
          <span className="text-2xl sm:text-3xl">🏆</span>
          <div className="text-left">
            <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.6rem]">
              Total Score
            </p>
            <p className="retro text-sm font-bold tracking-[0.15em] text-primary sm:text-base sm:tracking-[0.2em]">
              {totalScore} / {maxScore}G
            </p>
          </div>
        </div>

        {/* Completion ring */}
        <div className="flex items-center gap-3 rounded-none border-2 border-border bg-card/80 px-4 py-3 shadow-[3px_3px_0_var(--border)] dark:border-ring sm:px-5 sm:py-4 md:shadow-[4px_4px_0_var(--border)]">
          <ProgressRing value={unlockedCount} max={totalCount} size={44} stroke={4} />
          <div className="text-left">
            <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.6rem]">
              Unlocked
            </p>
            <p className="retro text-sm font-bold tracking-[0.15em] text-primary sm:text-base sm:tracking-[0.2em]">
              {unlockedCount} / {totalCount}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-[200px] rounded-none border-2 border-border bg-card/80 px-4 py-3 shadow-[3px_3px_0_var(--border)] dark:border-ring sm:w-auto sm:max-w-none sm:px-5 sm:py-4 md:shadow-[4px_4px_0_var(--border)]">
          <div className="flex items-center justify-between">
            <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.6rem]">
              Progress
            </p>
            <p className="retro text-[0.5rem] font-bold uppercase tracking-[0.15em] text-primary sm:text-[0.6rem]">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </p>
          </div>
          <div className="relative mt-2 h-3 overflow-hidden border-2 border-border bg-background/60 dark:border-ring">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(var(--primary-rgb,147,51,234),0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary-rgb,147,51,234),0.3) 1px, transparent 1px)",
                backgroundSize: "4px 4px",
              }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/80 to-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            >
              <motion.div
                className="absolute inset-y-0 w-1 bg-white/40"
                animate={{ x: ["0%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Unlocked achievements ── */}
      {unlocked.length > 0 && (
        <div className="mb-4">
          <motion.p
            className="retro mb-3 text-[0.5rem] uppercase tracking-[0.25em] text-muted-foreground/70 sm:mb-4 sm:text-[0.6rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Unlocked ({unlocked.length})
          </motion.p>

          <motion.div
            className="grid gap-3 sm:gap-4 md:grid-cols-2 md:gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {unlocked.map((a) => (
              <motion.div
                key={a.id}
                variants={cardVariants}
                onMouseEnter={() => setHoveredId(a.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <AchievementCard achievement={a} isHovered={hoveredId === a.id} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* ── Locked achievements ── */}
      {locked.length > 0 && (
        <div className="mt-6">
          <motion.p
            className="retro mb-3 text-[0.5rem] uppercase tracking-[0.25em] text-muted-foreground/70 sm:mb-4 sm:text-[0.6rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Locked ({locked.length})
          </motion.p>

          <motion.div
            className="grid gap-3 sm:gap-4 md:grid-cols-2 md:gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {locked.map((a) => (
              <motion.div key={a.id} variants={cardVariants}>
                <LockedCard achievement={a} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
}

/* ───────── Unlocked card ───────── */

function AchievementCard({
  achievement,
  isHovered,
}: {
  achievement: Achievement;
  isHovered: boolean;
}) {
  const rarity = achievement.rarity || "common";
  const cfg = rarityConfig[rarity];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-none border-2 backdrop-blur-sm transition-all duration-150 sm:border-[3px]",
        cfg.border,
        cfg.bg,
        "shadow-[2px_2px_0_var(--border)] hover:-translate-y-1 hover:border-primary hover:shadow-[4px_4px_0_var(--primary)] active:translate-y-0 active:shadow-[2px_2px_0_var(--primary)] sm:shadow-[3px_3px_0_var(--border)] md:shadow-[4px_4px_0_var(--border)]",
        cfg.glow
      )}
    >
      {/* Pixel-art corner accents */}
      <span
        aria-hidden
        className={cn(
          "absolute left-1.5 top-1.5 size-1.5 rounded-sm shadow-[0_1px_0_rgba(0,0,0,0.3)] sm:size-2",
          rarity === "legendary" && "bg-amber-400",
          rarity === "rare" && "bg-blue-400",
          rarity === "common" && "bg-muted-foreground/30"
        )}
      />
      <span
        aria-hidden
        className={cn(
          "absolute right-1.5 top-1.5 size-1.5 rounded-sm shadow-[0_1px_0_rgba(0,0,0,0.3)] sm:size-2",
          rarity === "legendary" && "bg-amber-400",
          rarity === "rare" && "bg-blue-400",
          rarity === "common" && "bg-muted-foreground/30"
        )}
      />

      <div className="relative flex gap-3 p-3 sm:gap-4 sm:p-4">
        {/* Icon box */}
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-none border-2 shadow-inner sm:size-14 sm:border-[3px] md:size-16",
            cfg.iconBox
          )}
        >
          {achievement.pixelArt}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="retro text-xs uppercase leading-tight tracking-[0.15em] text-foreground sm:text-sm sm:tracking-[0.18em] md:text-base md:tracking-[0.2em]">
                {achievement.title}
              </h3>
              <span className="retro shrink-0 text-[0.5rem] font-bold tracking-[0.15em] text-primary sm:text-[0.6rem] sm:tracking-[0.18em] md:text-xs">
                {achievement.gamerscore}G
              </span>
            </div>
            <p className="retro text-[0.5rem] leading-relaxed tracking-[0.1em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.12em] md:text-xs md:tracking-[0.15em]">
              {achievement.description}
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between sm:mt-2.5 md:mt-3">
            <span className="retro text-[0.45rem] uppercase tracking-[0.15em] text-muted-foreground/80 sm:text-[0.5rem] sm:tracking-[0.18em]">
              {achievement.unlockedDate}
            </span>
            {rarity !== "common" && (
              <span
                className={cn(
                  "retro rounded-none border px-1.5 py-0.5 text-[0.4rem] uppercase tracking-[0.15em] sm:px-2 sm:py-1 sm:text-[0.45rem] md:text-[0.5rem]",
                  cfg.badgeBorder,
                  cfg.badgeText
                )}
              >
                {rarity}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover shine */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
        }}
      />

      {/* Legendary pulse */}
      {rarity === "legendary" && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-none border-2 border-amber-500/0"
          animate={{ borderColor: ["rgba(245,158,11,0)", "rgba(245,158,11,0.4)", "rgba(245,158,11,0)"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

/* ───────── Locked card ───────── */

function LockedCard({ achievement }: { achievement: Achievement }) {
  const rarity = achievement.rarity || "common";
  const cfg = rarityConfig[rarity];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-none border-2 border-border/40 bg-card/40 opacity-70 shadow-[2px_2px_0_var(--border)] grayscale transition-all duration-150 hover:opacity-90 dark:border-ring/40 sm:border-[3px] md:shadow-[3px_3px_0_var(--border)]"
      )}
    >
      <div className="relative flex gap-3 p-3 sm:gap-4 sm:p-4">
        {/* Question block */}
        <div className="shrink-0">
          <div className="size-12 sm:size-14 md:size-16">
            <QuestionBlock />
          </div>
        </div>

        {/* Mystery content */}
        <div className="flex flex-1 flex-col justify-center">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="retro text-xs uppercase leading-tight tracking-[0.15em] text-muted-foreground sm:text-sm sm:tracking-[0.18em]">
                ???
              </h3>
              <span className="retro text-[0.5rem] font-bold tracking-[0.15em] text-muted-foreground/60 sm:text-[0.6rem]">
                {achievement.gamerscore}G
              </span>
            </div>
            <p className="retro text-[0.5rem] leading-relaxed tracking-[0.1em] text-muted-foreground/50 sm:text-[0.6rem] sm:tracking-[0.12em]">
              {achievement.description}
            </p>
          </div>

          <div className="mt-2 flex items-center gap-2 sm:mt-2.5">
            {/* Retro lock */}
            <div className="relative flex items-center gap-1">
              <div className="h-4 w-5 rounded-t-full border-[3px] border-b-0 border-muted-foreground/30 sm:h-5 sm:w-6" />
              <div className="relative h-4 w-5 rounded-none border-[3px] border-muted-foreground/30 bg-muted/20 sm:h-5 sm:w-6">
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                  <div className="size-1 rounded-full bg-muted-foreground/30 sm:size-1.5" />
                  <div className="h-1.5 w-0.5 bg-muted-foreground/30 sm:h-2 sm:w-1" />
                </div>
              </div>
            </div>
            <span className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground/40 sm:text-[0.45rem]">
              Locked
            </span>
            {rarity !== "common" && (
              <span
                className={cn(
                  "retro ml-auto rounded-none border px-1.5 py-0.5 text-[0.4rem] uppercase tracking-[0.15em] opacity-50 sm:px-2 sm:text-[0.45rem]",
                  cfg.badgeBorder,
                  cfg.badgeText
                )}
              >
                {rarity}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AchievementWall;
