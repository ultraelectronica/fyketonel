"use client";

import { useMediaQuery } from "react-responsive";
import QuestLog from "@/components/quest-log";
import LaboratoryExperimentsLog from "@/components/laboratory-experiments-log";
import ChaosMeterDashboard from "@/components/chaos-meter-dashboard";
import WarpDriveTimeline from "@/components/warp-drive-timeline";

export default function PlansPage() {
  // Detect screen sizes
  const isVerySmall = useMediaQuery({ maxWidth: 374 });
  const isSmall = useMediaQuery({ minWidth: 375, maxWidth: 639 });

  // Simple client-side check
  const isClient = typeof window !== 'undefined' && (isVerySmall !== undefined || isSmall !== undefined);

  // Dynamic classes based on screen size
  const shellClass = isClient && isVerySmall
    ? "rounded-none border border-border bg-card/80 p-2 shadow-[1px_1px_0_var(--border)] backdrop-blur-sm dark:border-ring"
    : isClient && isSmall
    ? "rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring"
    : "rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring min-[375px]:border-3 min-[375px]:p-4 min-[375px]:shadow-[3px_3px_0_var(--border)] sm:border-4 sm:p-6 sm:shadow-[6px_6px_0_var(--border)] md:p-8 md:shadow-[8px_8px_0_var(--border)]";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[95vw] flex-col gap-6 px-3 py-6 text-foreground min-[375px]:gap-7 min-[375px]:px-4 min-[375px]:py-8 sm:gap-10 sm:px-6 sm:py-12 md:gap-12 md:py-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-3 text-center min-[375px]:gap-4 sm:gap-5 md:gap-6">
        <div className="space-y-2 sm:space-y-3">
          <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
            Mission Overview
          </p>
          <h1 className="retro text-xl uppercase leading-tight tracking-[0.2em] sm:text-2xl sm:tracking-[0.25em] md:text-3xl md:tracking-[0.3em]">
            Quest Command Console
          </h1>
          <p className="retro text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
            Active missions, pending objectives, and daily rituals.
          </p>
        </div>
      </section>

      {/* Quest Log Container */}
      <section
        className={`${shellClass} border-dashed border-foreground/50 dark:border-ring/50`}
      >
        <p className="retro mb-4 text-center text-[0.5rem] uppercase tracking-[0.25em] text-muted-foreground sm:mb-5 sm:text-[0.6rem] sm:tracking-[0.3em] md:mb-6 md:text-xs md:tracking-[0.35em]">
          Active Quest Log
        </p>
        <QuestLog />
      </section>

      {/* Laboratory Experiments */}
      <section
        className={`${shellClass} border-dashed border-foreground/50 dark:border-ring/50`}
      >
        <LaboratoryExperimentsLog />
      </section>

      {/* Chaos Meter */}
      <section
        className={`${shellClass} border-dashed border-foreground/50 dark:border-ring/50`}
      >
        <ChaosMeterDashboard />
      </section>

      {/* Experiment Timeline */}
      <section
        className={`${shellClass} border-dashed border-foreground/50 dark:border-ring/50`}
      >
        <WarpDriveTimeline />
      </section>

      {/* Additional Info Section */}
      <section className="space-y-3 text-center min-[375px]:space-y-4 sm:space-y-5 md:space-y-6">
        <div className={`${shellClass} border-dashed border-foreground/50 dark:border-ring/50`}>
          <div className="space-y-3 sm:space-y-4">
            <h2 className="retro text-sm uppercase tracking-[0.2em] text-foreground sm:text-base sm:tracking-[0.25em] md:text-lg md:tracking-[0.3em]">
              Quest Philosophy
            </h2>
            <p className="retro text-[0.5rem] leading-relaxed text-muted-foreground sm:text-xs md:text-sm">
              Every great adventure begins with a plan—however chaotic it may be. These quests represent my current objectives in the ever-evolving landscape of software development. Some are grand campaigns requiring months of dedication, while others are daily rituals that keep my skills sharp and my progress steady.
            </p>
            <p className="retro text-[0.5rem] leading-relaxed text-muted-foreground sm:text-xs md:text-sm">
              As the Guardian of Chaotic Plans, I embrace the unpredictable nature of development. Quests may shift, new challenges may emerge, and unexpected opportunities may alter the path forward. But that&apos;s all part of the adventure.
            </p>
            <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-none border-2 border-border bg-background/80 px-4 py-2 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring sm:mt-5 sm:gap-2.5 sm:border-3 sm:px-5 sm:py-2.5 sm:shadow-[3px_3px_0_var(--border)] md:mt-6 md:gap-3 md:border-4 md:px-6 md:py-3 md:shadow-[4px_4px_0_var(--border)]">
              <span className="text-xl sm:text-2xl md:text-3xl">⚔️</span>
              <div className="text-left">
                <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.25em] md:text-xs">
                  Current Status
                </p>
                <p className="retro text-sm font-bold tracking-[0.15em] text-primary sm:text-base sm:tracking-[0.2em] md:text-lg md:tracking-[0.25em]">
                  Level 54 Developer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

