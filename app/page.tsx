import giveMeAJoke from "give-me-a-joke";

import Link from "next/link";
import { Button } from "@/components/ui/8bit/button";
import { Calendar } from "@/components/ui/8bit/calendar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/8bit/item";
import { Avatar, AvatarFallback } from "@/components/ui/8bit/avatar";
import HealthBar from "@/components/ui/8bit/health-bar";
import ManaBar from "@/components/ui/8bit/mana-bar";
import GitHubContributions from "@/components/github-contributions";

const shellClass =
  "rounded-none border-4 border-border bg-card/80 p-8 shadow-[8px_8px_0_var(--border)] backdrop-blur-sm dark:border-ring";
const panelClass =
  "rounded-none border-4 border-border bg-card/80 p-6 text-center shadow-[6px_6px_0_var(--border)] backdrop-blur-sm dark:border-ring";

const wishlistItems = [
  {
    id: "crt-monitor",
    title: "JVC CRT Monitor",
    description: "Need razor-sharp scanlines for proper sprite testing.",
  },
  {
    id: "synth-module",
    title: "Modular Synth Kit",
    description: "Fuel for the lab&apos;s ambient radar pings.",
  },
  {
    id: "nano-drone",
    title: "Pixelated Nano Drone",
    description: "For scouting secret boss rooms around the city.",
  },
  {
    id: "mech-keyboard",
    title: "Magenta Switch Keyboard",
    description: "Because plotting chaos deserves the perfect click.",
  },
] as const;

async function getJokeOfTheDay() {
  try {
    return await new Promise<string>((resolve, reject) => {
      giveMeAJoke.getRandomDadJoke((joke: string) => {
        if (joke) {
          resolve(joke);
        } else {
          reject(new Error("No joke received"));
        }
      });
    });
  } catch {
    return "The joke machine is recalibrating—check back after the next coffee break.";
  }
}

export default async function Home() {
  const joke = await getJokeOfTheDay();
  const today = new Date();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[95vw] flex-col gap-12 px-6 py-16 text-foreground">
      <section className="flex flex-col items-center gap-6 text-center">
        <div className="space-y-3">
          <p className="retro text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Laboratory Intel
          </p>
          <h1 className="retro text-3xl uppercase tracking-[0.3em]">
            Welcome to Fyke&apos;s Laboratory
          </h1>
          <p className="retro text-base leading-relaxed text-muted-foreground">
            Where my plans, whatever the hell I want to do are listed here.
          </p>
        </div>
        <Button
          asChild
          className="retro h-12 px-10 text-base uppercase tracking-[0.3em]"
        >
          <Link href="#lab-container">Learn More</Link>
        </Button>
      </section>

      <section
        id="lab-container"
        className={`${shellClass} border-dashed border-foreground/50 dark:border-ring/50`}
      >
        <p className="retro mb-6 text-center text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Lab Control Center
        </p>
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:grid-rows-2 lg:auto-rows-fr">
            <div className={`${panelClass} flex flex-col`}>
              <p className="retro text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Mission Planner
              </p>
              <div className="mt-6 flex flex-1 items-center justify-center">
                <Calendar
                  mode="single"
                  selected={today}
                  initialFocus
                  className="text-center"
                />
              </div>
            </div>

            <div className={`${panelClass} text-center flex flex-col`}>
              <p className="retro text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Player Card
              </p>
              <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-4">
                <Avatar className="size-24" variant="pixel">
                  <AvatarFallback>FY</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <p className="retro text-xl uppercase tracking-[0.3em]">
                    Fyke
                  </p>
                  <p className="retro text-xs uppercase tracking-[0.4em] text-muted-foreground">
                    Guardian of Chaotic Plans
                  </p>
                </div>
                <div className="flex w-full flex-col gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <p className="retro mb-2 text-xs uppercase tracking-[0.3em]">
                      Health
                    </p>
                    <HealthBar
                      value={86}
                      variant="retro"
                      className="h-6 w-full"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="retro mb-2 text-xs uppercase tracking-[0.3em]">
                      Mana
                    </p>
                    <ManaBar
                      value={64}
                      variant="retro"
                      className="h-6 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div id="wishlist" className={`${panelClass} flex flex-col`}>
              <p className="retro text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Wishlist
              </p>
              <div className="mt-6 flex flex-1 items-center">
                <ItemGroup className="gap-3 w-full">
                  {wishlistItems.slice(0, 3).map((item, index) => (
                    <div key={item.id}>
                      <Item variant="outline" className="flex flex-col items-center">
                        <ItemContent className="items-center text-center">
                          <ItemTitle className="retro text-base uppercase tracking-[0.2em]">
                            {item.title}
                          </ItemTitle>
                          <ItemDescription className="retro text-sm text-muted-foreground">
                            {item.description}
                          </ItemDescription>
                        </ItemContent>
                        <ItemContent className="mt-2 flex justify-center">
                          <span className="retro text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            #{String(index + 1).padStart(2, "0")}
                          </span>
                        </ItemContent>
                      </Item>
                      {index < 2 && (
                        <ItemSeparator className="my-3 border-dashed border-border" />
                      )}
                    </div>
                  ))}
                </ItemGroup>
              </div>
            </div>

            <div className={`${panelClass} flex flex-col`}>
              <p className="retro text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Random Joke of the Day
              </p>
              <div className="mt-6 flex flex-1 items-center justify-center">
                <p className="retro text-base leading-relaxed text-center text-muted-foreground">
                  {joke}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${panelClass} flex flex-col gap-4 text-center`}
          >
            <p className="retro text-xs uppercase tracking-[0.3em] text-muted-foreground">
              heimin22 GitHub Contributions
            </p>
            <div className="rounded-none border-4 border-dashed border-border bg-background/80 p-4 shadow-[4px_4px_0_var(--border)] overflow-hidden min-h-[400px] flex items-center justify-center">
              <GitHubContributions />
            </div>
            <Button
              asChild
              variant="outline"
              className="retro h-10 uppercase tracking-[0.3em]"
            >
              <a
                href="https://github.com/heimin22"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Profile
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
