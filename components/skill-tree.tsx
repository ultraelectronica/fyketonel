"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkillNode {
  id: string;
  name: string;
  branch: "frontend" | "backend" | "devops" | "design" | "core";
  level: number; // 0-100 (percentage)
  maxLevel: 100;
  unlocked: boolean;
  prerequisites?: string[]; // IDs of skills that must be unlocked first
  description: string;
  projects?: string[]; // Projects where this skill was used
  yearsExperience?: number;
  position: { x: number; y: number }; // Position in grid
}

const skillsData: SkillNode[] = [
  // Core Skills (Root)
  {
    id: "programming-fundamentals",
    name: "Programming Fundamentals",
    branch: "core",
    level: 100,
    maxLevel: 100,
    unlocked: true,
    description: "Master of algorithms, data structures, and problem-solving.",
    yearsExperience: 5,
    position: { x: 2, y: 0 },
  },
  
  // Frontend Branch
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
    projects: ["Pasada", "LockerApp", "Portfolio"],
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
    projects: ["Pasada", "Portfolio"],
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
    projects: ["Pasada", "LockerApp", "Portfolio"],
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
    projects: ["Portfolio"],
    yearsExperience: 2,
    position: { x: 0, y: 5 },
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    branch: "frontend",
    level: 90,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["html-css"],
    description: "Utility-first CSS framework for rapid styling.",
    projects: ["Pasada", "Portfolio"],
    yearsExperience: 2,
    position: { x: 1, y: 2 },
  },
  
  // Backend Branch
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
    name: "Databases (SQL/NoSQL)",
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
    name: "REST API Design",
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
    name: "Authentication",
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
  
  // DevOps Branch
  {
    id: "git",
    name: "Git & GitHub",
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
    name: "Cloud Services",
    branch: "devops",
    level: 50,
    maxLevel: 100,
    unlocked: true,
    prerequisites: ["docker"],
    description: "AWS, Azure, or GCP infrastructure management.",
    yearsExperience: 1,
    position: { x: 1, y: 3 },
  },
  
  // Design Branch
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
    name: "UX Principles",
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
    name: "Accessibility",
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

const branchColors = {
  core: {
    border: "border-purple-500 dark:border-purple-400",
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]",
  },
  frontend: {
    border: "border-blue-500 dark:border-blue-400",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.4)]",
  },
  backend: {
    border: "border-green-500 dark:border-green-400",
    bg: "bg-green-500/10",
    text: "text-green-600 dark:text-green-400",
    glow: "shadow-[0_0_15px_rgba(34,197,94,0.4)]",
  },
  devops: {
    border: "border-orange-500 dark:border-orange-400",
    bg: "bg-orange-500/10",
    text: "text-orange-600 dark:text-orange-400",
    glow: "shadow-[0_0_15px_rgba(249,115,22,0.4)]",
  },
  design: {
    border: "border-pink-500 dark:border-pink-400",
    bg: "bg-pink-500/10",
    text: "text-pink-600 dark:text-pink-400",
    glow: "shadow-[0_0_15px_rgba(236,72,153,0.4)]",
  },
};

const NODE_SPACING_X = 150;
const NODE_SPACING_Y = 110;
const NODE_WIDTH = 110;
const NODE_HEIGHT = 80;

const maxX = Math.max(...skillsData.map((s) => s.position.x));
const maxY = Math.max(...skillsData.map((s) => s.position.y));
const canvasWidth = (maxX + 1) * NODE_SPACING_X + NODE_WIDTH;
const canvasHeight = (maxY + 1) * NODE_SPACING_Y + NODE_HEIGHT;

const branchProgress = Object.entries(branchColors).map(([branch, colors]) => {
  const branchSkills = skillsData.filter((skill) => skill.branch === branch);
  const total = branchSkills.reduce((sum, skill) => sum + skill.level, 0);
  const max = branchSkills.length * 100 || 1;
  const unlocked = branchSkills.filter((skill) => skill.unlocked).length;
  return {
    branch,
    percent: Math.round((total / max) * 100),
    unlocked,
    total: branchSkills.length,
    colors,
  };
});

