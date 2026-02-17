"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { steps } from "@/components/ui/8bit/motion-utils";

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
    name: "Prog. Fundamentals",
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
  
  // DevOps Branch
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

// COMPACTED DIMENSIONS
const NODE_SPACING_X = 100;
const NODE_SPACING_Y = 80;
const NODE_WIDTH = 90;
const NODE_HEIGHT = 65;

const maxX = Math.max(...skillsData.map((s) => s.position.x));
const maxY = Math.max(...skillsData.map((s) => s.position.y));
const canvasWidth = (maxX + 1) * NODE_SPACING_X + 20; // Reduced padding
const canvasHeight = (maxY + 1) * NODE_SPACING_Y + 20;

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
    <section className={cn("relative rounded-none border-2 border-border bg-card shadow-[4px_4px_0_var(--border)] overflow-hidden", className)}>
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-border bg-muted/30 px-3 py-2">
            <h2 className="retro text-xs uppercase tracking-[0.2em] text-primary">Skill Tree</h2>
            <div className="flex gap-3">
                <div className="flex items-center gap-1.5">
                    <span className="retro text-[0.5rem] text-muted-foreground uppercase">Points</span>
                    <span className="retro text-[0.5rem] font-bold text-foreground">
                        {totalSkillPoints}/{maxSkillPoints}
                    </span>
                </div>
                 <div className="flex items-center gap-1.5">
                    <span className="retro text-[0.5rem] text-muted-foreground uppercase">Unlocked</span>
                    <span className="retro text-[0.5rem] font-bold text-green-600">
                        {unlockedCount} / {skillsData.length}
                    </span>
                 </div>
            </div>
        </div>

      {/* Branch Progress - Compact Strip */}
      <div className="flex border-b-2 border-border overflow-x-auto no-scrollbar">
        {branchProgress.map((branch) => (
          <div
            key={branch.branch}
            className={cn(
              "flex-1 min-w-[80px] px-2 py-1.5 border-r border-border/50 text-center",
              branch.colors.bg
            )}
          >
            <p className={cn("retro text-[0.35rem] uppercase tracking-[0.1em]", branch.colors.text)}>
              {branch.branch}
            </p>
            <div className="mt-0.5 h-1 w-full bg-background/50 rounded-full overflow-hidden">
                <div 
                    className={cn("h-full", branch.colors.border.replace("border-", "bg-"))} 
                    style={{ width: `${branch.percent}%` }}
                />
            </div>
          </div>
        ))}
      </div>

      {/* Skill Tree Grid Container */}
      <div className="relative w-full overflow-auto bg-background/40 p-4 min-h-[300px]">
        
        {/* Canvas */}
        <div className="relative mx-auto" style={{ width: canvasWidth, height: canvasHeight }}>
          {/* Background Grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(0deg, currentColor 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ width: "100%", height: "100%" }}>
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
                    strokeDasharray={skill.unlocked ? "0" : "4,4"}
                    className={skill.unlocked ? "text-primary/40" : "text-border/40"}
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

      {/* Selected Skill Details Overlay - Bottom anchored */}
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
      whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.1, ease: steps(2) } }}
      transition={{ duration: 0.2, ease: steps(2) }}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
    >
      <button
        onClick={onSelect}
        className={cn(
          "relative h-full w-full cursor-pointer rounded-none border-2 backdrop-blur-sm transition-none",
          skill.unlocked ? colors.border : "border-border/40 dark:border-ring/40",
          skill.unlocked ? colors.bg : "bg-background/80",
          skill.unlocked
            ? "shadow-[1px_1px_0_var(--border)] hover:shadow-[2px_2px_0_var(--primary)]"
            : "opacity-80 grayscale",
          isSelected && "ring-2 ring-primary ring-offset-1 ring-offset-background",
          skill.unlocked && colors.glow
        )}
      >
        {/* Content */}
        <div className="flex h-full flex-col items-center justify-center gap-0.5 p-1">
          <p className={cn(
            "retro text-center text-[0.4rem] uppercase leading-tight tracking-[0.05em]",
            skill.unlocked ? "text-foreground" : "text-muted-foreground/60"
          )}>
            {skill.name}
          </p>
          
          {skill.unlocked && (
            <>
              <div className="w-full px-2 mt-1">
                 <div className="h-0.5 w-full bg-background/50">
                    <div 
                        className={cn("h-full", colors.border.replace("border-", "bg-"))}
                        style={{ width: `${skill.level}%` }}
                    />
                 </div>
              </div>
              <p className={cn("retro text-[0.3rem] font-bold mt-0.5", colors.text)}>
                Lv.{skill.level}
              </p>
            </>
          )}
          {!skill.unlocked && (
               <span className="retro text-[0.3rem] uppercase text-muted-foreground">Locked</span>
          )}
        </div>
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
      transition={{ duration: 0.2, ease: steps(4) }}
      className={cn(
        "absolute bottom-0 left-0 right-0 z-10 border-t-2 bg-card/95 p-3 shadow-negative backdrop-blur-sm",
        colors.border
      )}
    >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-[0.6rem] text-muted-foreground hover:text-foreground p-1"
        >
          ✕ CLOSE
        </button>

        <div className="flex gap-3">
             <div className={cn("w-1 self-stretch", colors.border.replace("border-", "bg-"))} />
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="retro text-sm uppercase tracking-wider text-foreground">
                    {skill.name}
                    </h3>
                    <span className={cn(
                        "retro text-[0.35rem] px-1.5 py-0.5 border uppercase",
                        colors.border, colors.text
                    )}>
                        {skill.branch}
                    </span>
                </div>
                
                <p className="retro text-[0.5rem] text-muted-foreground leading-relaxed max-w-[90%]">
                    {skill.description}
                </p>

                 {/* Projects */}
                 {skill.projects && skill.projects.length > 0 && (
                    <div className="mt-2 flex gap-1">
                        {skill.projects.map((p) => (
                           <span key={p} className="retro text-[0.35rem] px-1 py-0.5 bg-muted/50 text-muted-foreground border border-border/50">
                                {p}
                           </span>
                        ))}
                    </div>
                )}
             </div>
        </div>
    </motion.div>
  );
}

export default SkillTree;

