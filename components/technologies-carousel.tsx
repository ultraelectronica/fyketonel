"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/8bit/carousel";
import { Button } from "@/components/ui/8bit/button";
import Autoplay from "embla-carousel-autoplay";
import {
  SiDart,
  SiTypescript,
  SiJavascript,
  SiFlutter,
  SiPostgresql,
  SiSqlite,
  SiFirebase,
  SiSupabase,
  SiGooglecloud,
  SiGithub,
  SiGitlab,
  SiMysql,
  SiPostman,
  SiCloudflare,
  SiExpress,
  SiNodedotjs,
  SiNextdotjs,
  SiThreedotjs,
  SiTailwindcss,
  SiReact,
  SiNpm,
  SiPnpm,
  SiBun,
  SiRemix,
  SiDocker,
  SiNeovim,
  SiAndroidstudio,
  SiArchlinux,
  SiLinux,
  SiGnubash,
  SiGit,
  SiNamecheap,
  SiOpenstreetmap,
  SiMaplibre,
} from "react-icons/si";
import { TbDatabase, TbBrandVscode, TbBrandWindows, TbBrandPowershell, TbBrandVisualStudio, TbWorld } from "react-icons/tb";
import type { IconType } from "react-icons";

const panelClass =
  "rounded-none border-4 border-border bg-card/80 p-3 text-center shadow-[3px_3px_0_var(--border)] backdrop-blur-sm dark:border-ring sm:p-4 sm:shadow-[4px_4px_0_var(--border)] md:p-5 lg:p-6 md:shadow-[5px_5px_0_var(--border)] lg:shadow-[6px_6px_0_var(--border)]";

const technologies: Array<{ name: string; icon: IconType }> = [
  { name: "Dart", icon: SiDart },
  { name: "TypeScript", icon: SiTypescript },
  { name: "JavaScript", icon: SiJavascript },
  { name: "Flutter", icon: SiFlutter },
  { name: "PL/pgSQL", icon: SiPostgresql },
  { name: "SQL", icon: TbDatabase },
  { name: "SQLite", icon: SiSqlite },
  { name: "Firebase", icon: SiFirebase },
  { name: "Supabase", icon: SiSupabase },
  { name: "GCP", icon: SiGooglecloud },
  { name: "GitHub", icon: SiGithub },
  { name: "GitLab", icon: SiGitlab },
  { name: "MySQL", icon: SiMysql },
  { name: "Postman", icon: SiPostman },
  { name: "Cloudflare", icon: SiCloudflare },
  { name: "Express.js", icon: SiExpress },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Three.js", icon: SiThreedotjs },
  { name: "QuestDB", icon: TbDatabase },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "React", icon: SiReact },
  { name: "npm", icon: SiNpm },
  { name: "pnpm", icon: SiPnpm },
  { name: "Bun", icon: SiBun },
  { name: "Remix", icon: SiRemix },
  { name: "Docker", icon: SiDocker },
  { name: "Zed", icon: TbBrandVscode },
  { name: "Neovim", icon: SiNeovim },
  { name: "Android Studio", icon: SiAndroidstudio },
  { name: "Visual Studio Code", icon: TbBrandVscode },
  { name: "Visual Studio", icon: TbBrandVisualStudio },
  { name: "ArchLinux", icon: SiArchlinux },
  { name: "Linux", icon: SiLinux },
  { name: "Windows", icon: TbBrandWindows },
  { name: "Bash", icon: SiGnubash },
  { name: "Powershell", icon: TbBrandPowershell },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Git", icon: SiGit },
  { name: "Namecheap", icon: SiNamecheap },
  { name: "Porkbun", icon: TbWorld },
  { name: "MapLibre GL JS", icon: SiMaplibre },
  { name: "OpenStreetMaps", icon: SiOpenstreetmap },
];

export default function TechnologiesCarousel() {
  return (
    <motion.section
      className="space-y-4 sm:space-y-5 md:space-y-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="space-y-2 text-center sm:space-y-2.5 md:space-y-3"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
      >
        <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
          Tech Arsenal
        </p>
        <h2 className="retro text-lg uppercase tracking-[0.2em] sm:text-xl sm:tracking-[0.25em] md:text-2xl md:tracking-[0.3em]">
          Technologies I Use
        </h2>
        <p className="retro mx-auto max-w-xl text-[0.55rem] leading-relaxed text-muted-foreground sm:text-[0.65rem] md:text-xs">
          A curated stack of tools, languages, and platforms I regularly use to ship products—from backend infrastructure to front-end polish and developer tooling.
        </p>
      </motion.div>

      <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6">
        <motion.div
          className="relative w-full px-8 sm:px-10 md:px-12 lg:px-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {technologies.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <CarouselItem
                    key={`${tech.name}-${index}`}
                    className="basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
                  >
                    <motion.div
                      className={panelClass}
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    >
                      <div className="flex flex-col items-center gap-2 sm:gap-2.5 md:gap-3">
                        <Icon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                        <p className="retro text-[0.5rem] uppercase tracking-[0.15em] sm:text-xs sm:tracking-[0.18em] md:text-sm md:tracking-[0.2em]">
                          {tech.name}
                        </p>
                      </div>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="h-8 w-8 sm:h-10 sm:w-10" />
            <CarouselNext className="h-8 w-8 sm:h-10 sm:w-10" />
          </Carousel>
        </motion.div>

        <FullStackPreview />
      </div>
    </motion.section>
  );
}

function FullStackPreview() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-3 sm:gap-4 md:gap-5">
      <Button
        type="button"
        variant={isOpen ? "outline" : "default"}
        className="retro h-8 px-6 text-[0.55rem] uppercase tracking-[0.18em] sm:h-9 sm:px-8 sm:text-[0.65rem] sm:tracking-[0.22em] md:h-10 md:px-10 md:text-xs md:tracking-[0.25em]"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        {isOpen ? "Hide Full Tech Stack" : "Show All Tech Stacks"}
      </Button>

      {isOpen && (
        <motion.div
          className="w-full rounded-none border-4 border-border bg-card/80 p-3 shadow-[3px_3px_0_var(--border)] backdrop-blur-sm dark:border-ring min-[375px]:p-4 sm:p-5 md:p-6"
          aria-label="Full technology stack preview"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="mb-3 flex flex-col gap-1 text-left sm:mb-4 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="retro text-[0.5rem] uppercase tracking-[0.18em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.22em] md:text-xs md:tracking-[0.25em]">
              Full Tech Stack Overview
            </p>
            <p className="retro text-[0.5rem] text-muted-foreground sm:text-[0.6rem] md:text-xs">
              {technologies.length} tools, frameworks, and platforms
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 min-[375px]:grid-cols-3 min-[375px]:gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 md:gap-3.5 lg:grid-cols-6 lg:gap-4">
            {technologies.map((tech) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  className="rounded-none border-2 border-border bg-background/80 p-2 text-center shadow-[2px_2px_0_var(--border)] transition-transform transition-shadow duration-150 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--primary)] dark:border-ring sm:p-2.5 md:p-3"
                  whileHover={{ y: -6, scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                    <p className="retro text-[0.45rem] uppercase tracking-[0.14em] text-foreground sm:text-[0.5rem] sm:tracking-[0.16em] md:text-[0.55rem] md:tracking-[0.18em]">
                      {tech.name}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

