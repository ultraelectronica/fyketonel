"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PixelArtProps {
  pattern: string[];
  palette: Record<string, string>;
  size?: number;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: "main" | "side" | "daily";
  status: "not-started" | "in-progress" | "completed" | "failed";
  difficulty: 1 | 2 | 3 | 4 | 5; // 1-5 skulls
  rewards: {
    exp?: number;
    skills?: string[];
    achievement?: string;
  };
  timeEstimate?: string;
  failureMessage?: string;
  pixelArt: React.ReactNode;
}

// Pixel grid helper for 8-bit icons
const PixelArt = ({ pattern, palette, size = 6 }: PixelArtProps) => {
  const columns = pattern[0]?.length ?? 0;

  return (
    <div
      className="inline-grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, ${size}px)`,
        gap: 0,
      }}
    >
      {pattern.map((row, rowIndex) =>
        row.split("").map((cell, cellIndex) => (
          <span
            key={`${rowIndex}-${cellIndex}`}
            style={{
              width: size,
              height: size,
              backgroundColor: palette[cell] ?? "transparent",
            }}
          />
        ))
      )}
    </div>
  );
};

// 8-bit Quest Icons
const ShieldPixel = () => (
  <PixelArt
    pattern={[
      "..SSSSSS..",
      ".SLLLLLLS.",
      "SLGGGGGGGS",
      "SLGAAAAGLS",
      "SLGAAAAGLS",
      "SLGAAAAGLS",
      "SLGAAAAGLS",
      "SLGGAGGLS",
      ".SLGGGGLS.",
      ".SLGGGLS.",
      "..SLGLS..",
      "..SLLS...",
      "...SS....",
    ]}
    palette={{
      ".": "transparent",
      S: "#1e293b", // Dark border
      L: "#64748b", // Light gray edge
      G: "#94a3b8", // Silver body
      A: "#facc15", // Gold emblem
    }}
  />
);

const ScrollPixel = () => (
  <PixelArt
    pattern={[
      "..TTTTTT..",
      ".TLLLLLLT.",
      "TLFFFFFFLT",
      "TLFFFFFFLT",
      "TLFFFFFFLT",
      ".TLLLLLLT.",
      "..TTTTTT..",
      "..TTTTTT..",
      ".TT....TT.",
      ".TT....TT.",
      "..TTTTTT..",
    ]}
    palette={{
      ".": "transparent",
      T: "#f5d0a9",
      L: "#fde4c8",
      F: "#78350f",
    }}
  />
);

const ClockPixel = () => (
  <PixelArt
    pattern={[
      "..CCCCCC..",
      ".CBBBBBBC.",
      "CBBWWWWBBC",
      "CBWHHHWWBC",
      "CBWHHHWWBC",
      "CBBWWWWBBC",
      ".CBBBBBBC.",
      "..CCCCCC..",
    ]}
    palette={{
      ".": "transparent",
      C: "#94a3b8",
      B: "#475569",
      W: "#f8fafc",
      H: "#ef4444",
    }}
  />
);

const NetworkPixel = () => (
  <PixelArt
    pattern={[
      "NN......NN",
      "NN......NN",
      "..LL..LL..",
      "..LL..LL..",
      "...CCCC...",
      "...CCCC...",
      "..LL..LL..",
      "..LL..LL..",
      "NN......NN",
      "NN......NN",
    ]}
    palette={{
      ".": "transparent",
      N: "#38bdf8",
      L: "#0ea5e9",
      C: "#14b8a6",
    }}
  />
);

const ToolboxPixel = () => (
  <PixelArt
    pattern={[
      "..HHHHHH..",
      "..HHHHHH..",
      ".TTTTTTTT.",
      "TRRRRRRRT",
      "TRRRRRRRT",
      "TRRRRRRRT",
      ".TTTTTTTT.",
      "..PPPPPP..",
      "..PPPPPP..",
    ]}
    palette={{
      ".": "transparent",
      H: "#f97316",
      T: "#fbbf24",
      R: "#dc2626",
      P: "#7c2d12",
    }}
  />
);

