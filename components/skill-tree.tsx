"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { steps } from "@/components/ui/8bit/motion-utils";

type SkillBranch = "frontend" | "backend" | "devops" | "design" | "core";

interface SkillData {
  id: string;
  name: string;
  branch: SkillBranch;
  level: number;
  maxLevel: number;
  unlocked: boolean;
  prerequisites?: string[];
  description: string;
  projects?: string[];
  yearsExperience?: number;
  position: { x: number; y: number };
}

const skillsData: SkillData[] = [
  {
    id: "programming-fundamentals",
    name: "Prog. Fundamentals",
    branch: "core",
    level: 100,
    maxLevel: 100,
    unlocked: true,
    description: "Master of algorithms, data structures, and problem-solving.",
    yearsExperience: 5,
    position: { x: 2, y: 0 },
  },
  {
    id: "html-css",
    name: "HTML & CSS",
    branch: "frontend",
    level: 100,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["programming-fundamentals"],
    description: "The ancient languages of web structure and style.",
    projects: ["Pasada", "LockerApp", "Portfolio"],
    yearsExperience: 4,
    position: { x: 0, y: 1 },
  },
  {
    id: "javascript",
    name: "JavaScript",
    branch: "frontend",
    level: 95,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["html-css"],
    description: "The power to bring web pages to life with interactivity.",
    projects: ["Pasada", "LockerApp", "Portfolio", "Revo"],
    yearsExperience: 4,
    position: { x: 0, y: 2 },
  },
  {
    id: "typescript",
    name: "TypeScript",
    branch: "frontend",
    level: 90,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["javascript"],
    description: "Type safety enchantments for JavaScript spells.",
    projects: ["Pasada", "Portfolio", "Revo"],
    yearsExperience: 2,
    position: { x: 0, y: 3 },
  },
  {
    id: "react",
    name: "React",
    branch: "frontend",
    level: 85,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["javascript"],
    description: "Component-based magic for building powerful UIs.",
    projects: ["Pasada", "LockerApp", "Portfolio", "Revo"],
    yearsExperience: 3,
    position: { x: 0, y: 4 },
  },
  {
    id: "nextjs",
    name: "Next.js",
    branch: "frontend",
    level: 80,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["react"],
    description: "Full-stack React framework with server-side rendering.",
    projects: ["Portfolio", "Revo"],
    yearsExperience: 2,
    position: { x: 0, y: 5 },
  },
  {
    id: "tailwind",
    name: "Tailwind",
    branch: "frontend",
    level: 90,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["html-css"],
    description: "Utility-first CSS framework for rapid styling.",
    projects: ["Pasada", "Portfolio", "Revo"],
    yearsExperience: 2,
    position: { x: 1, y: 2 },
  },
  {
    id: "nodejs",
    name: "Node.js",
    branch: "backend",
    level: 75,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["programming-fundamentals"],
    description: "JavaScript runtime for server-side development.",
    projects: ["Pasada"],
    yearsExperience: 3,
    position: { x: 3, y: 1 },
  },
  {
    id: "databases",
    name: "Databases",
    branch: "backend",
    level: 70,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["nodejs"],
    description: "Data persistence and retrieval systems.",
    projects: ["Pasada", "LockerApp"],
    yearsExperience: 3,
    position: { x: 3, y: 2 },
  },
  {
    id: "api-design",
    name: "REST APIs",
    branch: "backend",
    level: 80,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["nodejs"],
    description: "Crafting elegant APIs for data communication.",
    projects: ["Pasada"],
    yearsExperience: 3,
    position: { x: 4, y: 2 },
  },
  {
    id: "authentication",
    name: "Auth",
    branch: "backend",
    level: 75,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["api-design", "databases"],
    description: "Secure user authentication and authorization systems.",
    projects: ["Pasada"],
    yearsExperience: 2,
    position: { x: 3, y: 3 },
  },
  {
    id: "git",
    name: "Git",
    branch: "devops",
    level: 90,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["programming-fundamentals"],
    description: "Version control mastery and collaboration.",
    yearsExperience: 4,
    position: { x: 2, y: 1 },
  },
  {
    id: "docker",
    name: "Docker",
    branch: "devops",
    level: 60,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["git"],
    description: "Containerization for consistent environments.",
    yearsExperience: 1,
    position: { x: 2, y: 2 },
  },
  {
    id: "cicd",
    name: "CI/CD",
    branch: "devops",
    level: 40,
    maxLevel: 100,
    unlocked: false,
    prerequisites: ["docker", "git"],
    description: "Automated testing and deployment pipelines.",
    position: { x: 2, y: 3 },
  },
  {
    id: "cloud",
    name: "Cloud",
    branch: "devops",
    level: 50,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["docker"],
    description: "AWS, Azure, or GCP infrastructure management.",
    yearsExperience: 1,
    position: { x: 1, y: 3 },
  },
  {
    id: "ui-design",
    name: "UI Design",
    branch: "design",
    level: 70,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["html-css"],
    description: "Creating beautiful and intuitive interfaces.",
    projects: ["Portfolio"],
    yearsExperience: 3,
    position: { x: 4, y: 1 },
  },
  {
    id: "ux-principles",
    name: "UX",
    branch: "design",
    level: 65,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["ui-design"],
    description: "Understanding user behavior and experience.",
    yearsExperience: 2,
    position: { x: 4, y: 3 },
  },
  {
    id: "accessibility",
    name: "A11y",
    branch: "design",
    level: 55,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["ui-design"],
    description: "Making web accessible for everyone.",
    yearsExperience: 1,
    position: { x: 4, y: 4 },
  },
];

