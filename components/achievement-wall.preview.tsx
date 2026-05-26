"use client";

import { AchievementWall } from "./achievement-wall";

/*
 * AchievementWall — Preview & State Demo
 * Not part of production code. Delete after review.
 */

export default function AchievementWallPreview() {
  return (
    <main className="min-h-screen w-full bg-background p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="retro text-center text-lg uppercase tracking-[0.2em] text-foreground sm:text-xl">
          AchievementWall — State Preview
        </h1>

        {/* State 1: Default (full data) */}
        <section>
          <p className="retro mb-2 text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
            1. default — full dataset
          </p>
          <div className="rounded-none border-2 border-border p-3 shadow-[4px_4px_0_var(--border)] dark:border-ring sm:p-4">
            <AchievementWall />
          </div>
        </section>

        {/* State 2: Hover simulation via is-hover class */}
        <section>
          <p className="retro mb-2 text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
            2. hover — forced hover styling on first card
          </p>
          <div className="rounded-none border-2 border-border p-3 shadow-[4px_4px_0_var(--border)] dark:border-ring sm:p-4">
            <AchievementWall className="[&>div:nth-child(2)>div>div:first-child>div:first-child]:-translate-y-1 [&>div:nth-child(2)>div>div:first-child>div:first-child]:border-primary [&>div:nth-child(2)>div>div:first-child>div:first-child]:shadow-[4px_4px_0_var(--primary)]" />
          </div>
        </section>

        {/* State 3: Active simulation */}
        <section>
          <p className="retro mb-2 text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
            3. active — forced active styling
          </p>
          <div className="rounded-none border-2 border-border p-3 shadow-[4px_4px_0_var(--border)] dark:border-ring sm:p-4">
            <AchievementWall className="[&>div:nth-child(2)>div>div:first-child>div:first-child]:translate-y-0 [&>div:nth-child(2)>div>div:first-child>div:first-child]:shadow-[2px_2px_0_var(--primary)]" />
          </div>
        </section>

        {/* State 4: Focus-visible simulation */}
        <section>
          <p className="retro mb-2 text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
            4. focus-visible — ring treatment
          </p>
          <div className="rounded-none border-2 border-border p-3 shadow-[4px_4px_0_var(--border)] dark:border-ring sm:p-4">
            <AchievementWall className="[&>div:nth-child(2)>div>div:first-child>div:first-child]:outline [&>div:nth-child(2)>div>div:first-child>div:first-child]:outline-2 [&>div:nth-child(2)>div>div:first-child>div:first-child]:outline-primary [&>div:nth-child(2)>div>div:first-child>div:first-child]:outline-offset-2" />
          </div>
        </section>

        {/* State 5: Loading / Skeleton */}
        <section>
          <p className="retro mb-2 text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
            5. loading — skeleton placeholder
          </p>
          <div className="rounded-none border-2 border-border p-3 shadow-[4px_4px_0_var(--border)] dark:border-ring sm:p-4">
            <div className="space-y-4">
              <div className="mx-auto mb-5 h-6 w-32 animate-pulse bg-muted" />
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-none border-2 border-border/40 bg-card/40 p-3 sm:gap-4 sm:p-4"
                  >
                    <div className="size-12 shrink-0 animate-pulse bg-muted sm:size-14" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 animate-pulse bg-muted" />
                      <div className="h-2 w-full animate-pulse bg-muted/60" />
                      <div className="h-2 w-1/2 animate-pulse bg-muted/60" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* State 6: Empty — no achievements */}
        <section>
          <p className="retro mb-2 text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
            6. empty — no achievements unlocked
          </p>
          <div className="rounded-none border-2 border-border p-3 shadow-[4px_4px_0_var(--border)] dark:border-ring sm:p-4">
            <EmptyAchievementWall />
          </div>
        </section>

        {/* State 7: Error */}
        <section>
          <p className="retro mb-2 text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
            7. error — load failure
          </p>
          <div className="rounded-none border-2 border-destructive p-3 shadow-[4px_4px_0_var(--destructive)] sm:p-4">
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="retro text-2xl">⚠</span>
              <p className="retro text-xs uppercase tracking-[0.15em] text-destructive">
                Trophy data corrupted
              </p>
              <p className="retro text-[0.55rem] tracking-[0.1em] text-muted-foreground">
                Retry loading achievements
              </p>
              <button className="retro mt-1 border-2 border-destructive bg-destructive/10 px-4 py-1.5 text-[0.55rem] uppercase tracking-[0.15em] text-destructive transition-all hover:bg-destructive/20 active:translate-y-0.5">
                RETRY
              </button>
            </div>
          </div>
        </section>

        {/* State 8: Success / Toast simulation */}
        <section>
          <p className="retro mb-2 text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
            8. success — achievement unlocked toast
          </p>
          <div className="rounded-none border-2 border-border p-3 shadow-[4px_4px_0_var(--border)] dark:border-ring sm:p-4">
            <div className="flex items-center gap-3 rounded-none border-2 border-green-500 bg-green-500/10 px-4 py-3 shadow-[3px_3px_0_rgba(34,197,94,0.3)]">
              <span className="text-xl">🏆</span>
              <div>
                <p className="retro text-[0.6rem] font-bold uppercase tracking-[0.15em] text-green-600 dark:text-green-400">
                  Achievement Unlocked
                </p>
                <p className="retro text-[0.5rem] tracking-[0.1em] text-muted-foreground">
                  Stack Overflow Survivor — 100G
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* Minimal empty-state wrapper */
function EmptyAchievementWall() {
  return (
    <div className="space-y-4 text-center">
      <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground">
        Developer Achievements
      </p>
      <h2 className="retro text-lg uppercase tracking-[0.2em]">Trophy Case</h2>
      <div className="mx-auto inline-flex items-center gap-2 rounded-none border-2 border-border bg-card/80 px-4 py-2 shadow-[2px_2px_0_var(--border)] dark:border-ring">
        <span className="text-xl">🏆</span>
        <p className="retro text-sm font-bold tracking-[0.15em] text-primary">
          0 / 345G
        </p>
      </div>
      <p className="retro py-8 text-[0.55rem] tracking-[0.1em] text-muted-foreground">
        No achievements yet. Get coding!
      </p>
    </div>
  );
}