export function SkillTree({ className }: { className?: string }) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const totalSkillPoints = skillsData.reduce((sum, skill) => sum + skill.level, 0);
  const maxSkillPoints = skillsData.reduce((sum, skill) => sum + skill.maxLevel, 0);
  const unlockedCount = skillsData.filter((s) => s.unlocked).length;

  return (
    <section className={cn("relative space-y-4 sm:space-y-5 md:space-y-6", className)}>
      {/* Header */}
      <div className="space-y-2 text-center sm:space-y-2.5 md:space-y-3">
        <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
          Character Development
        </p>
        <h2 className="retro text-lg uppercase tracking-[0.2em] sm:text-xl sm:tracking-[0.25em] md:text-2xl md:tracking-[0.3em]">
          Skill Tree
        </h2>

        {/* Stats Summary */}
        <div className="mx-auto inline-block rounded-none border-2 border-border bg-card/80 px-3 py-2 shadow-[1px_1px_0_var(--border)] backdrop-blur-sm dark:border-ring sm:border-3 sm:px-4 sm:py-2.5 sm:shadow-[2px_2px_0_var(--border)] md:px-5 md:py-3">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
            <div className="text-center">
              <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">
                Skill Points
              </p>
              <p className="retro text-sm font-bold tracking-[0.15em] text-primary sm:text-base md:text-lg">
                {totalSkillPoints} / {maxSkillPoints}
              </p>
            </div>
            <div className="text-center">
              <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">
                Unlocked
              </p>
              <p className="retro text-sm font-bold tracking-[0.15em] text-green-600 dark:text-green-400 sm:text-base md:text-lg">
                {unlockedCount} / {skillsData.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Branch Progress */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5 sm:gap-3">
        {branchProgress.map((branch) => (
          <div
            key={branch.branch}
            className={cn(
              "rounded-none border-2 px-3 py-2 shadow-[1px_1px_0_var(--border)] backdrop-blur-sm sm:border-3 sm:px-3 sm:py-2.5",
              branch.colors.border,
              branch.colors.bg
            )}
          >
            <p className={cn("retro text-[0.4rem] uppercase tracking-[0.15em] sm:text-[0.45rem]", branch.colors.text)}>
              {branch.branch}
            </p>
            <div className="mt-1 flex items-end justify-between">
              <p className={cn("retro text-base font-bold sm:text-lg", branch.colors.text)}>{branch.percent}%</p>
              <span className="retro text-[0.35rem] uppercase tracking-[0.1em] text-muted-foreground sm:text-[0.4rem]">
                {branch.unlocked}/{branch.total} unlocked
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full border border-border bg-background dark:border-ring">
              <div
                className={cn("h-full transition-all", branch.colors.border)}
                style={{ width: `${branch.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Skill Tree Grid */}
      <div className="relative mx-auto max-w-4xl overflow-x-auto rounded-none border-2 border-dashed border-border bg-background/40 p-4 backdrop-blur-sm dark:border-ring sm:border-3 sm:p-6 md:p-8">
        <div className="relative mx-auto" style={{ width: canvasWidth, height: canvasHeight }}>
          {/* Background Grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(0deg, rgba(148,163,184,0.2) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
            {skillsData.map((skill) =>
              skill.prerequisites?.map((prereqId) => {
                const prereq = skillsData.find((s) => s.id === prereqId);
                if (!prereq) return null;

                const x1 = prereq.position.x * NODE_SPACING_X + NODE_WIDTH / 2;
                const y1 = prereq.position.y * NODE_SPACING_Y + NODE_HEIGHT / 2;
                const x2 = skill.position.x * NODE_SPACING_X + NODE_WIDTH / 2;
                const y2 = skill.position.y * NODE_SPACING_Y + NODE_HEIGHT / 2;

                return (
                  <line
                    key={`${prereqId}-${skill.id}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={skill.unlocked ? "0" : "6,6"}
                    className={skill.unlocked ? "text-primary/50" : "text-border/30"}
                  />
                );
              })
            )}
          </svg>

          {/* Skill Nodes */}
          {skillsData.map((skill) => (
            <SkillNode
              key={skill.id}
              skill={skill}
              isSelected={selectedSkill === skill.id}
              isHovered={hoveredSkill === skill.id}
              onSelect={() => setSelectedSkill(selectedSkill === skill.id ? null : skill.id)}
              onHover={() => setHoveredSkill(skill.id)}
              onHoverEnd={() => setHoveredSkill(null)}
            />
          ))}
        </div>
      </div>

      {/* Selected Skill Details */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillDetails
            skill={skillsData.find((s) => s.id === selectedSkill)!}
            onClose={() => setSelectedSkill(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function SkillNode({
  skill,
  isSelected,
  onSelect,
  onHover,
  onHoverEnd,
}: {
  skill: SkillNode;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onHoverEnd: () => void;
}) {
  const colors = branchColors[skill.branch];

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${skill.position.x * NODE_SPACING_X}px`,
        top: `${skill.position.y * NODE_SPACING_Y}px`,
        width: `${NODE_WIDTH}px`,
        height: `${NODE_HEIGHT}px`,
      }}
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
    >
      <button
        onClick={onSelect}
        className={cn(
          "relative h-full w-full cursor-pointer rounded-none border-2 backdrop-blur-sm transition-all duration-200 sm:border-3",
          skill.unlocked ? colors.border : "border-border/40 dark:border-ring/40",
          skill.unlocked ? colors.bg : "bg-background/60",
          skill.unlocked
            ? "shadow-[1px_1px_0_var(--border)] hover:shadow-[3px_3px_0_var(--primary)] hover:-translate-y-1 sm:shadow-[2px_2px_0_var(--border)]"
            : "opacity-60 grayscale",
          isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
          skill.unlocked && colors.glow
        )}
      >
        {/* Locked Overlay */}
        {!skill.unlocked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
            <div className="relative flex flex-col items-center gap-0.5">
              {/* Retro lock */}
              <div className="relative">
                <div className="mx-auto h-2 w-3 rounded-t-full border-2 border-b-0 border-muted-foreground/40 sm:h-2.5 sm:w-3.5" />
                <div className="relative h-3 w-4 rounded-none border-2 border-muted-foreground/40 bg-muted/40 sm:h-3.5 sm:w-4.5">
                  <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/40 sm:h-1.5 sm:w-1.5" />
                    <div className="h-1 w-0.5 bg-muted-foreground/40 sm:h-1.5 sm:w-1" />
                  </div>
                </div>
              </div>
              <span className="retro text-[0.35rem] uppercase tracking-[0.1em] text-muted-foreground/80">
                Locked
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex h-full flex-col items-center justify-center gap-1 p-2">
          <p className={cn(
            "retro text-center text-[0.4rem] uppercase leading-tight tracking-[0.1em] sm:text-[0.45rem] md:text-[0.5rem]",
            skill.unlocked ? "text-foreground" : "text-muted-foreground/60"
          )}>
            {skill.name}
          </p>
          
          {skill.unlocked && (
            <>
              {/* Progress Bar */}
              <div className="w-full rounded-none border border-border bg-background dark:border-ring">
                <div
                  className={cn("h-1 transition-all", colors.bg, colors.border, "border-r")}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              
              {/* Level Text */}
              <p className={cn("retro text-[0.35rem] font-bold tracking-[0.1em] sm:text-[0.4rem]", colors.text)}>
                Lv. {skill.level}
              </p>
            </>
          )}
        </div>

        {/* Pulse effect for unlocked high-level skills */}
        {skill.unlocked && skill.level >= 80 && (
          <motion.div
            className={cn("absolute inset-0 rounded-none", colors.border)}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </button>
    </motion.div>
  );
}

function SkillDetails({ skill, onClose }: { skill: SkillNode; onClose: () => void }) {
  const colors = branchColors[skill.branch];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-none border-2 backdrop-blur-sm sm:border-3 md:border-4",
        colors.border,
        colors.bg,
        "shadow-[2px_2px_0_var(--border)] sm:shadow-[3px_3px_0_var(--border)] md:shadow-[4px_4px_0_var(--border)]"
      )}
    >
      <div className="relative p-3 sm:p-4 md:p-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-none border-2 border-border bg-background px-2 py-1 text-[0.4rem] uppercase tracking-[0.15em] transition-all hover:border-primary hover:bg-accent dark:border-ring sm:text-[0.45rem]"
        >
          ✕
        </button>

        <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
          {/* Header */}
          <div>
            <p className={cn("retro text-[0.4rem] uppercase tracking-[0.15em] sm:text-[0.45rem] md:text-[0.5rem]", colors.text)}>
              {skill.branch} skill
            </p>
            <h3 className="retro text-sm uppercase tracking-[0.15em] text-foreground sm:text-base md:text-lg">
              {skill.name}
            </h3>
          </div>

          {/* Description */}
          <p className="retro text-[0.45rem] leading-relaxed tracking-[0.1em] text-muted-foreground sm:text-[0.5rem] md:text-[0.55rem]">
            {skill.description}
          </p>

          {/* Level & Experience */}
          {skill.unlocked && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">
                  Mastery Level
                </span>
                <span className={cn("retro text-[0.4rem] font-bold tracking-[0.15em] sm:text-[0.45rem] md:text-[0.5rem]", colors.text)}>
                  {skill.level}%
                </span>
              </div>
              {skill.yearsExperience && (
                <p className="retro text-[0.4rem] tracking-[0.1em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">
                  ⏱️ {skill.yearsExperience} {skill.yearsExperience === 1 ? "year" : "years"} experience
                </p>
              )}
            </div>
          )}

          {/* Projects */}
          {skill.projects && skill.projects.length > 0 && (
            <div>
              <p className="retro mb-1 text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">
                Used in Projects:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skill.projects.map((project) => (
                  <span
                    key={project}
                    className={cn(
                      "retro rounded-none border px-2 py-0.5 text-[0.35rem] uppercase tracking-[0.1em] sm:text-[0.4rem]",
                      colors.border,
                      colors.text
                    )}
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {skill.prerequisites && skill.prerequisites.length > 0 && (
            <div>
              <p className="retro mb-1 text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">
                Prerequisites:
              </p>
              <div className="space-y-0.5">
                {skill.prerequisites.map((prereqId) => {
                  const prereq = skillsData.find((s) => s.id === prereqId);
                  return (
                    <p key={prereqId} className="retro text-[0.4rem] tracking-[0.1em] text-foreground sm:text-[0.45rem] md:text-[0.5rem]">
                      • {prereq?.name}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default SkillTree;

