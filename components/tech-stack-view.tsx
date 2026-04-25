"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  TbDatabase,
  TbBrandVscode,
  TbBrandWindows,
  TbBrandPowershell,
  TbBrandVisualStudio,
  TbWorld,
} from "react-icons/tb";
import type { IconType } from "react-icons";

type TechCategory =
  | "languages"
  | "frameworks"
  | "databases"
  | "cloud"
  | "tools"
  | "platforms";

type LastUsed = "active" | "2026" | "2025" | "2024" | "2023" | "archived";

interface TechItem {
  name: string;
  icon: IconType;
  category: TechCategory;
  lastUsed: LastUsed;
}

const lastUsedConfig: Record<
  LastUsed,
  { label: string; color: string; dotColor: string }
> = {
  active: {
    label: "Active",
    color: "text-green-500",
    dotColor: "bg-green-500",
  },
  "2026": {
    label: "2026",
    color: "text-emerald-500",
    dotColor: "bg-emerald-500",
  },
  "2025": {
    label: "2025",
    color: "text-yellow-500",
    dotColor: "bg-yellow-500",
  },
  "2024": {
    label: "2024",
    color: "text-orange-500",
    dotColor: "bg-orange-500",
  },
  "2023": { label: "2023", color: "text-red-500", dotColor: "bg-red-500" },
  archived: {
    label: "Archived",
    color: "text-muted-foreground",
    dotColor: "bg-muted-foreground",
  },
};

const technologies: TechItem[] = [
  { name: "Dart", icon: SiDart, category: "languages", lastUsed: "active" },
  {
    name: "TypeScript",
    icon: SiTypescript,
    category: "languages",
    lastUsed: "active",
  },
  {
    name: "JavaScript",
    icon: SiJavascript,
    category: "languages",
    lastUsed: "active",
  },
  { name: "SQL", icon: TbDatabase, category: "languages", lastUsed: "active" },
  { name: "Bash", icon: SiGnubash, category: "languages", lastUsed: "active" },
  {
    name: "PowerShell",
    icon: TbBrandPowershell,
    category: "languages",
    lastUsed: "2025",
  },
  {
    name: "Flutter",
    icon: SiFlutter,
    category: "frameworks",
    lastUsed: "active",
  },
  { name: "React", icon: SiReact, category: "frameworks", lastUsed: "active" },
  {
    name: "Next.js",
    icon: SiNextdotjs,
    category: "frameworks",
    lastUsed: "active",
  },
  {
    name: "Express.js",
    icon: SiExpress,
    category: "frameworks",
    lastUsed: "active",
  },
  {
    name: "Node.js",
    icon: SiNodedotjs,
    category: "frameworks",
    lastUsed: "active",
  },
  { name: "Remix", icon: SiRemix, category: "frameworks", lastUsed: "2025" },
  {
    name: "Three.js",
    icon: SiThreedotjs,
    category: "frameworks",
    lastUsed: "2025",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    category: "frameworks",
    lastUsed: "active",
  },
  {
    name: "MapLibre GL JS",
    icon: SiMaplibre,
    category: "frameworks",
    lastUsed: "2025",
  },
  {
    name: "PostgreSQL",
    icon: SiPostgresql,
    category: "databases",
    lastUsed: "active",
  },
  {
    name: "PL/pgSQL",
    icon: SiPostgresql,
    category: "databases",
    lastUsed: "active",
  },
  { name: "MySQL", icon: SiMysql, category: "databases", lastUsed: "2023" },
  { name: "SQLite", icon: SiSqlite, category: "databases", lastUsed: "2025" },
  {
    name: "QuestDB",
    icon: TbDatabase,
    category: "databases",
    lastUsed: "2024",
  },
  { name: "Firebase", icon: SiFirebase, category: "cloud", lastUsed: "2025" },
  { name: "Supabase", icon: SiSupabase, category: "cloud", lastUsed: "active" },
  { name: "GCP", icon: SiGooglecloud, category: "cloud", lastUsed: "2025" },
  {
    name: "Cloudflare",
    icon: SiCloudflare,
    category: "cloud",
    lastUsed: "active",
  },
  { name: "Docker", icon: SiDocker, category: "tools", lastUsed: "active" },
  { name: "Git", icon: SiGit, category: "tools", lastUsed: "active" },
  { name: "GitHub", icon: SiGithub, category: "tools", lastUsed: "active" },
  { name: "GitLab", icon: SiGitlab, category: "tools", lastUsed: "2025" },
  { name: "Postman", icon: SiPostman, category: "tools", lastUsed: "active" },
  { name: "npm", icon: SiNpm, category: "tools", lastUsed: "active" },
  { name: "pnpm", icon: SiPnpm, category: "tools", lastUsed: "active" },
  { name: "Bun", icon: SiBun, category: "tools", lastUsed: "active" },
  { name: "Neovim", icon: SiNeovim, category: "tools", lastUsed: "active" },
  { name: "Zed", icon: TbBrandVscode, category: "tools", lastUsed: "active" },
  {
    name: "VS Code",
    icon: TbBrandVscode,
    category: "tools",
    lastUsed: "active",
  },
  {
    name: "Android Studio",
    icon: SiAndroidstudio,
    category: "tools",
    lastUsed: "2025",
  },
  {
    name: "Visual Studio",
    icon: TbBrandVisualStudio,
    category: "tools",
    lastUsed: "archived",
  },
  {
    name: "Namecheap",
    icon: SiNamecheap,
    category: "tools",
    lastUsed: "active",
  },
  { name: "Porkbun", icon: TbWorld, category: "tools", lastUsed: "active" },
  { name: "Linux", icon: SiLinux, category: "platforms", lastUsed: "active" },
  {
    name: "ArchLinux",
    icon: SiArchlinux,
    category: "platforms",
    lastUsed: "active",
  },
  {
    name: "Windows",
    icon: TbBrandWindows,
    category: "platforms",
    lastUsed: "active",
  },
  {
    name: "OpenStreetMaps",
    icon: SiOpenstreetmap,
    category: "platforms",
    lastUsed: "2024",
  },
];