const CompassPixel = () => (
  <PixelArt
    pattern={[
      "..CCCCCC..",
      ".CBBBBBBC.",
      "CBWWWWWWBC",
      "CBWWNWWWBC",
      "CBWWWNWWBC",
      "CBWWWWWWBC",
      ".CBBBBBBC.",
      "..CCCCCC..",
    ]}
    palette={{
      ".": "transparent",
      C: "#fed7aa",
      B: "#ea580c",
      W: "#fff7ed",
      N: "#dc2626",
    }}
  />
);

export const quests: Quest[] = [
  {
    id: "maintain-pasada",
    title: "Guardian of the Pasada Realm",
    description: "Oversee and maintain the thriving Pasada ecosystem—ensuring stability, responding to distress signals, and keeping the transport network operational across all dimensions.",
    type: "main",
    status: "in-progress",
    difficulty: 4,
    rewards: {
      exp: 5000,
      skills: ["System Maintenance", "Bug Extermination", "User Support"],
      achievement: "Realm Keeper",
    },
    timeEstimate: "Ongoing eternal vigil",
    pixelArt: <NetworkPixel />,
  },
  {
    id: "fortify-pasada",
    title: "Fortify the Pasada Core Systems",
    description: "Reinforce the backbone infrastructure of Pasada with enhanced architecture, optimized performance spells, and fortified security wards to withstand future challenges.",
    type: "main",
    status: "in-progress",
    difficulty: 5,
    rewards: {
      exp: 8000,
      skills: ["Architecture Mastery", "Performance Optimization", "Security Enchantment"],
      achievement: "Infrastructure Architect",
    },
    timeEstimate: "2-3 seasons",
    pixelArt: <ToolboxPixel />,
  },
  {
    id: "complete-locker",
    title: "Seal the Locker Vault Project",
    description: "Complete the legendary LockerApp—a secure digital vault for safeguarding treasures and artifacts. The vault has been shipped; ongoing tweaks focus on making the guardian experience smoother for everyday users.",
    type: "main",
    status: "completed",
    difficulty: 3,
    rewards: {
      exp: 3500,
      skills: ["Project Completion", "Polish & Refinement"],
      achievement: "Vault Master",
    },
    timeEstimate: "Completed arc",
    pixelArt: <ShieldPixel />,
  },
  {
    id: "scout-new-quest",
    title: "Scout for New Adventures",
    description: "Venture into the unknown territories of ideation and discovery. Survey the landscape for the next useful project that shall benefit fellow travelers in the digital realm.",
    type: "side",
    status: "not-started",
    difficulty: 2,
    rewards: {
      exp: 2000,
      skills: ["Creative Thinking", "Problem Discovery"],
      achievement: "Visionary Explorer",
    },
    timeEstimate: "Continuous exploration",
    pixelArt: <CompassPixel />,
  },
  {
    id: "daily-commit",
    title: "Forge Daily Commits",
    description: "Maintain the sacred ritual of daily commits to the GitHub codex. Each contribution strengthens your legacy and keeps your skills sharp.",
    type: "daily",
    status: "in-progress",
    difficulty: 1,
    rewards: {
      exp: 50,
      skills: ["Consistency", "Discipline"],
    },
    timeEstimate: "15-60 minutes daily",
    pixelArt: <ClockPixel />,
  },
  {
    id: "daily-docs",
    title: "Study the Documentation Scrolls",
    description: "Dedicate time to reading sacred documentation, technical articles, and ancient wisdom from fellow developers to expand your knowledge.",
    type: "daily",
    status: "in-progress",
    difficulty: 1,
    rewards: {
      exp: 30,
      skills: ["Knowledge", "Continuous Learning"],
    },
    timeEstimate: "30 minutes daily",
    pixelArt: <ScrollPixel />,
  },
];

