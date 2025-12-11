"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChaosPlanCategory {
  title: string;
  limit: string;
  plans: string[];
}

interface ChaosEvent {
  id: string;
  title: string;
  impact: "mild" | "major" | "catastrophic";
  description: string;
}

interface RestorationAttempt {
  id: string;
  attempt: string;
  result: string;
}

const chaosLevel = 87;

const planCategories: ChaosPlanCategory[] = [
  {
    title: "Definitely Doing",
    limit: "Max 2 quests",
    plans: ["Ship LockerApp v1", "Pasada stabilization sprint"],
  },
  {
    title: "Probably Doing",
    limit: "5-10 quests",
    plans: [
      "Revo offline mode polish",
      "Revo mobile PWA optimization",
      "Retro UI v2 effects",
      "Add lofi radio to site",
      "Docs refresh",
      "Pasada dispatcher tools",
    ],
  },
  {
    title: "Might Do If I Feel Like It",
    limit: "20+ brain sparks",
    plans: [
      "Global dark mode shader",
      "AI assistant NPC",
      "More pixel pets",
      "Retro terminal theme",
      "Sound FX for buttons",
      "Procedural backgrounds",
      "Sunrise/sunset theme",
      "8-bit achievements API",
      "Mini text adventure",
      "GitHub timeline animation",
      "Portfolio multiplayer? lol",
      "Neon-only mode",
      "Deploy to toaster",
      "Build a chaos meter tamagotchi",
      "Pasada open telemetry",
      "Mood-based theme switcher",
      "Lab assistant chatbot",
      "Goal-tracking hologram",
      "Synthwave playlist generator",
      "Deployable confetti cannon",
    ],
  },
  {
    title: "Abandoned in the Void",
    limit: "graveyard (RIP)",
    plans: [
      "Pasada AR interface",
      "Procedural CSS art every load",
      "Full VR portfolio tour",
      "Auto-magic blog generator",
    ],
  },
];

const chaosEvents: ChaosEvent[] = [
  {
    id: "event-0",
    title: "Shipped Revo Calendar v1",
    impact: "mild",
    description: "LiveCalendar reborn with encryption, Spotify, and aurora vibes. +3 levels.",
  },
  {
    id: "event-1",
    title: "Client scope doubled overnight",
    impact: "catastrophic",
    description: "Metamorphosed into three projects; coffee consumed: 5 cups.",
  },
  {
    id: "event-2",
    title: "Laptop update nuked dev env",
    impact: "major",
    description: "Spent 4 hours reinstalling mysteries. Learned nothing.",
  },
  {
    id: "event-3",
    title: "Random inspiration at 2 AM",
    impact: "mild",
    description: "Started a new feature. Forgot why in the morning.",
  },
];

const restorationAttempts: RestorationAttempt[] = [
  {
    id: "attempt-1",
    attempt: "Created Notion board titled 'Total Order Initiative'",
    result: "Board now has memes and three nested lists called '???'.",
  },
  {
    id: "attempt-2",
    attempt: "Color-coded Google Calendar blocks",
    result: "All blocks merged into one called 'Vibes'.",
  },
  {
    id: "attempt-3",
    attempt: "Weekly review ritual",
    result: "Fell asleep during 'step 2: breathe'.",
  },
];

const randomPlans = [
  "Build a pixelated control room page",
  "Finish documenting Pasada design system",
  "Ship LockerApp onboarding flow",
  "Redesign the blog to look like a logbook",
  "Train a model to roast my old code",
  "Add keyboard-only gameplay to the site",
  "Ship merch with retro stickers",
  "Create a playable retro mini-game",
  "Build a chaos meter CLI",
];

