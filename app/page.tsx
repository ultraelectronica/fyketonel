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
  "rounded-none border-4 border-border bg-card/80 p-4 sm:p-6 md:p-8 shadow-[4px_4px_0_var(--border)] sm:shadow-[6px_6px_0_var(--border)] md:shadow-[8px_8px_0_var(--border)] backdrop-blur-sm dark:border-ring";
const panelClass =
  "rounded-none border-4 border-border bg-card/80 p-4 sm:p-5 md:p-6 text-center shadow-[4px_4px_0_var(--border)] sm:shadow-[5px_5px_0_var(--border)] md:shadow-[6px_6px_0_var(--border)] backdrop-blur-sm dark:border-ring";

const wishlistItems = [
  {
    id: "frieren-manga",
    title: "Frieren: Remnants of the Departed",
    price: "₱400-500",
    description: "I still haven't completed the volumes yet.",
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
    <main className="mx-auto flex min-h-screen w-full max-w-[95vw] flex-col gap-8 px-4 py-8 text-foreground sm:gap-10 sm:px-6 sm:py-12 md:gap-12 md:py-16">
      <section className="flex flex-col items-center gap-4 text-center sm:gap-5 md:gap-6">
        <div className="space-y-2 sm:space-y-3">
          <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
            Laboratory Intel
          </p>
          <h1 className="retro text-xl uppercase leading-tight tracking-[0.2em] sm:text-2xl sm:tracking-[0.25em] md:text-3xl md:tracking-[0.3em]">
            Welcome to Fyke&#39;s Laboratory
          </h1>
          <p className="retro text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
            My laboratory, my playground, my sandbox.
          </p>
        </div>
        <Button
          asChild
          className="retro h-10 px-6 text-xs uppercase tracking-[0.2em] sm:h-11 sm:px-8 sm:text-sm sm:tracking-[0.25em] md:h-12 md:px-10 md:text-base md:tracking-[0.3em]"
        >
          <Link href="#lab-container">Learn More</Link>
        </Button>
      </section>

      <section
        id="lab-container"
        className={`${shellClass} border-dashed border-foreground/50 dark:border-ring/50`}
      >
        <p className="retro mb-4 text-center text-[0.5rem] uppercase tracking-[0.25em] text-muted-foreground sm:mb-5 sm:text-[0.6rem] sm:tracking-[0.3em] md:mb-6 md:text-xs md:tracking-[0.35em]">
          Lab Control Center
        </p>
        <div className="flex flex-col gap-6 sm:gap-7 md:gap-8">
          <div className="grid gap-6 sm:gap-7 md:gap-8 lg:grid-cols-2 lg:grid-rows-2 lg:auto-rows-fr">
            <div className={`${panelClass} flex flex-col`}>
              <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.25em] md:text-xs md:tracking-[0.3em]">
                Mission Planner
              </p>
              <div className="mt-4 flex flex-1 items-center justify-center w-full sm:mt-5 md:mt-6">
                <Calendar
                  mode="single"
                  selected={today}
                  initialFocus
                  className="text-center scale-75 w-full max-w-none sm:scale-90 md:scale-95"
                />
              </div>
            </div>

            <div className={`${panelClass} flex flex-col min-h-[350px] sm:min-h-[400px] md:min-h-[500px]`}>
              <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground text-center sm:text-[0.6rem] sm:tracking-[0.25em] md:text-xs md:tracking-[0.3em]">
                Player Card
              </p>
              <div className="mt-4 flex flex-1 items-center justify-center sm:mt-5 md:mt-6">
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
              <p className="retro text-center text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.25em] md:text-xs md:tracking-[0.3em]">
                Wishlist
              </p>
              <div className="mt-4 flex flex-1 items-center sm:mt-5 md:mt-6">
                <ItemGroup className="gap-2 w-full sm:gap-2.5 md:gap-3">
                  {wishlistItems.map((item, index) => (
                    <div key={item.id}>
                      <Item 
                        variant="outline" 
                        className="flex flex-col transition-all duration-200 hover:bg-accent/30 hover:border-primary hover:shadow-[3px_3px_0_var(--primary)] sm:hover:shadow-[4px_4px_0_var(--primary)] hover:-translate-y-1 cursor-pointer"
                      >
                        <ItemContent className="flex-1">
                          <ItemTitle className="retro text-[0.5rem] uppercase tracking-[0.15em] sm:text-xs sm:tracking-[0.18em] md:text-sm md:tracking-[0.2em]">
                            {item.title}
                          </ItemTitle>
                          <ItemDescription className="retro text-[0.45rem] text-muted-foreground mt-1 sm:text-[0.55rem] md:text-xs">
                            {item.description}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions className="mt-2 flex items-center justify-between w-full sm:mt-2.5 md:mt-3">
                          <span className="retro text-[0.45rem] font-bold text-primary sm:text-[0.55rem] md:text-xs">
                            {item.price}
                          </span>
                          <span className="retro text-[0.4rem] text-muted-foreground sm:text-[0.5rem] md:text-xs">
                            Haven&#39;t bought yet :(
                          </span>
                        </ItemActions>
                      </Item>
                      {index < wishlistItems.length - 1 && (
                        <ItemSeparator className="my-2 border-dashed border-border sm:my-2.5 md:my-3" />
                      )}
                    </div>
                  ))}
                </ItemGroup>
              </div>
            </div>

            <div className={`${panelClass} flex flex-col`}>
              <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.25em] md:text-xs md:tracking-[0.3em]">
                A random joke for your mood.
              </p>
              <div className="mt-4 flex flex-1 items-center justify-center sm:mt-5 md:mt-6">
                <p className="retro text-xs leading-relaxed text-center text-muted-foreground sm:text-sm md:text-base lg:text-lg">
                  {joke}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${panelClass} flex flex-col gap-3 text-center sm:gap-3.5 md:gap-4`}
          >
            <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.25em] md:text-xs md:tracking-[0.3em]">
              heimin22 GitHub Contributions
            </p>
            <div className="rounded-none border-4 border-dashed border-border bg-background/80 p-3 shadow-[3px_3px_0_var(--border)] overflow-hidden min-h-[250px] flex items-center justify-center sm:min-h-[300px] sm:p-3.5 sm:shadow-[3.5px_3.5px_0_var(--border)] md:min-h-[400px] md:p-4 md:shadow-[4px_4px_0_var(--border)]">
              <GitHubContributions />
            </div>
            <Button
              asChild
              variant="outline"
              className="retro h-8 text-[0.5rem] uppercase tracking-[0.2em] sm:h-9 sm:text-[0.6rem] sm:tracking-[0.25em] md:h-10 md:text-xs md:tracking-[0.3em]"
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

      <section className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="space-y-2 text-center sm:space-y-2.5 md:space-y-3">
          <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
            Get in Touch
          </p>
          <h2 className="retro text-lg uppercase tracking-[0.2em] sm:text-xl sm:tracking-[0.25em] md:text-2xl md:tracking-[0.3em]">
            Contact Me
          </h2>
        </div>
        <div className={`${shellClass} border-dashed border-foreground/50 dark:border-ring/50`}>
          <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2">
            {/* Left Side - Contact Info */}
            <div className={`${panelClass} flex flex-col justify-center space-y-4 sm:space-y-5 md:space-y-6`}>
              <div className="space-y-3 sm:space-y-3.5 md:space-y-4">
                <div>
                  <h3 className="retro text-sm uppercase tracking-[0.2em] text-foreground sm:text-lg sm:tracking-[0.25em] md:text-xl lg:text-2xl md:tracking-[0.3em]">
                    Fyke Simon V. Tonel
                  </h3>
                  <p className="retro mt-2 text-xs uppercase tracking-[0.18em] text-primary sm:mt-2.5 sm:text-sm sm:tracking-[0.22em] md:mt-3 md:text-base md:tracking-[0.25em]">
                    Full-stack Developer
                  </p>
                </div>
                
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="retro text-xs uppercase tracking-[0.15em] text-muted-foreground sm:text-sm sm:tracking-[0.2em]">
                      📍
                    </span>
                    <p className="retro text-[0.5rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-xs sm:tracking-[0.18em] md:text-sm md:tracking-[0.2em]">
                      Metro Manila, Philippines
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t-2 border-dashed border-border pt-3 dark:border-ring sm:border-t-3 sm:pt-4 md:border-t-4 md:pt-6">
                <p className="retro text-[0.5rem] leading-relaxed text-muted-foreground sm:text-xs md:text-sm">
                  Let&#39;s work together! Feel free to reach out for collaborations, projects, or just to say hi.
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
