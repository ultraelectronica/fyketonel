"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/8bit/button";
import InteractiveCalendar from "@/components/interactive-calendar";
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
import PowerPelletHighway from "@/components/power-pellet-highway";
import AchievementWall from "@/components/achievement-wall";
import InventorySystem from "@/components/inventory-system";
import SkillTree from "@/components/skill-tree";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";

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
    const response = await fetch("/api/joke", {
      cache: "no-store",
    });
    const data = await response.json();
    return data.joke;
  } catch (error) {
    console.error("Error fetching joke:", error);
    return "The joke machine is recalibrating—check back after the next coffee break.";
  }
}

export default function Home() {
  const [joke, setJoke] = useState("Loading joke...");
  const [isAllyMode, setIsAllyMode] = useState(false);
  const today = new Date();

  // Detect screen sizes
  const isVerySmall = useMediaQuery({ maxWidth: 374 });
  const isSmall = useMediaQuery({ minWidth: 375, maxWidth: 639 });

  // Simple client-side check
  const isClient = typeof window !== 'undefined' && (isVerySmall !== undefined || isSmall !== undefined);

  // Fetch joke on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchJoke = async () => {
      const fetchedJoke = await getJokeOfTheDay();
      if (isMounted) {
        setJoke(fetchedJoke);
      }
    };

    fetchJoke();

    return () => {
      isMounted = false;
    };
  }, []);

  // Detect Ally theme
  useEffect(() => {
    const checkTheme = () => {
      if (typeof window !== "undefined") {
        const theme = localStorage.getItem("terminal-theme");
        setIsAllyMode(theme === "ally");
      }
    };
    checkTheme();
    window.addEventListener("themeChanged", checkTheme);
    const interval = setInterval(checkTheme, 100);
    return () => {
      window.removeEventListener("themeChanged", checkTheme);
      clearInterval(interval);
    };
  }, []);

  // Dynamic classes based on screen size
  const shellClass = isClient && isVerySmall
    ? "rounded-none border border-border bg-card/80 p-2 shadow-[1px_1px_0_var(--border)] backdrop-blur-sm dark:border-ring"
    : isClient && isSmall
    ? "rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring"
    : "rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring min-[375px]:border-3 min-[375px]:p-4 min-[375px]:shadow-[3px_3px_0_var(--border)] sm:border-4 sm:p-6 sm:shadow-[6px_6px_0_var(--border)] md:p-8 md:shadow-[8px_8px_0_var(--border)]";

  const panelClass = isClient && isVerySmall
    ? "rounded-none border border-border bg-card/80 p-2 text-center shadow-[1px_1px_0_var(--border)] backdrop-blur-sm dark:border-ring"
    : isClient && isSmall
    ? "rounded-none border-2 border-border bg-card/80 p-3 text-center shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring"
    : "rounded-none border-2 border-border bg-card/80 p-3 text-center shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring min-[375px]:border-3 min-[375px]:p-4 min-[375px]:shadow-[3px_3px_0_var(--border)] sm:border-4 sm:p-5 sm:shadow-[4px_4px_0_var(--border)] md:p-6 md:shadow-[6px_6px_0_var(--border)]";

  const gridGap = isClient && isVerySmall
    ? "gap-12"
    : isClient && isSmall
    ? "gap-12"
    : "gap-8 min-[375px]:gap-10 sm:gap-10 md:gap-10";

  const githubContainerClass = isClient && isVerySmall
    ? "rounded-none border border-dashed border-border bg-background/80 p-2 shadow-[1px_1px_0_var(--border)] overflow-hidden min-h-[180px] flex items-center justify-center"
    : isClient && isSmall
    ? "rounded-none border-2 border-dashed border-border bg-background/80 p-2.5 shadow-[2px_2px_0_var(--border)] overflow-hidden min-h-[220px] flex items-center justify-center"
    : "rounded-none border-2 border-dashed border-border bg-background/80 p-2 shadow-[2px_2px_0_var(--border)] overflow-hidden min-h-[200px] flex items-center justify-center min-[375px]:border-3 min-[375px]:p-2.5 min-[375px]:shadow-[2.5px_2.5px_0_var(--border)] min-[375px]:min-h-[250px] sm:border-4 sm:min-h-[300px] sm:p-3.5 sm:shadow-[3.5px_3.5px_0_var(--border)] md:min-h-[400px] md:p-4 md:shadow-[4px_4px_0_var(--border)]";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[95vw] flex-col gap-6 px-3 py-6 text-foreground min-[375px]:gap-7 min-[375px]:px-4 min-[375px]:py-8 sm:gap-10 sm:px-6 sm:py-12 md:gap-12 md:py-16">
      <section className="flex flex-col items-center gap-3 text-center min-[375px]:gap-4 sm:gap-5 md:gap-6">
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
        <p className="retro mb-4 text-center text-[0.5rem] uppercase tracking-[0.25em] text-muted-foreground sm:mb-5 sm:text-[0.6rem] sm:tracking-[0.3em] md:mb-6 md:text-xs md:tracking-[0.35em]">
          Lab Control Center
        </p>
        <div className="flex flex-col gap-4 min-[375px]:gap-5 sm:gap-6">
          <div className="grid grid-cols-1 gap-4 min-[375px]:gap-5 sm:gap-6 lg:grid-cols-2 lg:auto-rows-[minmax(0,1fr)]">
            <div className={`${panelClass} flex flex-col h-full`}>
              <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.25em] md:text-xs md:tracking-[0.3em]">
                Mission Planner
              </p>
              <div className="mt-4 flex flex-1 w-full items-center justify-center sm:mt-5 md:mt-6">
                <InteractiveCalendar className="w-full max-w-md text-[clamp(0.4rem,2vw,0.65rem)] sm:max-w-lg sm:text-[0.75rem]" />
              </div>
            </div>

            <div className={`${panelClass} flex flex-col h-full`}>
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
                      color: "bg-green-700",
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

            <div id="wishlist" className={`${panelClass} flex flex-col h-full`}>
              <p className="retro text-center text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.25em] md:text-xs md:tracking-[0.3em]">
                Wishlist
              </p>
              <div className="mt-4 flex flex-1 w-full sm:mt-5 md:mt-6">
                <ItemGroup className="flex w-full flex-col gap-2 sm:gap-2.5 md:gap-3">
                  {wishlistItems.map((item, index) => (
                    <div key={item.id}>
                      <Item 
                        variant="outline" 
                        className="flex flex-col transition-all duration-200 hover:bg-accent/30 hover:border-primary hover:shadow-[3px_3px_0_var(--primary)] sm:hover:shadow-[4px_4px_0_var(--primary)] hover:-translate-y-1 cursor-pointer"
                      >
                        <ItemContent className="flex-1">
                          <ItemTitle className="retro text-center text-[0.5rem] uppercase tracking-[0.15em] sm:text-xs sm:tracking-[0.18em] md:text-sm md:tracking-[0.2em]">
                            {item.title}
                          </ItemTitle>
                          <ItemDescription className="retro text-center text-[0.45rem] text-muted-foreground mt-1 sm:text-[0.55rem] md:text-xs">
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

            <div className={`${panelClass} flex flex-col h-full relative`}>
              {/* Lotus background for Ally theme */}
              {isAllyMode && (
                <div className="pointer-events-none absolute inset-0 opacity-40">
                  <Image
                    src="/assets/tulips.png"
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="retro relative z-10 text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.25em] md:text-xs md:tracking-[0.3em]">
                A random joke for your mood.
              </p>
              <div className="mt-4 flex flex-1 items-center justify-center sm:mt-5 md:mt-6 relative z-10">
                <p className="retro text-xs leading-relaxed text-center text-muted-foreground sm:text-sm md:text-base lg:text-lg">
                  {joke}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${panelClass} flex flex-col gap-2 text-center min-[375px]:gap-2.5 sm:gap-3.5 md:gap-4`}
          >
            <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.25em] md:text-xs md:tracking-[0.3em]">
              heimin22 GitHub Contributions
            </p>
            <div className={githubContainerClass}>
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

      <AchievementWall />

      <InventorySystem />

      <SkillTree />

      <TechnologiesCarousel />

      <section className="space-y-3 min-[375px]:space-y-4 sm:space-y-5 md:space-y-6">
        <div className="space-y-1.5 text-center min-[375px]:space-y-2 sm:space-y-2.5 md:space-y-3">
          <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
            Get in Touch
          </p>
          <h2 className="retro text-lg uppercase tracking-[0.2em] sm:text-xl sm:tracking-[0.25em] md:text-2xl md:tracking-[0.3em]">
            Contact Me
          </h2>
        </div>
        <div className={`${shellClass} border-dashed border-foreground/50 dark:border-ring/50`}>
          <div className={`grid ${gridGap} lg:grid-cols-2`}>
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

      <PowerPelletHighway />
    </main>
  );
}