const categoryConfig: Record<
  TechCategory,
  { label: string; color: string; icon: string }
> = {
  languages: { label: "LANGUAGES", color: "border-cyan-500", icon: "⌨" },
  frameworks: { label: "FRAMEWORKS", color: "border-purple-500", icon: "⚡" },
  databases: { label: "DATABASES", color: "border-amber-500", icon: "🗄" },
  cloud: { label: "CLOUD & INFRA", color: "border-blue-500", icon: "☁" },
  tools: { label: "TOOLS & EDITORS", color: "border-green-500", icon: "🔧" },
  platforms: { label: "PLATFORMS", color: "border-red-500", icon: "🖥" },
};

function LastUsedIndicator({ lastUsed }: { lastUsed: LastUsed }) {
  const config = lastUsedConfig[lastUsed];

  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-1.5 w-1.5 shrink-0 ${config.dotColor}`} />
      <span
        className={`retro text-[0.5rem] uppercase tracking-wider ${config.color}`}
      >
        {config.label}
      </span>
    </div>
  );
}

function TechCard({ tech, index }: { tech: TechItem; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = tech.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className="rounded-none border-2 border-border bg-card/90 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm"
    >
      <button
        type="button"
        className="w-full p-2.5 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border-2 border-border bg-background/80 shadow-[1px_1px_0_var(--border)]">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="retro truncate text-[0.6rem] uppercase tracking-[0.12em] text-foreground">
              {tech.name}
            </p>
            <div className="mt-1.5">
              <LastUsedIndicator lastUsed={tech.lastUsed} />
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 text-[0.5rem] text-muted-foreground"
          >
            ▼
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-1.5 border-t-2 border-dashed border-border/50 pt-2">
                <div className="flex items-center justify-between">
                  <span className="retro text-[0.45rem] uppercase tracking-wider text-muted-foreground">
                    Last Used
                  </span>
                  <span
                    className={`retro text-[0.5rem] font-bold uppercase ${lastUsedConfig[tech.lastUsed].color}`}
                  >
                    {lastUsedConfig[tech.lastUsed].label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="retro text-[0.45rem] uppercase tracking-wider text-muted-foreground">
                    Category
                  </span>
                  <span className="retro text-[0.45rem] uppercase tracking-wider text-foreground">
                    {categoryConfig[tech.category].label}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

function CategorySection({
  category,
  techs,
}: {
  category: TechCategory;
  techs: TechItem[];
}) {
  const config = categoryConfig[category];

  return (
    <div className="space-y-2">
      <div
        className={`flex items-center gap-2 border-l-4 ${config.color} bg-card/50 px-3 py-2`}
      >
        <span className="retro text-[0.6rem]">{config.icon}</span>
        <h3 className="retro text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
          {config.label}
        </h3>
        <span className="retro ml-auto text-[0.5rem] text-muted-foreground">
          {techs.length}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {techs.map((tech, index) => (
          <TechCard key={tech.name} tech={tech} index={index} />
        ))}
      </div>
    </div>
  );
}

export default function TechStackView() {
  const [activeFilter, setActiveFilter] = useState<TechCategory | "all">("all");

  const categories = Object.keys(categoryConfig) as TechCategory[];
  const filteredTechs =
    activeFilter === "all"
      ? technologies
      : technologies.filter((t) => t.category === activeFilter);

  const groupedTechs =
    activeFilter === "all"
      ? categories.reduce(
          (acc, cat) => {
            const catTechs = technologies.filter((t) => t.category === cat);
            if (catTechs.length > 0) acc[cat] = catTechs;
            return acc;
          },
          {} as Record<TechCategory, TechItem[]>,
        )
      : { [activeFilter]: filteredTechs };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4"
    >
      <div className="space-y-2 text-center">
        <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground md:text-[0.6rem]">
          Tech Arsenal
        </p>
        <h2 className="retro text-lg uppercase tracking-[0.2em] md:text-xl">
          Equipped Technologies
        </h2>
        <p className="retro mx-auto max-w-sm text-[0.55rem] leading-relaxed text-muted-foreground md:max-w-lg md:text-xs">
          Full stack of tools, frameworks, and platforms I use to ship products.
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`retro shrink-0 rounded-none border-2 px-3 py-1.5 text-[0.5rem] uppercase tracking-[0.15em] transition-all ${
            activeFilter === "all"
              ? "border-primary bg-primary/20 text-primary shadow-[2px_2px_0_var(--primary)]"
              : "border-border bg-card/50 text-muted-foreground hover:border-primary/50"
          }`}
        >
          ALL ({technologies.length})
        </button>
        {categories.map((cat) => {
          const count = technologies.filter((t) => t.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`retro shrink-0 rounded-none border-2 px-3 py-1.5 text-[0.5rem] uppercase tracking-[0.15em] transition-all ${
                activeFilter === cat
                  ? `border-primary bg-primary/20 text-primary shadow-[2px_2px_0_var(--primary)]`
                  : "border-border bg-card/50 text-muted-foreground hover:border-primary/50"
              }`}
            >
              {categoryConfig[cat].label.split(" ")[0]} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {Object.entries(groupedTechs).map(([category, techs]) => (
          <CategorySection
            key={category}
            category={category as TechCategory}
            techs={techs}
          />
        ))}
      </div>

      <div className="rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)]">
        <div className="mb-2 flex items-center justify-between">
          <span className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">
            Total Technologies
          </span>
          <span className="retro text-[0.6rem] font-bold text-primary">
            {technologies.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
          {categories.map((cat) => {
            const count = technologies.filter((t) => t.category === cat).length;
            const activeCount = technologies.filter(
              (t) => t.category === cat && t.lastUsed === "active",
            ).length;
            return (
              <div
                key={cat}
                className="border border-dashed border-border/50 bg-background/50 p-2 text-center"
              >
                <p className="retro text-[0.45rem] uppercase tracking-wider text-muted-foreground">
                  {categoryConfig[cat].label.split(" ")[0]}
                </p>
                <p className="retro mt-1 text-[0.65rem] font-bold text-foreground">
                  {count}
                </p>
                <p className="retro text-[0.45rem] text-green-500">
                  {activeCount} active
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