export function ChaosMeterDashboard({ className }: { className?: string }) {
  const [randomPlan, setRandomPlan] = useState<string | null>(null);

  const handleRandomize = () => {
    const pick = randomPlans[Math.floor(Math.random() * randomPlans.length)];
    setRandomPlan(pick);
  };

  return (
    <section className={cn("space-y-4 sm:space-y-5 md:space-y-6", className)}>
      <div className="space-y-2 text-center sm:space-y-2.5 md:space-y-3">
        <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
          Chaotic Planning HQ
        </p>
        <h2 className="retro text-lg uppercase tracking-[0.2em] sm:text-xl sm:tracking-[0.25em] md:text-2xl md:tracking-[0.3em]">
          Chaos Meter Dashboard
        </h2>
        <p className="retro text-[0.55rem] text-muted-foreground sm:text-[0.65rem] md:text-sm">
          Real-time metrics from Fyke&apos;s chaos core. Planning is optional,
          improvisation mandatory.
        </p>
      </div>

      {/* Chaos Level */}
      <div className="rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)] dark:border-ring sm:border-3 sm:p-4 md:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem]">
              Chaos Level
            </p>
            <p className="retro text-3xl font-bold tracking-[0.15em] text-primary sm:text-4xl md:text-5xl">
              {chaosLevel}%
            </p>
            <p className="retro text-[0.45rem] text-muted-foreground sm:text-[0.5rem]">
              Currently: Stable chaos (subject to change)
            </p>
          </div>
          <div className="flex-1">
            <div className="h-3 rounded-none border border-border bg-background dark:border-ring">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${chaosLevel}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground">
              <span>Serene</span>
              <span>Total Pandemonium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Categories */}
      <div className="grid gap-3 lg:grid-cols-2">
        {planCategories.map((category) => (
          <div
            key={category.title}
            className="rounded-none border-2 border-border bg-background/80 p-3 shadow-[2px_2px_0_var(--border)] dark:border-ring sm:border-3 sm:p-4 md:p-5"
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground">
                  {category.limit}
                </p>
                <h3 className="retro text-sm uppercase tracking-[0.18em] text-foreground sm:text-base md:text-lg">
                  {category.title}
                </h3>
              </div>
              <span className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground">
                {category.plans.length} quests
              </span>
            </div>
            <ul className="space-y-1">
              {category.plans.map((plan) => (
                <li
                  key={plan}
                  className="retro rounded-none border border-dashed border-border/70 px-2 py-1 text-[0.45rem] uppercase tracking-[0.15em] text-foreground dark:border-ring/70"
                >
                  • {plan}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Chaos Controls */}
      <div className="grid gap-3 lg:grid-cols-2">
        {/* Randomizer */}
        <div className="rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)] dark:border-ring sm:border-3 sm:p-4 md:p-5">
          <div className="flex flex-col gap-2">
            <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground">
              Random Plan Generator
            </p>
            <p className="retro text-[0.45rem] leading-relaxed tracking-[0.1em] text-muted-foreground">
              Warning: button may reshuffle your life priorities.
            </p>
            <button
              onClick={handleRandomize}
              className="retro rounded-none border-2 border-border bg-primary px-3 py-2 text-[0.45rem] uppercase tracking-[0.2em] text-primary-foreground transition hover:translate-y-0.5 hover:border-primary dark:border-ring sm:px-4 sm:py-2.5 sm:text-[0.5rem]"
            >
              Shuffle Priorities
            </button>
            {randomPlan && (
              <div className="rounded-none border border-dashed border-border/70 bg-background/60 p-2 dark:border-ring/70">
                <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground">
                  Highlighted Quest
                </p>
                <p className="retro text-[0.45rem] tracking-[0.12em] text-foreground">
                  {randomPlan}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chaos Events */}
        <div className="rounded-none border-2 border-border bg-background/85 p-3 shadow-[2px_2px_0_var(--border)] dark:border-ring sm:border-3 sm:p-4 md:p-5">
          <div className="flex items-center justify-between">
            <h3 className="retro text-sm uppercase tracking-[0.18em] text-foreground sm:text-base md:text-lg">
              Chaos Events
            </h3>
            <span className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground">
              Unexpected disruptions
            </span>
          </div>
          <div className="mt-2 space-y-2">
            {chaosEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-none border border-dashed border-border/80 p-2 dark:border-ring/80"
              >
                <div className="flex items-center justify-between">
                  <p className="retro text-[0.45rem] uppercase tracking-[0.15em] text-foreground">
                    {event.title}
                  </p>
                  <span
                    className={cn(
                      "retro text-[0.35rem] uppercase tracking-[0.15em]",
                      event.impact === "catastrophic"
                        ? "text-rose-600 dark:text-rose-400"
                        : event.impact === "major"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-blue-600 dark:text-blue-400"
                    )}
                  >
                    {event.impact}
                  </span>
                </div>
                <p className="retro text-[0.4rem] leading-relaxed tracking-[0.1em] text-muted-foreground">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Restoration Attempts */}
      <div className="rounded-none border-2 border-border bg-card/85 p-3 shadow-[2px_2px_0_var(--border)] dark:border-ring sm:border-3 sm:p-4 md:p-5">
        <div className="flex items-center justify-between">
          <h3 className="retro text-sm uppercase tracking-[0.18em] text-foreground sm:text-base md:text-lg">
            Order Restoration Attempts
          </h3>
          <span className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground">
            Success rate: 0.03%
          </span>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {restorationAttempts.map((attempt) => (
            <div
              key={attempt.id}
              className="rounded-none border border-dashed border-border/80 p-2 text-left dark:border-ring/80"
            >
              <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground">
                Attempt
              </p>
              <p className="retro text-[0.45rem] leading-tight tracking-[0.1em] text-foreground">
                {attempt.attempt}
              </p>
              <p className="retro mt-1 text-[0.35rem] uppercase tracking-[0.15em] text-muted-foreground">
                Result
              </p>
              <p className="retro text-[0.4rem] leading-tight tracking-[0.1em] text-rose-600 dark:text-rose-400">
                {attempt.result}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ChaosMeterDashboard;