const branchConfig: Record<SkillBranch, { border: string; bg: string; text: string; glow: string; label: string }> = {
  core: {
    border: "border-purple-500 dark:border-purple-400",
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    label: "Core",
  },
  frontend: {
    border: "border-blue-500 dark:border-blue-400",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.4)]",
    label: "Frontend",
  },
  backend: {
    border: "border-green-500 dark:border-green-400",
    bg: "bg-green-500/10",
    text: "text-green-600 dark:text-green-400",
    glow: "shadow-[0_0_15px_rgba(34,197,94,0.4)]",
    label: "Backend",
  },
  devops: {
    border: "border-orange-500 dark:border-orange-400",
    bg: "bg-orange-500/10",
    text: "text-orange-600 dark:text-orange-400",
    glow: "shadow-[0_0_15px_rgba(249,115,22,0.4)]",
    label: "DevOps",
  },
  design: {
    border: "border-pink-500 dark:border-pink-400",
    bg: "bg-pink-500/10",
    text: "text-pink-600 dark:text-pink-400",
    glow: "shadow-[0_0_15px_rgba(236,72,153,0.4)]",
    label: "Design",
  },
};

const branchOrder: SkillBranch[] = ["core", "frontend", "backend", "devops", "design"];

const NODE_SPACING_X = 144;
const NODE_SPACING_Y = 112;
const NODE_WIDTH = 120;
const NODE_HEIGHT = 92;
const maxX = Math.max(...skillsData.map((skill) => skill.position.x));
const maxY = Math.max(...skillsData.map((skill) => skill.position.y));
const canvasWidth = (maxX + 1) * NODE_SPACING_X + NODE_WIDTH;
const canvasHeight = (maxY + 1) * NODE_SPACING_Y + NODE_HEIGHT;

