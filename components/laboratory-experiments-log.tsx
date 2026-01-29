"use client";

import { cn } from "@/lib/utils";

interface Experiment {
  id: string;
  title: string;
  progress: number;
  hypothesis: string;
  variables: string[];
  status: "ongoing" | "success" | "failed";
  statusNote: string;
  labNotes: string;
  equipment: string[];
  expectedResult: string;
  actualResult: string;
}

const statusStyles: Record<
  Experiment["status"],
  { label: string; color: string; bg: string; icon: string }
> = {
  ongoing: {
    label: "In Progress",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500 dark:border-blue-400",
    icon: "🧪",
  },
  success: {
    label: "Successful",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10 border-green-500 dark:border-green-400",
    icon: "✅",
  },
  failed: {
    label: "Needs Recalibration",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10 border-rose-500 dark:border-rose-400",
    icon: "💀",
  },
};

const experiments: Experiment[] = [
  {
    id: "pasada-lab",
    title: "Pasada: Realm Stabilization Protocol",
    progress: 78,
    hypothesis:
      "If I reinforce the transport layer with real-time monitoring, passenger experiences will remain stable across dimensions.",
    variables: [
      "Edge caching strategy",
      "WebSocket diagnostics",
      "User feedback telemetry",
    ],
    status: "ongoing",
    statusNote: "Timeline stretched due to unexpected goblin traffic spikes.",
    labNotes:
      "Currently experimenting with circuit breakers. Need better visual diagnostics for dispatchers.",
    equipment: ["TypeScript", "React Query", "Grafana", "Vercel Edge"],
    expectedResult:
      "Latency below 150ms globally with zero transport anomalies.",
    actualResult:
      "Sitting at ~190ms average; anomalies down 62% but still popping up on peak hours.",
  },
  {
    id: "locker-vault",
    title: "LockerApp Vault Hardening Ritual",
    progress: 100,
    hypothesis:
      "Encrypting artifacts per tenant + implementing proactive auditing will discourage treasure thieves.",
    variables: [
      "Multi-tenant schema",
      "Activity trail depth",
      "Encryption rotation cadence",
    ],
    status: "success",
    statusNote:
      "Vault shipped to production with a clean review—ongoing tweaks now focus on UX polish.",
    labNotes:
      "Discovered that rotating keys too often confuses the familiars (aka background jobs). Need better ceremony.",
    equipment: ["Node.js", "PostgreSQL", "Prisma", "Clerk", "ShadCN"],
    expectedResult: "Pass security review with zero critical findings.",
    actualResult:
      "Passed review with no critical issues; audit trail and alerts hardened post-launch.",
  },
  {
    id: "folio-retro",
    title: "Fyke's Laboratory Retro Interface",
    progress: 92,
    hypothesis:
      "Leaning fully into 8-bit chaos will increase memorability and make recruiters smile.",
    variables: [
      "Pixel density per component",
      "Interactive easter eggs",
      "Dark mode neon levels",
    ],
    status: "success",
    statusNote:
      "Visitors reported +300% more 'this is sick' reactions. Mission accomplished.",
    labNotes:
      "Need to document the design system so future experiments don't accidentally break the retro illusion.",
    equipment: ["Next.js", "Tailwind", "Framer Motion", "ShadCN Retro Kit"],
    expectedResult: "Craft a playful lab showcase that still feels pro.",
    actualResult:
      "Achieved! Responsive, performant, and the lab theme ties every page together.",
  },
  {
    id: "ci-failure",
    title: "CI/CD Summoning Circle",
    progress: 28,
    hypothesis:
      "Automating deployments will let me nap more while builds bless themselves.",
    variables: ["GitHub Actions", "Playwright tests", "Preview deployments"],
    status: "failed",
    statusNote:
      "Playwright insisted on opening a portal to the void (aka flaky tests).",
    labNotes:
      "Need to isolate the flaky dimension first. Might summon Docker familiars to contain the chaos.",
    equipment: ["GitHub Actions", "Docker", "Playwright", "Vercel CLI"],
    expectedResult: "One-click deployments with visual regression gates.",
    actualResult:
      "Half-assembled ritual circle. Manual deployments still happening until I fix the haunted tests.",
  },
];

