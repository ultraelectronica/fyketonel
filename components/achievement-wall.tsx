"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  gamerscore: number;
  icon: string;
  unlocked: boolean;
  rarity?: "common" | "rare" | "legendary";
  unlockedDate?: string;
}

const achievements: Achievement[] = [
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Committed code at 3 AM",
    gamerscore: 50,
    icon: "🦉",
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
    unlocked: true,
    rarity: "common",
    unlockedDate: "Jan 2024",
  },
  {
    id: "merge-master",
    title: "Merge Master",
    description: "Resolved 50 merge conflicts",
    gamerscore: 30,
    icon: "🔀",
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
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Optimized load time by 80%",
    gamerscore: 75,
    icon: "⚡",
    unlocked: false,
    rarity: "legendary",
  },
];

export function AchievementWall({ className }: { className?: string }) {
  const totalGamerscore = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.gamerscore, 0);
  const maxGamerscore = achievements.reduce((sum, a) => sum + a.gamerscore, 0);

  return (
    <section
      className={cn(
        "relative space-y-4 sm:space-y-5 md:space-y-6",
        className
      )}
    >
      {/* Header */}
      <div className="space-y-2 text-center sm:space-y-2.5 md:space-y-3">
        <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
          Developer Achievements
        </p>
        <h2 className="retro text-lg uppercase tracking-[0.2em] sm:text-xl sm:tracking-[0.25em] md:text-2xl md:tracking-[0.3em]">
          Trophy Case
        </h2>
        
        {/* Gamerscore Counter */}
        <div className="mx-auto inline-flex items-center gap-2 rounded-none border-2 border-border bg-card/80 px-4 py-2 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring sm:gap-2.5 sm:border-3 sm:px-5 sm:py-2.5 sm:shadow-[3px_3px_0_var(--border)] md:gap-3 md:border-4 md:px-6 md:py-3 md:shadow-[4px_4px_0_var(--border)]">
          <span className="text-xl sm:text-2xl md:text-3xl">🏆</span>
          <div className="text-left">
            <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.25em] md:text-xs">
              Total Score
            </p>
            <p className="retro text-sm font-bold tracking-[0.15em] text-primary sm:text-base sm:tracking-[0.2em] md:text-lg md:tracking-[0.25em]">
              {totalGamerscore} / {maxGamerscore}G
            </p>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-2">
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </section>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const rarityColors = {
    common: "border-border dark:border-ring",
    rare: "border-blue-500 dark:border-blue-400",
    legendary: "border-amber-500 dark:border-amber-400",
  };

  const rarityGlow = {
    common: "",
    rare: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    legendary: "shadow-[0_0_20px_rgba(245,158,11,0.5)]",
  };

  const rarityBg = {
    common: "bg-card/80",
    rare: "bg-gradient-to-br from-card/80 to-blue-500/10",
    legendary: "bg-gradient-to-br from-card/80 to-amber-500/10",
  };

  return (
    <motion.div
      className={cn(
        "group relative rounded-none border-2 backdrop-blur-sm transition-all duration-300 sm:border-3 md:border-4",
        achievement.unlocked
          ? cn(
              rarityColors[achievement.rarity || "common"],
              rarityBg[achievement.rarity || "common"],
              "shadow-[2px_2px_0_var(--border)] hover:shadow-[4px_4px_0_var(--border)] hover:-translate-y-1 cursor-pointer sm:shadow-[3px_3px_0_var(--border)] sm:hover:shadow-[5px_5px_0_var(--border)] md:shadow-[4px_4px_0_var(--border)] md:hover:shadow-[6px_6px_0_var(--border)]",
              rarityGlow[achievement.rarity || "common"]
            )
          : "border-border/40 bg-card/40 opacity-60 shadow-[2px_2px_0_var(--border)] grayscale dark:border-ring/40 sm:shadow-[3px_3px_0_var(--border)] md:shadow-[4px_4px_0_var(--border)]"
      )}
      whileHover={
        achievement.unlocked
          ? {
              scale: 1.02,
            }
          : {}
      }
    >
      {/* Locked overlay */}
      {!achievement.unlocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-none bg-background/60 backdrop-blur-[2px]">
          <div className="relative flex flex-col items-center gap-1">
            {/* Retro lock icon */}
            <div className="relative">
              {/* Lock shackle */}
              <div className="mx-auto h-6 w-8 rounded-t-full border-4 border-b-0 border-muted-foreground/40 sm:h-7 sm:w-9 md:h-8 md:w-10" />
              {/* Lock body */}
              <div className="relative h-8 w-10 rounded-none border-4 border-muted-foreground/40 bg-muted/40 sm:h-9 sm:w-11 md:h-10 md:w-12">
                {/* Keyhole */}
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                  <div className="size-2 rounded-full bg-muted-foreground/40 sm:size-2.5 md:size-3" />
                  <div className="h-2 w-1 bg-muted-foreground/40 sm:h-2.5 sm:w-1.5 md:h-3 md:w-2" />
                </div>
              </div>
            </div>
            {/* Locked text */}
            <span className="retro text-[0.4rem] uppercase tracking-[0.2em] text-muted-foreground/60 sm:text-[0.45rem] md:text-[0.5rem]">
              Locked
            </span>
          </div>
        </div>
      )}

      <div className="relative flex gap-3 p-3 sm:gap-4 sm:p-4 md:gap-5 md:p-5">
        {/* Icon */}
        <motion.div
          className="flex-shrink-0"
          whileHover={
            achievement.unlocked
              ? {
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1.1, 1.1, 1],
                }
              : {}
          }
          transition={{ duration: 0.5 }}
        >
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-none border-2 text-2xl shadow-inner sm:size-14 sm:border-3 sm:text-3xl md:size-16 md:border-4 md:text-4xl",
              achievement.unlocked
                ? "border-border bg-background/80 dark:border-ring"
                : "border-border/40 bg-background/40 dark:border-ring/40"
            )}
          >
            {achievement.icon}
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "retro text-xs uppercase leading-tight tracking-[0.15em] sm:text-sm sm:tracking-[0.18em] md:text-base md:tracking-[0.2em]",
                  achievement.unlocked
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {achievement.title}
              </h3>
              <span
                className={cn(
                  "retro flex-shrink-0 text-[0.5rem] font-bold tracking-[0.15em] sm:text-[0.6rem] sm:tracking-[0.18em] md:text-xs md:tracking-[0.2em]",
                  achievement.unlocked ? "text-primary" : "text-muted-foreground"
                )}
              >
                {achievement.gamerscore}G
              </span>
            </div>
            <p
              className={cn(
                "retro text-[0.5rem] leading-relaxed tracking-[0.1em] sm:text-[0.6rem] sm:tracking-[0.12em] md:text-xs md:tracking-[0.15em]",
                achievement.unlocked
                  ? "text-muted-foreground"
                  : "text-muted-foreground/60"
              )}
            >
              {achievement.description}
            </p>
          </div>

          {/* Unlocked date and rarity */}
          {achievement.unlocked && (
            <div className="mt-2 flex items-center justify-between sm:mt-2.5 md:mt-3">
              <span className="retro text-[0.45rem] uppercase tracking-[0.15em] text-muted-foreground/80 sm:text-[0.5rem] sm:tracking-[0.18em] md:text-[0.55rem] md:tracking-[0.2em]">
                {achievement.unlockedDate}
              </span>
              {achievement.rarity && achievement.rarity !== "common" && (
                <span
                  className={cn(
                    "retro rounded-none border px-1.5 py-0.5 text-[0.4rem] uppercase tracking-[0.15em] sm:px-2 sm:py-1 sm:text-[0.45rem] sm:tracking-[0.18em] md:text-[0.5rem] md:tracking-[0.2em]",
                    achievement.rarity === "rare" &&
                      "border-blue-500 bg-blue-500/10 text-blue-600 dark:border-blue-400 dark:text-blue-400",
                    achievement.rarity === "legendary" &&
                      "border-amber-500 bg-amber-500/10 text-amber-600 dark:border-amber-400 dark:text-amber-400"
                  )}
                >
                  {achievement.rarity}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Shine effect on hover for unlocked achievements */}
      {achievement.unlocked && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
          }}
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
}

export default AchievementWall;

