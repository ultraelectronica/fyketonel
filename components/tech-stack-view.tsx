"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

const lastUsedDot: Record<LastUsed, string> = {
  active: "bg-green-500",
  "2026": "bg-emerald-500",
  "2025": "bg-yellow-500",
  "2024": "bg-orange-500",
  "2023": "bg-red-500",
  archived: "bg-muted-foreground",
};

const categoryMeta: Record<
  TechCategory,
  { label: string; color: string }
> = {
  languages: { label: "Languages", color: "text-cyan-600 dark:text-cyan-400" },
  frameworks: { label: "Frameworks", color: "text-purple-600 dark:text-purple-400" },
  databases: { label: "Databases", color: "text-amber-600 dark:text-amber-400" },
  cloud: { label: "Cloud & Infra", color: "text-blue-600 dark:text-blue-400" },
  tools: { label: "Tools & Editors", color: "text-green-600 dark:text-green-400" },
  platforms: { label: "Platforms", color: "text-red-600 dark:text-red-400" },
};

const technologies: TechItem[] = [
  { name: "Dart", icon: SiDart, category: "languages", lastUsed: "active" },
  { name: "TypeScript", icon: SiTypescript, category: "languages", lastUsed: "active" },
  { name: "JavaScript", icon: SiJavascript, category: "languages", lastUsed: "active" },
  { name: "SQL", icon: TbDatabase, category: "languages", lastUsed: "active" },
  { name: "Bash", icon: SiGnubash, category: "languages", lastUsed: "active" },
  { name: "PowerShell", icon: TbBrandPowershell, category: "languages", lastUsed: "2025" },
  { name: "Flutter", icon: SiFlutter, category: "frameworks", lastUsed: "active" },
  { name: "React", icon: SiReact, category: "frameworks", lastUsed: "active" },
  { name: "Next.js", icon: SiNextdotjs, category: "frameworks", lastUsed: "active" },
  { name: "Express.js", icon: SiExpress, category: "frameworks", lastUsed: "active" },
  { name: "Node.js", icon: SiNodedotjs, category: "frameworks", lastUsed: "active" },
  { name: "Remix", icon: SiRemix, category: "frameworks", lastUsed: "2025" },
  { name: "Three.js", icon: SiThreedotjs, category: "frameworks", lastUsed: "2025" },
  { name: "Tailwind CSS", icon: SiTailwindcss, category: "frameworks", lastUsed: "active" },
  { name: "MapLibre GL JS", icon: SiMaplibre, category: "frameworks", lastUsed: "2025" },
  { name: "PostgreSQL", icon: SiPostgresql, category: "databases", lastUsed: "active" },
  { name: "PL/pgSQL", icon: SiPostgresql, category: "databases", lastUsed: "active" },
  { name: "MySQL", icon: SiMysql, category: "databases", lastUsed: "2023" },
  { name: "SQLite", icon: SiSqlite, category: "databases", lastUsed: "2025" },
  { name: "QuestDB", icon: TbDatabase, category: "databases", lastUsed: "2024" },
  { name: "Firebase", icon: SiFirebase, category: "cloud", lastUsed: "2025" },
  { name: "Supabase", icon: SiSupabase, category: "cloud", lastUsed: "active" },
  { name: "GCP", icon: SiGooglecloud, category: "cloud", lastUsed: "2025" },
  { name: "Cloudflare", icon: SiCloudflare, category: "cloud", lastUsed: "active" },
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
  { name: "VS Code", icon: TbBrandVscode, category: "tools", lastUsed: "active" },
  { name: "Android Studio", icon: SiAndroidstudio, category: "tools", lastUsed: "2025" },
  { name: "Visual Studio", icon: TbBrandVisualStudio, category: "tools", lastUsed: "archived" },
  { name: "Namecheap", icon: SiNamecheap, category: "tools", lastUsed: "active" },
  { name: "Porkbun", icon: TbWorld, category: "tools", lastUsed: "active" },
  { name: "Linux", icon: SiLinux, category: "platforms", lastUsed: "active" },
  { name: "ArchLinux", icon: SiArchlinux, category: "platforms", lastUsed: "active" },
  { name: "Windows", icon: TbBrandWindows, category: "platforms", lastUsed: "active" },
  { name: "OpenStreetMaps", icon: SiOpenstreetmap, category: "platforms", lastUsed: "2025" },
];

function TechChip({ tech, index }: { tech: TechItem; index: number }) {
  const Icon = tech.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.015, duration: 0.2 }}
      className="group flex items-center gap-2 px-2.5 py-1.5 transition-colors hover:bg-primary/5"
      title={`${tech.name} — ${tech.lastUsed === "active" ? "Active" : tech.lastUsed}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
      <span className="retro text-[0.5rem] uppercase tracking-wider text-foreground">
        {tech.name}
      </span>
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${lastUsedDot[tech.lastUsed]}`}
      />
    </motion.div>
  );
}

export default function TechStackView() {
  const [activeFilter, setActiveFilter] = useState<TechCategory | "all">("all");

  const categories = (Object.keys(categoryMeta) as TechCategory[]).filter(
    (cat) => technologies.some((t) => t.category === cat)
  );

  const visibleCategories =
    activeFilter === "all" ? categories : [activeFilter];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-3"
    >
      {/* Minimal filter bar */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`retro px-2 py-1 text-[0.45rem] uppercase tracking-wider transition-colors ${
            activeFilter === "all"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({technologies.length})
        </button>
        {categories.map((cat) => {
          const count = technologies.filter((t) => t.category === cat).length;
          const active = activeFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`retro px-2 py-1 text-[0.45rem] uppercase tracking-wider transition-colors ${
                active
                  ? `${categoryMeta[cat].color}`
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {categoryMeta[cat].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Dashed rule */}
      <div className="border-t border-dashed border-border/40" />

      {/* Category groups */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCategories.map((cat) => {
          const catTechs = technologies.filter((t) => t.category === cat);
          const meta = categoryMeta[cat];
          return (
            <div key={cat} className="space-y-1.5">
              <h3
                className={`retro text-[0.5rem] uppercase tracking-[0.2em] ${meta.color}`}
              >
                {meta.label}
              </h3>
              <div className="flex flex-wrap gap-1">
                {catTechs.map((tech, i) => (
                  <TechChip key={tech.name} tech={tech} index={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tiny legend */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {(
          [
            ["active", "Active"],
            ["2025", "2025"],
            ["2024", "2024"],
            ["2023", "2023"],
            ["archived", "Archived"],
          ] as [LastUsed, string][]
        ).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${lastUsedDot[key]}`} />
            <span className="retro text-[0.4rem] uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