export function SkillTree({ className }: { className?: string }) {
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skillsData[0].id);
  const [activeBranch, setActiveBranch] = useState<SkillBranch | "all">("all");

  const selectedSkill = skillsData.find((skill) => skill.id === selectedSkillId) ?? skillsData[0];
  const totalSkillPoints = skillsData.reduce((sum, skill) => sum + skill.level, 0);
  const maxSkillPoints = skillsData.reduce((sum, skill) => sum + skill.maxLevel, 0);
  const unlockedCount = skillsData.filter((skill) => skill.unlocked).length;
  const averageMastery = Math.round(totalSkillPoints / skillsData.length);

  const branchProgress = branchOrder.map((branch) => {
    const branchSkills = skillsData.filter((skill) => skill.branch === branch);
    const unlocked = branchSkills.filter((skill) => skill.unlocked).length;
    const total = branchSkills.reduce((sum, skill) => sum + skill.level, 0);
    const max = branchSkills.length * 100 || 1;

    return {
      branch,
      percent: Math.round((total / max) * 100),
      unlocked,
      total: branchSkills.length,
      ...branchConfig[branch],
    };
  });

  const mobileSkills = useMemo(() => {
    const filtered = activeBranch === "all" ? skillsData : skillsData.filter((skill) => skill.branch === activeBranch);

    return [...filtered].sort((left, right) => {
      if (left.branch !== right.branch) {
        return branchOrder.indexOf(left.branch) - branchOrder.indexOf(right.branch);
      }

      return right.level - left.level;
    });
  }, [activeBranch]);

  return (
    <section className={cn("relative overflow-hidden rounded-none border-2 border-border bg-card shadow-[4px_4px_0_var(--border)]", className)}>
      <div className="border-b-2 border-border bg-muted/30 px-3 py-3 sm:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground">Growth Matrix</p>
            <h2 className="retro mt-1 text-sm uppercase tracking-[0.2em] text-primary sm:text-base">Skill Tree</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[430px] lg:flex-1">
            <StatChip label="Points" value={`${totalSkillPoints}/${maxSkillPoints}`} helper="total mastery" />
            <StatChip label="Unlocked" value={`${unlockedCount}/${skillsData.length}`} helper="active nodes" />
            <StatChip label="Average" value={`${averageMastery}%`} helper="skill depth" />
          </div>
        </div>
      </div>

      <div className="border-b-2 border-border bg-background/40 px-3 py-3 sm:px-4">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
          {branchProgress.map((branch) => (
            <button
              key={branch.branch}
              type="button"
              onClick={() => setActiveBranch((current) => (current === branch.branch ? "all" : branch.branch))}
              className={cn(
                "border-2 px-3 py-2 text-left transition-colors",
                branch.border,
                branch.bg,
                activeBranch === branch.branch ? "shadow-[0_0_0_2px_var(--primary)]" : "hover:border-primary"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={cn("retro text-[0.55rem] uppercase tracking-[0.2em]", branch.text)}>{branch.label}</span>
                <span className="retro text-[0.5rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {branch.unlocked}/{branch.total}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden bg-background/60">
                <div className={cn("h-full", branch.border.replace("border-", "bg-"))} style={{ width: `${branch.percent}%` }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-3 sm:p-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <div className="min-w-0 space-y-4">
          <div className="hidden rounded-none border-2 border-dashed border-border/60 bg-background/30 p-4 lg:block">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="retro text-[0.5rem] uppercase tracking-[0.28em] text-muted-foreground">Skill Map</p>
                <h3 className="retro mt-1 text-xs uppercase tracking-[0.18em] text-foreground sm:text-sm">
                  Select a node to inspect the build path
                </h3>
              </div>
              <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">desktop route view</p>
            </div>

            <div className="overflow-x-auto overflow-y-hidden pb-2">
              <div className="relative min-w-max" style={{ width: canvasWidth, height: canvasHeight }}>
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(0deg, currentColor 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                <svg className="pointer-events-none absolute inset-0 overflow-visible" style={{ width: "100%", height: "100%" }}>
                  {skillsData.map((skill) =>
                    skill.prerequisites?.map((prerequisiteId) => {
                      const prerequisite = skillsData.find((entry) => entry.id === prerequisiteId);
                      if (!prerequisite) {
                        return null;
                      }

                      const x1 = prerequisite.position.x * NODE_SPACING_X + NODE_WIDTH / 2;
                      const y1 = prerequisite.position.y * NODE_SPACING_Y + NODE_HEIGHT / 2;
                      const x2 = skill.position.x * NODE_SPACING_X + NODE_WIDTH / 2;
                      const y2 = skill.position.y * NODE_SPACING_Y + NODE_HEIGHT / 2;
                      const isActive = selectedSkill.id === skill.id || selectedSkill.id === prerequisite.id;

                      return (
                        <line
                          key={`${prerequisiteId}-${skill.id}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="currentColor"
                          strokeWidth={isActive ? "3" : "2"}
                          strokeDasharray={skill.unlocked ? "0" : "5,5"}
                          className={isActive ? "text-primary/70" : "text-border/50"}
                        />
                      );
                    })
                  )}
                </svg>

                {skillsData.map((skill) => (
                  <DesktopSkillNode
                    key={skill.id}
                    skill={skill}
                    isSelected={selectedSkill.id === skill.id}
                    isDimmed={activeBranch !== "all" && skill.branch !== activeBranch}
                    onSelect={() => setSelectedSkillId(skill.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-none border-2 border-border bg-background/50 p-3 shadow-[2px_2px_0_var(--border)] sm:p-4 lg:hidden">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="retro text-[0.5rem] uppercase tracking-[0.28em] text-muted-foreground">Skill Browser</p>
                <h3 className="retro mt-1 text-xs uppercase tracking-[0.18em] text-foreground sm:text-sm">
                  Mobile-first skill list
                </h3>
              </div>
              <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">tap any card</p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <FilterChip active={activeBranch === "all"} label="All" onClick={() => setActiveBranch("all")} />
              {branchOrder.map((branch) => (
                <FilterChip
                  key={branch}
                  active={activeBranch === branch}
                  label={branchConfig[branch].label}
                  onClick={() => setActiveBranch(branch)}
                />
              ))}
            </div>

            <div className="space-y-2">
              {mobileSkills.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => setSelectedSkillId(skill.id)}
                  className={cn(
                    "w-full border-2 p-3 text-left transition-colors",
                    selectedSkill.id === skill.id ? "border-primary bg-primary/10" : "border-border/60 bg-card/70",
                    branchConfig[skill.branch].bg
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="retro truncate text-[0.62rem] uppercase tracking-[0.16em] text-foreground">{skill.name}</p>
                      <p className="retro mt-1 text-[0.45rem] uppercase tracking-[0.2em] text-muted-foreground">
                        {branchConfig[skill.branch].label} {skill.yearsExperience ? `• ${skill.yearsExperience}y` : ""}
                      </p>
                    </div>
                    <span className={cn("retro shrink-0 text-[0.55rem] uppercase tracking-[0.16em]", branchConfig[skill.branch].text)}>
                      {skill.unlocked ? `${skill.level}%` : "Locked"}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden bg-background/60">
                    <div className={cn("h-full", branchConfig[skill.branch].border.replace("border-", "bg-"))} style={{ width: `${skill.level}%` }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-none border-2 border-border bg-card/80 p-3 shadow-[4px_4px_0_var(--border)] sm:p-4">
            <div className="mb-3 border-b-2 border-dashed border-border/50 pb-3">
              <p className="retro text-[0.5rem] uppercase tracking-[0.28em] text-muted-foreground">Branch Snapshot</p>
              <h3 className="retro mt-1 text-xs uppercase tracking-[0.18em] text-foreground sm:text-sm">Mastery by discipline</h3>
            </div>

            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {branchProgress.map((branch) => (
                <div key={branch.branch} className={cn("border-2 p-3", branch.border, branch.bg)}>
                  <div className="flex items-center justify-between gap-3">
                    <p className={cn("retro text-[0.55rem] uppercase tracking-[0.18em]", branch.text)}>{branch.label}</p>
                    <p className="retro text-[0.45rem] uppercase tracking-[0.18em] text-muted-foreground">{branch.percent}%</p>
                  </div>
                  <p className="retro mt-2 text-[0.45rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {branch.unlocked}/{branch.total} nodes unlocked
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SkillDetailsPanel skill={selectedSkill} />
      </div>
    </section>
  );
}

function StatChip({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="border-2 border-border/70 bg-background/70 px-3 py-2 shadow-[2px_2px_0_var(--border)]">
      <p className="retro text-[0.45rem] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
      <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <p className="retro text-sm uppercase tracking-[0.16em] text-foreground">{value}</p>
        <p className="retro text-[0.45rem] uppercase tracking-[0.18em] text-muted-foreground">{helper}</p>
      </div>
    </div>
  );
}

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "retro shrink-0 border px-3 py-1.5 text-[0.48rem] uppercase tracking-[0.2em] transition-colors",
        active ? "border-primary bg-primary/10 text-primary" : "border-border/60 bg-background/70 text-muted-foreground"
      )}
    >
      {label}
    </button>
  );
}

function DesktopSkillNode({
  skill,
  isSelected,
  isDimmed,
  onSelect,
}: {
  skill: SkillData;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: () => void;
}) {
  const colors = branchConfig[skill.branch];

  return (
    <motion.div
      className={cn("absolute", isDimmed && "opacity-35")}
      style={{
        left: `${skill.position.x * NODE_SPACING_X}px`,
        top: `${skill.position.y * NODE_SPACING_Y}px`,
        width: `${NODE_WIDTH}px`,
        height: `${NODE_HEIGHT}px`,
      }}
      whileHover={{ scale: 1.04, y: -2, transition: { duration: 0.1, ease: steps(2) } }}
      transition={{ duration: 0.2, ease: steps(2) }}
    >
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "relative h-full w-full border-2 p-2 text-left backdrop-blur-sm transition-none",
          skill.unlocked ? colors.border : "border-border/40",
          skill.unlocked ? colors.bg : "bg-background/80",
          skill.unlocked ? colors.glow : "opacity-80 grayscale",
          isSelected ? "shadow-[0_0_0_2px_var(--primary)]" : "shadow-[2px_2px_0_var(--border)]"
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <p className={cn("retro text-[0.5rem] uppercase leading-tight tracking-[0.14em]", skill.unlocked ? "text-foreground" : "text-muted-foreground")}>{skill.name}</p>
            <p className={cn("retro mt-1 text-[0.38rem] uppercase tracking-[0.18em]", colors.text)}>{branchConfig[skill.branch].label}</p>
          </div>

          <div>
            <div className="h-1.5 w-full overflow-hidden bg-background/60">
              <div className={cn("h-full", colors.border.replace("border-", "bg-"))} style={{ width: `${skill.level}%` }} />
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="retro text-[0.4rem] uppercase tracking-[0.16em] text-muted-foreground">
                {skill.unlocked ? "Unlocked" : "Locked"}
              </span>
              <span className={cn("retro text-[0.45rem] uppercase tracking-[0.16em]", colors.text)}>{skill.level}%</span>
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

function SkillDetailsPanel({ skill }: { skill: SkillData }) {
  const colors = branchConfig[skill.branch];
  const prerequisites = skillsData.filter((entry) => skill.prerequisites?.includes(entry.id));

  return (
    <div className="min-w-0 space-y-4">
      <div className={cn("rounded-none border-2 bg-card/90 p-3 shadow-[4px_4px_0_var(--border)] sm:sticky sm:top-4 sm:p-4", colors.border)}>
        <div className="border-b-2 border-dashed border-border/50 pb-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="retro text-[0.5rem] uppercase tracking-[0.28em] text-muted-foreground">Selected Skill</p>
              <h3 className="retro mt-1 text-sm uppercase tracking-[0.18em] text-foreground sm:text-base">{skill.name}</h3>
            </div>
            <span className={cn("retro border px-2 py-1 text-[0.48rem] uppercase tracking-[0.2em]", colors.border, colors.bg, colors.text)}>
              {colors.label}
            </span>
          </div>
          <p className="retro mt-3 text-[0.58rem] leading-relaxed text-muted-foreground sm:text-[0.62rem]">{skill.description}</p>
        </div>

        <div className="mt-4 space-y-3">
          <MetricRow label="Mastery" value={`${skill.level}/${skill.maxLevel}`} tone={colors.text} />
          <MetricRow label="Status" value={skill.unlocked ? "Unlocked" : "Locked"} tone={skill.unlocked ? "text-green-500" : "text-muted-foreground"} />
          <MetricRow label="Experience" value={skill.yearsExperience ? `${skill.yearsExperience} years` : "In progress"} tone="text-foreground" />
        </div>

        <div className="mt-4 border-t-2 border-dashed border-border/50 pt-4">
          <p className="retro text-[0.48rem] uppercase tracking-[0.22em] text-muted-foreground">Progress</p>
          <div className="mt-2 h-2.5 w-full overflow-hidden border border-border/60 bg-background/60">
            <div className={cn("h-full", colors.border.replace("border-", "bg-"))} style={{ width: `${skill.level}%` }} />
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <div>
            <p className="retro text-[0.48rem] uppercase tracking-[0.22em] text-muted-foreground">Prerequisites</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {prerequisites.length > 0 ? (
                prerequisites.map((entry) => (
                  <span key={entry.id} className="retro border border-border/60 bg-background/60 px-2 py-1 text-[0.45rem] uppercase tracking-[0.16em] text-foreground">
                    {entry.name}
                  </span>
                ))
              ) : (
                <span className="retro text-[0.48rem] uppercase tracking-[0.16em] text-muted-foreground">Root node</span>
              )}
            </div>
          </div>

          <div>
            <p className="retro text-[0.48rem] uppercase tracking-[0.22em] text-muted-foreground">Projects</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {skill.projects && skill.projects.length > 0 ? (
                skill.projects.map((project) => (
                  <span key={project} className="retro border border-border/60 bg-background/60 px-2 py-1 text-[0.45rem] uppercase tracking-[0.16em] text-foreground">
                    {project}
                  </span>
                ))
              ) : (
                <span className="retro text-[0.48rem] uppercase tracking-[0.16em] text-muted-foreground">No linked project data</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-border/60 bg-background/60 px-3 py-2">
      <span className="retro text-[0.48rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <span className={cn("retro text-[0.55rem] uppercase tracking-[0.16em]", tone)}>{value}</span>
    </div>
  );
}

export default SkillTree;
