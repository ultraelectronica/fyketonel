"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/8bit/carousel";
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
    <section className="space-y-4 sm:space-y-5 md:space-y-6">
      <div className="space-y-2 text-center sm:space-y-2.5 md:space-y-3">
        <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
          Tech Arsenal
        </p>
        <h2 className="retro text-lg uppercase tracking-[0.2em] sm:text-xl sm:tracking-[0.25em] md:text-2xl md:tracking-[0.3em]">
          Technologies I Use
        </h2>
      </div>
      <div className="relative px-8 sm:px-10 md:px-12 lg:px-16">
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
                  <div className={panelClass}>
                    <div className="flex flex-col items-center gap-2 sm:gap-2.5 md:gap-3">
                      <Icon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                      <p className="retro text-[0.5rem] uppercase tracking-[0.15em] sm:text-xs sm:tracking-[0.18em] md:text-sm md:tracking-[0.2em]">
                        {tech.name}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="h-8 w-8 sm:h-10 sm:w-10" />
          <CarouselNext className="h-8 w-8 sm:h-10 sm:w-10" />
        </Carousel>
      </div>
    </section>
  );
}

