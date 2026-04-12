"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/8bit/button";
import InteractiveCalendar from "@/components/interactive-calendar";
import {
  Item,
  ItemContent,
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
import ResumeArchive from "@/components/resume-archive";
import WorkExperienceContainer from "@/components/work-experience-container";
import { ArcadeCenter } from "@/components/arcade-center";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const wishlistItems = [
  {
    id: "frieren-manga",
    title: "Frieren: Remnants of the Departed",
    price: "₱400-500",
    description: "I still haven't completed the volumes yet.",
  },
  {
    id: "gundam-one",
    title: "Gundam Astray Gold Frame Amatsu Mina",
    price: "₱2,299",
    description: "It looks cool as hell.",
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

  // Updated Panel styles - Denser, less padding
  const panelBaseClass = "relative bg-card text-card-foreground border-2 border-border shadow-[4px_4px_0_var(--border)] p-3 overflow-hidden";
  const headerClass = "retro text-xs uppercase tracking-[0.2em] text-primary mb-2 border-b-2 border-dashed border-border/50 pb-1";

  return (
    <main className="min-h-screen w-full bg-transparent p-4 sm:p-6 md:p-8">
      {/* Game World Container - Increased padding for breathability */}
      <div className="mx-auto max-w-[1700px] border-4 border-border bg-background p-3 shadow-[8px_8px_0_var(--border)] sm:p-4">
        
        {/* Header / Intro Box - Reduced margin/padding */}
        <section className="mb-4 border-b-4 border-border bg-card p-4 text-center sm:text-left shadow-sm">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="flex-1">
                <div className="mb-2 inline-block bg-primary px-3 py-1 shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
                    <p className="retro text-[0.7rem] font-bold uppercase tracking-widest text-primary-foreground sm:text-xs">
                    CURRENT LOCATION: LABORATORY
                    </p>
                </div>
                <h1 className="retro text-2xl uppercase leading-tight tracking-widest sm:text-3xl md:text-4xl">
                Fyke&#39;s Workspace
                </h1>
                <p className="retro mt-2 text-xs text-muted-foreground sm:text-sm leading-relaxed">
                Level 60 Full-Stack Developer • Class: Guardian of Chaotic Plans
                </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
              asChild
              className="retro h-10 border-2 border-primary bg-primary/10 text-primary shadow-[4px_4px_0_var(--primary)] hover:translate-y-1 hover:shadow-none"
              >
              <Link href="#contact">INITIALIZE CONTACT</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Dashboard Grid - Increased gaps for mobile breathability */}
        <div id="lab-container" className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
          
          {/* Left Column: Player Status & Menu (4 cols) */}
          <div className="flex flex-col gap-4 lg:col-span-4">
             {/* Player Card - Compact */}
            <div className={panelBaseClass}>
              <h2 className={`${headerClass} text-sm`}>PLAYER_STATUS</h2>
              <div className="flex items-center justify-center py-2">
                <PlayerProfileCard
                  playerName="Fyke"
                  avatarSrc="/assets/minippix.png"
                  avatarFallback="FY"
                  level={60}
                  playerClass="Guardian of Chaotic Plans"
                  stats={{
                    health: { current: 92, max: 100 },
                    mana: { current: 78, max: 100 },
                    experience: { current: 9450, max: 12000 },
                  }}
                  customStats={[
                    {
                      label: "Stamina",
                      value: 95,
                      max: 100,
                      color: "bg-green-700",
                    },
                  ]}
                  showLevel={true}
                  showHealth={true}
                  showMana={true}
                  showExperience={true}
                  className="w-full border-none shadow-none bg-transparent p-0"
                />
              </div>
            </div>

            {/* Mission Planner (Calendar) */}
            <div className={panelBaseClass}>
               <h2 className={headerClass}>ACTIVE_MISSIONS</h2>
               <div className="flex justify-center">
                 <InteractiveCalendar className="w-full text-[0.7rem]" />
               </div>
            </div>

            {/* Arcade Cabinet */}
            <div className={panelBaseClass}>
              <h2 className={headerClass}>ARCADE_CABINET</h2>
              <ArcadeCenter className="w-full" />
            </div>

          </div>

          {/* Right Column: Content & Systems (8 cols) */}
          <div className="flex flex-col gap-4 lg:col-span-8">
            {/* GitHub Contributions - fills right column width */}
            <div className={panelBaseClass}>
              <h2 className={`${headerClass} text-sm`}>CONTRIBUTION_LOG</h2>
              <div className="min-h-[200px] overflow-hidden rounded border border-dashed border-border bg-background/50 p-2">
                 <GitHubContributions />
              </div>
               <Button
                asChild
                variant="outline"
                className="retro mt-4 w-full h-10 text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <a
                  href="https://github.com/ultraelectronica"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ACCESS GITHUB TERMINAL
                </a>
              </Button>
            </div>

            {/* Top Row: Wishlist & Joke */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Wishlist - More compact items */}
                <div id="wishlist" className={panelBaseClass}>
                    <h2 className={headerClass}>MERCHANT_WISHLIST</h2>
                    <ItemGroup className="flex flex-col gap-1.5">
                    {wishlistItems.map((item, index) => (
                        <div key={item.id}>
                        <Item 
                            variant="outline" 
                            className="group flex cursor-pointer flex-col border border-dashed border-border bg-transparent transition-none hover:border-primary hover:bg-primary/5 active:translate-y-0.5"
                        >
                            <ItemContent className="flex-1 p-2 sm:p-1.5">
                            <ItemTitle className="retro text-xs sm:text-[0.55rem] uppercase tracking-wider group-hover:text-primary">
                                {item.title}
                            </ItemTitle>
                            <div className="mt-0.5 flex items-center justify-between">
                                 <span className="retro text-[0.65rem] sm:text-[0.5rem] text-muted-foreground truncate max-w-[70%]">{item.description}</span>
                                 <span className="retro text-[0.7rem] sm:text-[0.55rem] font-bold text-primary">{item.price}</span>
                            </div>
                            </ItemContent>
                        </Item>
                        {index < wishlistItems.length - 1 && (
                            <ItemSeparator className="my-1 border-dashed border-border/30" />
                        )}
                        </div>
                    ))}
                    </ItemGroup>
                </div>

                {/* Joke/Flavor Text */}
                <div className={`${panelBaseClass} flex flex-col justify-between`}>
                     {/* Lotus background for Ally theme */}
                    {isAllyMode && (
                        <div className="pointer-events-none absolute inset-0 opacity-20">
                        <Image
                            src="/assets/tulips.png"
                            alt=""
                            fill
                            className="object-cover"
                        />
                        </div>
                    )}
                    <div>
                        <h2 className={headerClass}>RANDOM_ENCOUNTER_TEXT</h2>
                        <p className="retro relative z-10 text-center text-sm leading-relaxed text-muted-foreground py-4">
                        &quot;{joke}&quot;
                        </p>
                    </div>
                    <div className="retro text-[0.5rem] uppercase text-center text-muted-foreground/50 tracking-[0.3em]">
                        PRESS ANY KEY TO LAUGH
                    </div>
                </div>
            </div>

            {/* Achievement Wall */}
            <div className={panelBaseClass}>
                <h2 className={headerClass}>TROPHY_ROOM</h2>
                <AchievementWall />
            </div>
          </div>

          {/* FULL WIDTH SECTIONS - To avoid empty space on the left */}
            
            {/* Tech Stack Carousel */}
            <div className={cn(panelBaseClass, "lg:col-span-12")}>
                <h2 className={headerClass}>EQUIPPED_TECHNOLOGIES</h2>
                <TechnologiesCarousel />
            </div>

             {/* Inventory System */}
             <div className={cn(panelBaseClass, "lg:col-span-12 min-h-[400px]")}>
                <h2 className={headerClass}>INVENTORY</h2>
                <InventorySystem />
             </div>

             {/* Skill Tree */}
             <div className="border-none lg:col-span-12">
                  <SkillTree />
             </div>

             {/* Work Experience */}
             <div className="border-none lg:col-span-12">
                <WorkExperienceContainer />
             </div>

             {/* Resume Archive */}
             <div className="border-none lg:col-span-12">
                <ResumeArchive />
             </div>
        </div>

        {/* Level Ends / Footer Area Inside Game Screen */}
        <section id="contact" className="mt-8 border-t-4 border-dashed border-border pt-8">
          <div className="mb-4 text-center">
             <div className="inline-block border-2 border-primary bg-background px-4 py-1.5 shadow-[4px_4px_0_var(--primary)]">
                <h2 className="retro text-sm sm:text-lg uppercase tracking-wider sm:tracking-widest text-primary">
                    TRANSMISSION_LINK
                </h2>
             </div>
          </div>
          
           <div className="grid gap-6 md:grid-cols-2">
              <div className={`${panelBaseClass} flex flex-col justify-center`}>
                  <div className="text-center md:text-left">
                     <p className="retro text-[0.6rem] sm:text-xs uppercase tracking-widest text-muted-foreground">OPERATOR</p>
                     <h3 className="retro text-lg sm:text-xl md:text-2xl uppercase tracking-widest text-foreground">
                        Fyke Simon V. Tonel
                     </h3>
                     <p className="retro mt-2 text-xs sm:text-sm uppercase tracking-wider text-primary">
                        Full-Stack Developer
                     </p>
                  </div>
                  <div className="mt-6 space-y-2 border-t-2 border-dashed border-border pt-4">
                      <div className="flex items-center gap-2">
                          <span className="retro text-xs">📍</span>
                          <span className="retro text-xs uppercase tracking-wider text-muted-foreground">Metro Manila, Philippines</span>
                      </div>
                      <p className="retro text-xs leading-relaxed text-muted-foreground">
                        Ready for new quests. Send a transmission for collaborations.
                      </p>
                  </div>
              </div>

               <div className={panelBaseClass}>
                  <ContactForm />
               </div>
           </div>
        </section>
        
        <PowerPelletHighway />
        
      </div>
    </main>
  );
}