export function QuestLog({ className }: { className?: string }) {
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "main" | "side" | "daily">("all");

  const filteredQuests = filter === "all" 
    ? quests 
    : quests.filter(q => q.type === filter);

  const stats = {
    total: quests.length,
    completed: quests.filter(q => q.status === "completed").length,
    inProgress: quests.filter(q => q.status === "in-progress").length,
    notStarted: quests.filter(q => q.status === "not-started").length,
  };

  return (
    <section className={cn("relative space-y-4 sm:space-y-5 md:space-y-6", className)}>
      {/* Quest Stats */}
      <div className="flex justify-center">
        <div className="inline-block rounded-none border-2 border-border bg-card/80 px-3 py-2 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring sm:border-3 sm:px-4 sm:py-2.5 sm:shadow-[3px_3px_0_var(--border)] md:border-4 md:px-5 md:py-3 md:shadow-[4px_4px_0_var(--border)]">
          <p className="retro mb-2 text-center text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:mb-2.5 sm:text-[0.6rem] sm:tracking-[0.25em] md:text-xs md:tracking-[0.3em]">
            Quest Progress
          </p>
        <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="text-center">
            <p className="retro text-lg font-bold text-primary sm:text-xl md:text-2xl">{stats.total}</p>
            <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">Total</p>
          </div>
          <div className="text-center">
            <p className="retro text-lg font-bold text-green-600 dark:text-green-400 sm:text-xl md:text-2xl">{stats.completed}</p>
            <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">Done</p>
          </div>
          <div className="text-center">
            <p className="retro text-lg font-bold text-blue-600 dark:text-blue-400 sm:text-xl md:text-2xl">{stats.inProgress}</p>
            <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">Active</p>
          </div>
          <div className="text-center">
            <p className="retro text-lg font-bold text-gray-600 dark:text-gray-400 sm:text-xl md:text-2xl">{stats.notStarted}</p>
            <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">Pending</p>
          </div>
        </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {["all", "main", "side", "daily"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as typeof filter)}
            className={cn(
              "retro rounded-none border-2 px-3 py-1.5 text-[0.5rem] uppercase tracking-[0.2em] transition-all sm:border-3 sm:px-4 sm:py-2 sm:text-[0.6rem] sm:tracking-[0.25em] md:text-xs md:tracking-[0.3em]",
              filter === f
                ? "border-primary bg-primary text-primary-foreground shadow-[3px_3px_0_var(--primary)] sm:shadow-[4px_4px_0_var(--primary)]"
                : "border-border bg-card/80 text-foreground shadow-[2px_2px_0_var(--border)] hover:border-primary hover:bg-accent dark:border-ring sm:shadow-[3px_3px_0_var(--border)]"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Quest Cards */}
      <div className="grid gap-3 sm:gap-4 md:gap-5 lg:grid-cols-2">
        {filteredQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            isSelected={selectedQuest === quest.id}
            onSelect={() => setSelectedQuest(selectedQuest === quest.id ? null : quest.id)}
          />
        ))}
      </div>
    </section>
  );
}

