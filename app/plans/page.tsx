"use client";

import Image from "next/image";
import QuestLog from "@/components/quest-log";
import LaboratoryExperimentsLog from "@/components/laboratory-experiments-log";
import ChaosMeterDashboard from "@/components/chaos-meter-dashboard";
import WarpDriveTimeline from "@/components/warp-drive-timeline";

export default function PlansPage() {
  const shellClass = "w-full border-4 border-border bg-background p-2 shadow-[8px_8px_0_var(--border)] sm:p-4";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1700px] flex-col gap-6 p-4 text-foreground sm:gap-8 sm:p-6 md:p-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-4 text-center min-[375px]:gap-5 sm:gap-6 md:gap-8">
        <div className="space-y-2 sm:space-y-3">
          <p className="retro text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.35em] md:text-sm md:tracking-[0.4em]">
            Mission Overview
          </p>
          <h1 className="retro text-2xl uppercase leading-tight tracking-[0.2em] sm:text-3xl sm:tracking-[0.25em] md:text-4xl md:tracking-[0.3em]">
            Quest Command Console
          </h1>
          <p className="retro text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
            Active missions, pending objectives, and daily rituals.
          </p>
        </div>
      </section>

      {/* Quest Log Container */}
      <section
        className={`${shellClass} border-dashed border-foreground/50 dark:border-ring/50 relative`}
      >
        {/* Tulips on borders for Ally theme */}
        <div className="pointer-events-none absolute -left-2 top-0 bottom-0 theme-ally:block hidden">
          <Image src="/assets/tulip.png" alt="" width={20} height={40} className="absolute top-4 opacity-60" />
          <Image src="/assets/tulip.png" alt="" width={20} height={40} className="absolute bottom-4 opacity-60" />
        </div>
        <div className="pointer-events-none absolute -right-2 top-0 bottom-0 theme-ally:block hidden">
          <Image src="/assets/tulip.png" alt="" width={20} height={40} className="absolute top-4 opacity-60" />
          <Image src="/assets/tulip.png" alt="" width={20} height={40} className="absolute bottom-4 opacity-60" />
        </div>
        <div className="pointer-events-none absolute left-0 right-0 -top-2 theme-ally:flex hidden justify-between px-4">
          <Image src="/assets/tulip.png" alt="" width={20} height={40} className="opacity-60" />
          <Image src="/assets/tulip.png" alt="" width={20} height={40} className="opacity-60" />
        </div>
        <div className="pointer-events-none absolute left-0 right-0 -bottom-2 theme-ally:flex hidden justify-between px-4">
          <Image src="/assets/tulip.png" alt="" width={20} height={40} className="opacity-60" />
          <Image src="/assets/tulip.png" alt="" width={20} height={40} className="opacity-60" />
        </div>
        <p className="retro mb-4 text-center text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground sm:mb-5 sm:text-xs sm:tracking-[0.3em] md:mb-6 md:text-sm md:tracking-[0.35em]">
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
            <h2 className="retro text-base uppercase tracking-[0.2em] text-foreground sm:text-lg sm:tracking-[0.25em] md:text-xl md:tracking-[0.3em]">
              Quest Philosophy
            </h2>
            <p className="retro text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
              Every great adventure begins with a plan—however chaotic it may be. As a full-stack developer and technical lead, these quests map the real work of designing systems, shipping features, and keeping teams unblocked. Some are grand campaigns that span quarters; others are tight feedback loops that keep the craft sharp day after day.
            </p>
            <p className="retro text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
              As the Guardian of Chaotic Plans, I balance hands-on building with technical direction, mentorship, and architecture. Roadmaps shift, stakeholder needs evolve, and surprise fires appear at 3 AM—but guiding the team through that uncertainty, and still shipping meaningful work, is the core of the adventure.
            </p>
            <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-none border-2 border-border bg-background/80 px-4 py-2 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring sm:mt-5 sm:gap-2.5 sm:border-3 sm:px-5 sm:py-2.5 sm:shadow-[3px_3px_0_var(--border)] md:mt-6 md:gap-3 md:border-4 md:px-6 md:py-3 md:shadow-[4px_4px_0_var(--border)]">
              <span className="text-xl sm:text-2xl md:text-3xl">⚔️</span>
              <div className="text-left">
                <p className="retro text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs sm:tracking-[0.25em] md:text-sm">
                  Current Status
                </p>
                <p className="retro text-base font-bold tracking-[0.15em] text-primary sm:text-lg sm:tracking-[0.2em] md:text-xl md:tracking-[0.25em]">
                  Level 75 Fullstack Developer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

