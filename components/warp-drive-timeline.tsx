"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type TimelineType = "experiment" | "chaos" | "quest";
type TimelineStatus = "ongoing" | "success" | "failed";

interface TimelineItem {
  id: string;
  title: string;
  type: TimelineType;
  status: TimelineStatus;
  description: string;
  week: number; // 1-6 across warp timeline
  intensity?: "normal" | "warp";
}

const timelineItems: TimelineItem[] = [
  {
    id: "exp-pasada",
    title: "Pasada Stabilization",
    type: "experiment",
    status: "ongoing",
    description: "Live monitoring upgrade + routing rituals.",
    week: 1,
    intensity: "warp",
  },
  {
    id: "quest-locker",
    title: "Locker Vault Hardening",
    type: "quest",
    status: "ongoing",
    description: "Multi-tenant warding and audit UI charm.",
    week: 2,
  },
  {
    id: "chaos-laptop",
    title: "Laptop Update Catastrophe",
    type: "chaos",
    status: "failed",
    description: "Reinstall dimension for 4 hours.",
    week: 2,
    intensity: "warp",
  },
  {
    id: "quest-retro",
    title: "Retro Lab UI V2",
    type: "quest",
    status: "success",
    description: "Pixel signage + motion trails deployed.",
    week: 3,
  },
  {
    id: "exp-ci",
    title: "CI Summoning Circle",
    type: "experiment",
    status: "failed",
    description: "Flaky familiars refused to cooperate.",
    week: 3,
    intensity: "warp",
  },
  {
    id: "chaos-scope",
    title: "Client Scope Mutation",
    type: "chaos",
    status: "ongoing",
    description: "Project suddenly split into three hydra heads.",
    week: 4,
    intensity: "warp",
  },
  {
    id: "quest-docs",
    title: "Documentation Scrolls",
    type: "quest",
    status: "ongoing",
    description: "Trying to tame the lore for future allies.",
    week: 4,
  },
  {
    id: "exp-portfolio",
    title: "Lab Portal Animations",
    type: "experiment",
    status: "success",
    description: "Completed retro timeline + power pellets.",
    week: 5,
  },
  {
    id: "chaos-midnight",
    title: "Midnight Inspiration Spike",
    type: "chaos",
    status: "ongoing",
    description: "Started 3 side projects accidentally.",
    week: 5,
  },
  {
    id: "quest-ci-fix",
    title: "CI/Triage Attempt",
    type: "quest",
    status: "failed",
    description: "Order restoration attempt #47.",
    week: 6,
  },
  {
    id: "exp-mood-theme",
    title: "Mood-based Theme Switcher",
    type: "experiment",
    status: "ongoing",
    description: "Prototype reading chaos levels to adjust palette.",
    week: 6,
  },
];

const typeStyles: Record<
  TimelineType,
  { label: string; color: string; bg: string }
> = {
  experiment: {
    label: "Experiment",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/20",
  },
  chaos: {
    label: "Chaos Event",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/20",
  },
  quest: {
    label: "Quest",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/20",
  },
};

export function WarpDriveTimeline({ className }: { className?: string }) {
  const [showSuccessOnly, setShowSuccessOnly] = useState(false);
  const [highlightMeltdowns, setHighlightMeltdowns] = useState(false);

  const displayItems = useMemo(() => {
    return timelineItems.filter((item) => {
      if (showSuccessOnly && item.status !== "success") {
        return false;
      }
      return true;
    });
  }, [showSuccessOnly]);

  return (
    <section className={cn("space-y-4 sm:space-y-5 md:space-y-6", className)}>
      <div className="space-y-2 text-center sm:space-y-2.5 md:space-y-3">
        <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
          Warp Lab Scheduler
        </p>
        <h2 className="retro text-lg uppercase tracking-[0.2em] sm:text-xl sm:tracking-[0.25em] md:text-2xl md:tracking-[0.3em]">
          Experiment Timeline
        </h2>
        <p className="retro text-[0.55rem] text-muted-foreground sm:text-[0.65rem] md:text-sm">
          Visual map of experiments, chaos events, and quests colliding over the
          next six warp cycles.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <button
          onClick={() => setShowSuccessOnly((prev) => !prev)}
          className={cn(
            "retro rounded-none border-2 px-3 py-1.5 text-[0.45rem] uppercase tracking-[0.18em] transition sm:border-3 sm:text-[0.5rem]",
            showSuccessOnly
              ? "border-primary bg-primary text-primary-foreground shadow-[3px_3px_0_var(--primary)]"
              : "border-border bg-card/80 text-foreground shadow-[2px_2px_0_var(--border)] hover:border-primary hover:bg-accent dark:border-ring"
          )}
        >
          {showSuccessOnly ? "Showing Success Only" : "Show Success Only"}
        </button>
        <button
          onClick={() => setHighlightMeltdowns((prev) => !prev)}
          className={cn(
            "retro rounded-none border-2 px-3 py-1.5 text-[0.45rem] uppercase tracking-[0.18em] transition sm:border-3 sm:text-[0.5rem]",
            highlightMeltdowns
              ? "border-rose-500 bg-rose-500 text-white shadow-[3px_3px_0_var(--rose-500)]"
              : "border-border bg-card/80 text-foreground shadow-[2px_2px_0_var(--border)] hover:border-rose-500 hover:bg-rose-500/10 dark:border-ring"
          )}
        >
          {highlightMeltdowns ? "Meltdown Highlight: ON" : "Highlight Meltdowns"}
        </button>
      </div>

      {/* Timeline */}
      <div className="rounded-none border-2 border-foreground/60 bg-background/80 p-3 shadow-[2px_2px_0_var(--border)] dark:border-ring sm:border-3 sm:p-4 md:p-5">
        <div className="relative overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Timeline grid background */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)",
                backgroundSize: "100px",
              }}
            />

            <div className="relative">
              {/* Week labels */}
              <div className="mb-2 grid grid-cols-6 text-center">
                {[1, 2, 3, 4, 5, 6].map((week) => (
                  <div key={week}>
                    <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground">
                      Warp Week {week}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((week) => {
                  const weekItems = displayItems.filter(
                    (item) => item.week === week
                  );

                  return (
                    <div
                      key={week}
                      className="rounded-none border border-dashed border-border/60 bg-card/70 p-2 dark:border-ring/60"
                    >
                      <div className="space-y-2">
                        {weekItems.length === 0 ? (
                          <p className="retro text-[0.4rem] text-muted-foreground">
                            Idle space...
                          </p>
                        ) : (
                          weekItems.map((item) => (
                            <div
                              key={item.id}
                              className={cn(
                                "rounded-none border px-2 py-1 shadow-[1px_1px_0_var(--border)] transition",
                                typeStyles[item.type].bg,
                                typeStyles[item.type].color,
                                item.intensity === "warp" &&
                                  "ring-1 ring-offset-[1px] ring-offset-background animate-pulse",
                                highlightMeltdowns &&
                                  item.type === "chaos" &&
                                  "border-rose-500 text-rose-600 dark:text-rose-400"
                              )}
                            >
                              <p className="retro text-[0.4rem] uppercase tracking-[0.12em]">
                                {item.title}
                              </p>
                              <p className="retro text-[0.35rem] text-muted-foreground">
                                {item.description}
                              </p>
                              <p className="retro text-[0.35rem] uppercase tracking-[0.15em]">
                                {item.status === "success"
                                  ? "✅ Success"
                                  : item.status === "failed"
                                  ? "💀 Failed"
                                  : "🧪 Ongoing"}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WarpDriveTimeline;