function QuestCard({
  quest,
  isSelected,
  onSelect,
}: {
  quest: Quest;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const typeColors = {
    main: "border-amber-500 dark:border-amber-400",
    side: "border-blue-500 dark:border-blue-400",
    daily: "border-green-500 dark:border-green-400",
  };

  const typeLabels = {
    main: "Main Quest",
    side: "Side Quest",
    daily: "Daily Quest",
  };

  const statusColors = {
    "not-started": "text-gray-600 dark:text-gray-400",
    "in-progress": "text-blue-600 dark:text-blue-400",
    "completed": "text-green-600 dark:text-green-400",
    "failed": "text-red-600 dark:text-red-400",
  };

  const statusLabels = {
    "not-started": "Not Started",
    "in-progress": "In Progress",
    "completed": "Completed",
    "failed": "Failed",
  };

  return (
    <motion.div
      layout
      className={cn(
        "group relative cursor-pointer rounded-none border-2 backdrop-blur-sm transition-all duration-200 sm:border-3 md:border-4",
        typeColors[quest.type],
        quest.status === "completed"
          ? "bg-gradient-to-br from-card/80 to-green-500/10 opacity-80"
          : quest.status === "failed"
          ? "bg-gradient-to-br from-card/80 to-red-500/10 opacity-70"
          : "bg-gradient-to-br from-card/80 to-card/60",
        "shadow-[2px_2px_0_var(--border)] hover:bg-accent/30 hover:border-primary hover:-translate-y-1 sm:shadow-[3px_3px_0_var(--border)] sm:hover:shadow-[4px_4px_0_var(--primary)] md:shadow-[4px_4px_0_var(--border)]"
      )}
      onClick={onSelect}
    >
      <div className="flex gap-3 p-3 sm:gap-4 sm:p-4 md:gap-5 md:p-5">
        {/* Quest Icon */}
        <div className="flex-shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-none border-2 bg-background/80 shadow-inner dark:border-ring sm:h-20 sm:w-20 sm:border-3 md:h-24 md:w-24 md:border-4">
            {quest.pixelArt}
          </div>
        </div>

        {/* Quest Content */}
        <div className="flex-1 space-y-2 sm:space-y-2.5 md:space-y-3">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <span className={cn(
                "retro text-[0.4rem] uppercase tracking-[0.15em] sm:text-[0.45rem] sm:tracking-[0.18em] md:text-[0.5rem] md:tracking-[0.2em]",
                typeColors[quest.type].replace("border-", "text-")
              )}>
                {typeLabels[quest.type]}
              </span>
              <span className={cn(
                "retro text-[0.4rem] font-bold uppercase tracking-[0.15em] sm:text-[0.45rem] sm:tracking-[0.18em] md:text-[0.5rem] md:tracking-[0.2em]",
                statusColors[quest.status]
              )}>
                {statusLabels[quest.status]}
              </span>
            </div>
            <h3 className="retro text-xs uppercase leading-tight tracking-[0.15em] text-foreground sm:text-sm sm:tracking-[0.18em] md:text-base md:tracking-[0.2em]">
              {quest.title}
            </h3>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-1">
            <span className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">
              Difficulty:
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "text-xs sm:text-sm md:text-base",
                    i < quest.difficulty ? "opacity-100" : "opacity-30"
                  )}
                >
                  💀
                </span>
              ))}
            </div>
          </div>

          {/* Expandable Details */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 border-t-2 border-dashed border-border pt-2 dark:border-ring sm:space-y-2.5 sm:pt-2.5 md:space-y-3 md:pt-3">
                  {/* Description */}
                  <p className="retro text-[0.45rem] leading-relaxed tracking-[0.1em] text-muted-foreground sm:text-[0.5rem] sm:tracking-[0.12em] md:text-[0.55rem] md:tracking-[0.15em]">
                    {quest.description}
                  </p>

                  {/* Time Estimate */}
                  {quest.timeEstimate && (
                    <div className="flex items-center gap-1.5">
                      <span className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">
                        ⏱️ Time:
                      </span>
                      <span className="retro text-[0.4rem] tracking-[0.1em] text-foreground sm:text-[0.45rem] md:text-[0.5rem]">
                        {quest.timeEstimate}
                      </span>
                    </div>
                  )}

                  {/* Rewards */}
                  <div className="space-y-1">
                    <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">
                      🎁 Rewards:
                    </p>
                    <div className="space-y-0.5">
                      {quest.rewards.exp && (
                        <p className="retro text-[0.4rem] tracking-[0.1em] text-green-600 dark:text-green-400 sm:text-[0.45rem] md:text-[0.5rem]">
                          • +{quest.rewards.exp} EXP
                        </p>
                      )}
                      {quest.rewards.skills && quest.rewards.skills.map((skill, i) => (
                        <p key={i} className="retro text-[0.4rem] tracking-[0.1em] text-blue-600 dark:text-blue-400 sm:text-[0.45rem] md:text-[0.5rem]">
                          • +{skill}
                        </p>
                      ))}
                      {quest.rewards.achievement && (
                        <p className="retro text-[0.4rem] tracking-[0.1em] text-amber-600 dark:text-amber-400 sm:text-[0.45rem] md:text-[0.5rem]">
                          • Achievement: &quot;{quest.rewards.achievement}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Failure Message */}
                  {quest.status === "failed" && quest.failureMessage && (
                    <div className="rounded-none border-2 border-red-500 bg-red-500/10 p-2">
                      <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-red-600 dark:text-red-400 sm:text-[0.45rem] md:text-[0.5rem]">
                        ⚠️ {quest.failureMessage}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click indicator */}
      <div className="absolute bottom-1 right-1 text-[0.35rem] uppercase tracking-[0.1em] text-muted-foreground/50 sm:bottom-1.5 sm:right-1.5 sm:text-[0.4rem] md:text-[0.45rem]">
        {isSelected ? "▲ collapse" : "▼ expand"}
      </div>

      {/* Shine effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
        }}
      />
    </motion.div>
  );
}

export default QuestLog;

