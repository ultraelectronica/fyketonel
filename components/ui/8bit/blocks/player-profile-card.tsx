import React, { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/8bit/avatar";
import { Badge } from "@/components/ui/8bit/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/8bit/card";
import HealthBar from "@/components/ui/8bit/health-bar";
import ManaBar from "@/components/ui/8bit/mana-bar";
import { Progress } from "@/components/ui/8bit/progress";
import "@/components/ui/8bit/styles/retro.css";
import { motion, AnimatePresence } from "framer-motion";

export interface PlayerStats {
  health?: {
    current: number;
    max: number;
  };
  mana?: {
    current: number;
    max: number;
  };
  experience?: {
    current: number;
    max: number;
  };
  level?: number;
  [key: string]: unknown; // Allow custom stats
}

export interface PlayerProfileCardProps {
  className?: string;
  playerName: string;
  avatarSrc?: string;
  avatarFallback?: string;
  level?: number;
  stats?: PlayerStats;
  playerClass?: string;
  showLevel?: boolean;
  showHealth?: boolean;
  showMana?: boolean;
  showExperience?: boolean;
  customStats?: Array<{
    label: string;
    value: number;
    max?: number;
    color?: string;
    variant?: "retro" | "default";
  }>;
}

export default function PlayerProfileCard({
  className,
  playerName,
  avatarSrc,
  avatarFallback,
  level = 1,
  stats,
  playerClass,
  showLevel = true,
  showHealth = true,
  showMana = true,
  showExperience = true,
  customStats = [],
  ...props
}: PlayerProfileCardProps) {
  const healthPercentage = stats?.health
    ? Math.round((stats.health.current / stats.health.max) * 100)
    : 0;

  const manaPercentage = stats?.mana
    ? Math.round((stats.mana.current / stats.mana.max) * 100)
    : 0;

  const experiencePercentage = stats?.experience
    ? Math.round((stats.experience.current / stats.experience.max) * 100)
    : 0;

  const xpToNextLevel = stats?.experience
    ? stats.experience.max - stats.experience.current
    : null;

  const battleMetrics = useMemo(() => {
    const vitality = Math.round((healthPercentage + manaPercentage) / 2);
    return [
      {
        label: "Battle Sync",
        value: `${vitality}%`,
        tone: vitality > 70 ? "text-green-500" : vitality > 40 ? "text-yellow-400" : "text-red-500",
      },
      {
        label: "Focus",
        value: `${Math.min(99, level * 2 + (stats?.mana?.current || 0) % 30)}%`,
        tone: "text-sky-400",
      },
      {
        label: "Chaos Tolerance",
        value: `${Math.min(100, level + (stats?.health?.max || 0) / 2)}%`,
        tone: "text-purple-400",
      },
    ];
  }, [healthPercentage, manaPercentage, level, stats?.mana?.current, stats?.health?.max]);

  const statusEffects = useMemo(() => {
    const effects = [
      "⚡ Focus Buff Active",
      "🛡️ Guardian Protocols Online",
      "🎯 Crit Chance +15%",
      "☕ Coffee Aura Sustained",
    ];

    if (playerClass) {
      effects.push(`💠 ${playerClass} Resonance`);
    }

    if (stats?.mana && stats.mana.current < stats.mana.max * 0.3) {
      effects.push("⚠️ Mana Flux Warning");
    }

    return effects;
  }, [playerClass, stats?.mana]);

  const [activeEffectIndex, setActiveEffectIndex] = useState(0);

  useEffect(() => {
    if (statusEffects.length === 0) return;
    const interval = setInterval(() => {
      setActiveEffectIndex((prev) => (prev + 1) % statusEffects.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [statusEffects.length]);

  const activeEffect = statusEffects[activeEffectIndex] ?? "Systems Stable";

  return (
    <motion.div
      className="w-full"
      initial={{ rotateX: 0, rotateY: 0, scale: 1 }}
      whileHover={{ rotateX: -2, rotateY: 2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <Card
        className={cn(
          "relative w-full max-w-md overflow-hidden border-4 border-border bg-card/90 shadow-[6px_6px_0_var(--border)]",
          className
        )}
        {...props}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.15),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.15),transparent_35%)]" />
        <div className="pointer-events-none absolute inset-0 border border-dashed border-border/40" />

      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <motion.div
            className="relative"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute -inset-1 rounded-full bg-primary/30 blur-md" />
            <Avatar className="size-16 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.35)]" variant="pixel" font="retro">
              <AvatarImage src={avatarSrc} alt={playerName} />
              <AvatarFallback className="text-lg">
                {avatarFallback || playerName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <div className="flex-1 min-w-0 relative">
            <div className="space-y-2 relative z-10">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2 justify-between">
                <h3 className="font-bold truncate md:text-lg">{playerName}</h3>
                {showLevel && (
                  <span>
                    <Badge className="text-xs shadow-[2px_2px_0_var(--border)]">
                      Lv.{level}
                    </Badge>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground retro">
                {playerClass && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-base">⚔️</span>
                    {playerClass}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 blur-xl" />
          </div>
        </div>
      </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* Status ticker */}
          <div className="rounded-none border-2 border-dashed border-border/60 bg-background/70 px-3 py-2 shadow-[2px_2px_0_var(--border)]">
            <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground retro">
              <span>Status Feed</span>
              {xpToNextLevel !== null && (
                <span>+{xpToNextLevel} XP → Lv.{level + 1}</span>
              )}
            </div>
            <div className="mt-1 min-h-[1.25rem] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeEffect}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="retro text-[0.65rem] tracking-[0.15em] text-primary"
                >
                  {activeEffect}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

        {/* Health Bar */}
        {showHealth && stats?.health && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Health</span>
              <span className="text-[9px] sm:text-xs text-muted-foreground retro">
                {stats.health.current}/{stats.health.max}
              </span>
            </div>
            <HealthBar
              value={healthPercentage}
              variant="retro"
              className="h-3"
            />
          </div>
        )}

        {/* Mana Bar */}
        {showMana && stats?.mana && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Mana</span>
              <span className="text-[9px] sm:text-xs text-muted-foreground retro">
                {stats.mana.current}/{stats.mana.max}
              </span>
            </div>
            <ManaBar value={manaPercentage} variant="retro" className="h-3" />
          </div>
        )}

        {/* Experience Bar */}
        {showExperience && stats?.experience && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Experience</span>
              <span className="text-[9px] sm:text-xs text-muted-foreground retro">
                {stats.experience.current}/{stats.experience.max} XP
              </span>
            </div>
            <Progress
              value={experiencePercentage}
              variant="retro"
              progressBg="bg-yellow-600"
              className="h-3"
            />
          </div>
        )}

        {/* Custom Stats */}
        {customStats.length > 0 && (
          <div className="space-y-2">
            {customStats.map((stat, index) => {
              const percentage = stat.max
                ? Math.round((stat.value / stat.max) * 100)
                : 0;

              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{stat.label}</span>
                    <span className="text-[9px] sm:text-xs text-muted-foreground retro">
                      {stat.value}
                      {stat.max ? `/${stat.max}` : ""}
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    variant={stat.variant || "retro"}
                    progressBg={stat.color || "bg-primary"}
                    className="h-3"
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Combat telemetry */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {battleMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-none border border-border bg-card/70 px-3 py-2 text-center shadow-[2px_2px_0_var(--border)]"
            >
              <p className="retro text-[0.45rem] uppercase tracking-[0.2em] text-muted-foreground">
                {metric.label}
              </p>
              <p className={cn("retro text-base tracking-[0.1em]", metric.tone)}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        {/* Retro scanlines overlay */}
        <div className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(transparent,transparent_6px,rgba(0,0,0,0.05)_7px)] opacity-70" />
      </CardContent>
      </Card>
    </motion.div>
  );
}
