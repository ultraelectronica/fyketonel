import giveMeAJoke from "give-me-a-joke";

import Link from "next/link";
import { Button } from "@/components/ui/8bit/button";
import { Calendar } from "@/components/ui/8bit/calendar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/8bit/item";
import GitHubContributions from "@/components/github-contributions";
import TechnologiesCarousel from "@/components/technologies-carousel";
import PlayerProfileCard from "@/components/ui/8bit/blocks/player-profile-card";
import ContactForm from "@/components/contact-form";

const shellClass =
  "rounded-none border-4 border-border bg-card/80 p-8 shadow-[8px_8px_0_var(--border)] backdrop-blur-sm dark:border-ring";
const panelClass =
  "rounded-none border-4 border-border bg-card/80 p-6 text-center shadow-[6px_6px_0_var(--border)] backdrop-blur-sm dark:border-ring";

const wishlistItems = [
  {
    id: "frieren-manga",
    title: "Frieren: Remnants of the Departed",
    price: "₱400-500",
    description: "I still haven&apos;t completed the volumes yet.",
  },
  {
    id: "chrollo-figure",
    title: "Banpresto Hunting Archives Chrollo Lucilfer",
    price: "₱1000",
    description: "He looks cool.",
  },
  {
    id: "genshin-figures",
    title: "Arlecchino, Alhaitham, or Neuvilette",
    price: "???",
    description: "They are my faves in Genshin Impact.",
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
            My laboratory, my playground, my sandbox.
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
              <div className="mt-6 flex flex-1 items-center justify-center w-full">
                <Calendar
                  mode="single"
                  selected={today}
                  initialFocus
                  className="text-center scale-95 w-full max-w-none"
                />
              </div>
            </div>

            <div className={`${panelClass} flex flex-col min-h-[500px]`}>
              <p className="retro text-xs uppercase tracking-[0.3em] text-muted-foreground text-center">
                Player Card
              </p>
              <div className="mt-6 flex flex-1 items-center justify-center">
                <PlayerProfileCard
                  playerName="Fyke"
                  avatarSrc="/assets/minippix.png"
                  avatarFallback="FY"
                  level={54}
                  playerClass="Guardian of Chaotic Plans"
                  stats={{
                    health: { current: 86, max: 100 },
                    mana: { current: 64, max: 100 },
                    experience: { current: 7850, max: 10000 },
                  }}
                  customStats={[
                    {
                      label: "Stamina",
                      value: 92,
                      max: 100,
                      color: "bg-green-500",
                    },
                  ]}
                  showLevel={true}
                  showHealth={true}
                  showMana={true}
                  showExperience={true}
                  className="w-full max-w-full border-4 border-border shadow-none bg-transparent"
                />
              </div>
            </div>

            <div id="wishlist" className={`${panelClass} flex flex-col`}>
              <p className="retro text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Wishlist
              </p>
              <div className="mt-6 flex flex-1 items-center">
                <ItemGroup className="gap-3 w-full">
                  {wishlistItems.map((item, index) => (
                    <div key={item.id}>
                      <Item 
                        variant="outline" 
                        className="flex flex-col transition-all duration-200 hover:bg-accent/30 hover:border-primary hover:shadow-[4px_4px_0_var(--primary)] hover:-translate-y-1 cursor-pointer"
                      >
                        <ItemContent className="flex-1">
                          <ItemTitle className="retro text-sm uppercase tracking-[0.2em]">
                            {item.title}
                          </ItemTitle>
                          <ItemDescription className="retro text-xs text-muted-foreground mt-1">
                            {item.description}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions className="mt-3 flex items-center justify-between w-full">
                          <span className="retro text-xs font-bold text-primary">
                            {item.price}
                          </span>
                          <span className="retro text-xs text-muted-foreground">
                            Haven&apos;t bought yet :(
                          </span>
                        </ItemActions>
                      </Item>
                      {index < wishlistItems.length - 1 && (
                        <ItemSeparator className="my-3 border-dashed border-border" />
                      )}
                    </div>
                  ))}
                </ItemGroup>
              </div>
            </div>

            <div className={`${panelClass} flex flex-col`}>
              <p className="retro text-xs uppercase tracking-[0.3em] text-muted-foreground">
                A random joke for your mood.
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

      <TechnologiesCarousel />

      <section className="space-y-6">
        <div className="space-y-3 text-center">
          <p className="retro text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Get in Touch
          </p>
          <h2 className="retro text-2xl uppercase tracking-[0.3em]">
            Contact Me
          </h2>
        </div>
        <div className={`${shellClass} border-dashed border-foreground/50 dark:border-ring/50`}>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Side - Contact Info */}
            <div className={`${panelClass} flex flex-col justify-center space-y-6`}>
              <div className="space-y-4">
                <div>
                  <h3 className="retro text-2xl uppercase tracking-[0.3em] text-foreground">
                    Fyke Simon V. Tonel
                  </h3>
                  <p className="retro mt-3 text-base uppercase tracking-[0.25em] text-primary">
                    Full-stack Developer
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="retro text-sm uppercase tracking-[0.2em] text-muted-foreground">
                      📍
                    </span>
                    <p className="retro text-sm uppercase tracking-[0.2em] text-muted-foreground">
                      Metro Manila, Philippines
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t-4 border-dashed border-border pt-6 dark:border-ring">
                <p className="retro text-sm leading-relaxed text-muted-foreground">
                  Let&apos;s work together! Feel free to reach out for collaborations, projects, or just to say hi.
                </p>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className={`${panelClass} flex flex-col`}>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