export function LaboratoryExperimentsLog({ className }: { className?: string }) {
  return (
    <section className={cn("space-y-4 sm:space-y-5 md:space-y-6", className)}>
      <div className="space-y-2 text-center sm:space-y-2.5 md:space-y-3">
        <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
          Lab Status Board
        </p>
        <h2 className="retro text-lg uppercase tracking-[0.2em] sm:text-xl sm:tracking-[0.25em] md:text-2xl md:tracking-[0.3em]">
          Laboratory Experiments Log
        </h2>
        <p className="retro text-[0.55rem] text-muted-foreground sm:text-[0.65rem] md:text-sm">
          Current experiments running inside Fyke&apos;s Laboratory—complete with
          hypotheses, variables, and questionable coffee-fueled conclusions.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        {experiments.map((experiment) => {
          const status = statusStyles[experiment.status];

          return (
            <div
              key={experiment.id}
              className="group relative flex flex-col gap-3 rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)] transition-all duration-200 hover:border-primary hover:bg-accent/20 hover:shadow-[4px_4px_0_var(--primary)] dark:border-ring sm:border-3 sm:p-4 md:p-5"
            >
              {/* Header */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="retro text-sm uppercase leading-tight tracking-[0.18em] text-foreground sm:text-base md:text-lg">
                    {experiment.title}
                  </h3>
                  <div
                    className={cn(
                      "rounded-none border px-2 py-0.5 text-[0.4rem] uppercase tracking-[0.15em] sm:text-[0.45rem]",
                      status.bg,
                      status.color
                    )}
                  >
                    {status.icon} {status.label}
                  </div>
                </div>
                <p className="retro text-[0.45rem] leading-relaxed tracking-[0.1em] text-muted-foreground sm:text-[0.5rem] md:text-[0.55rem]">
                  Hypothesis: {experiment.hypothesis}
                </p>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem]">
                    Active Experiment
                  </span>
                  <span className="retro text-[0.45rem] font-bold tracking-[0.15em] text-primary sm:text-[0.5rem]">
                    {experiment.progress}%
                  </span>
                </div>
                <div className="h-2 rounded-none border border-border bg-background dark:border-ring">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${experiment.progress}%` }}
                  />
                </div>
                <p className="retro text-[0.4rem] tracking-[0.12em] text-muted-foreground">
                  {experiment.statusNote}
                </p>
              </div>

              {/* Variables & Equipment */}
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-none border border-dashed border-border/70 p-2 dark:border-ring/70">
                  <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground">
                    Variables Under Test
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {experiment.variables.map((variable) => (
                      <li
                        key={variable}
                        className="retro text-[0.4rem] tracking-[0.1em] text-foreground sm:text-[0.45rem]"
                      >
                        • {variable}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-none border border-dashed border-border/70 p-2 dark:border-ring/70">
                  <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground">
                    Equipment Needed
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {experiment.equipment.map((tool) => (
                      <span
                        key={tool}
                        className="retro rounded-none border border-border px-1.5 py-0.5 text-[0.35rem] uppercase tracking-[0.1em] text-muted-foreground dark:border-ring sm:text-[0.4rem]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expected vs Actual */}
              <div className="rounded-none border border-border/80 bg-background/80 p-2 dark:border-ring/80">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-green-600 dark:text-green-400">
                      Expected Result
                    </p>
                    <p className="retro text-[0.45rem] leading-relaxed tracking-[0.1em] text-foreground">
                      {experiment.expectedResult}
                    </p>
                  </div>
                  <div>
                    <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-amber-600 dark:text-amber-400">
                      Actual Result
                    </p>
                    <p className="retro text-[0.45rem] leading-relaxed tracking-[0.1em] text-foreground">
                      {experiment.actualResult}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lab Notes */}
              <div className="rounded-none border border-border bg-background/70 p-2 dark:border-ring">
                <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground">
                  Lab Notes
                </p>
                <p className="retro text-[0.45rem] leading-relaxed tracking-[0.1em] text-foreground">
                  {experiment.labNotes}
                </p>
              </div>

              {/* Decorative corner */}
              <div className="pointer-events-none absolute inset-x-2 top-2 flex justify-between text-[0.35rem] uppercase tracking-[0.15em] text-muted-foreground/60">
                <span>Experiment #{experiment.id}</span>
                <span>{experiment.status === "success" ? "✅" : "🧪"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default LaboratoryExperimentsLog;

