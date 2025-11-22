"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "react-responsive";

interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  pixelArt: React.ReactNode;
  slot: "head" | "hands" | "weapon" | "accessory" | "tool";
  stats: {
    label: string;
    value: number;
    type: "positive" | "negative";
  }[];
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  description: string;
  equipped: boolean;
}

// Pixelated item components
const HeadphonesPixel = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      {/* Headband */}
      <div className="mx-auto h-1 w-8 bg-foreground sm:h-1.5 sm:w-10 md:h-2 md:w-12" />
      <div className="flex gap-4 sm:gap-5 md:gap-6">
        {/* Left cup */}
        <div className="h-5 w-5 border-2 border-foreground bg-primary sm:h-6 sm:w-6 sm:border-3 md:h-7 md:w-7 md:border-4" />
        {/* Right cup */}
        <div className="h-5 w-5 border-2 border-foreground bg-primary sm:h-6 sm:w-6 sm:border-3 md:h-7 md:w-7 md:border-4" />
      </div>
    </div>
  </div>
);

const KeyboardPixel = () => (
  <div className="flex flex-col gap-0.5 sm:gap-1">
    {[...Array(3)].map((_, row) => (
      <div key={row} className="flex gap-0.5 sm:gap-1">
        {[...Array(6)].map((_, col) => (
          <div key={col} className="h-1.5 w-1.5 border border-foreground bg-muted sm:h-2 sm:w-2 md:h-2.5 md:w-2.5" />
        ))}
      </div>
    ))}
  </div>
);

const MousePixel = () => (
  <div className="flex flex-col items-center gap-0.5">
    {/* Mouse body */}
    <div className="relative h-7 w-5 border-2 border-foreground bg-muted sm:h-8 sm:w-6 sm:border-3 md:h-10 md:w-7 md:border-4">
      {/* Scroll wheel */}
      <div className="absolute left-1/2 top-1 h-2 w-1.5 -translate-x-1/2 border border-foreground bg-primary sm:h-2.5 sm:w-2 md:h-3 md:w-2.5" />
      {/* Left/right click divider */}
      <div className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-foreground sm:h-5 md:h-6" />
    </div>
  </div>
);

const BookPixel = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      {/* Book cover */}
      <div className="h-8 w-6 border-2 border-foreground bg-amber-600 dark:bg-amber-700 sm:h-10 sm:w-7 sm:border-3 md:h-12 md:w-8 md:border-4">
        {/* Book lines */}
        <div className="absolute left-1 right-1 top-2 h-0.5 bg-foreground/50 sm:top-2.5" />
        <div className="absolute left-1 right-1 top-3.5 h-0.5 bg-foreground/50 sm:top-4" />
        <div className="absolute left-1 right-1 top-5 h-0.5 bg-foreground/50 sm:top-5.5" />
      </div>
      {/* Book spine */}
      <div className="absolute -left-0.5 top-0 bottom-0 w-1 bg-amber-800 dark:bg-amber-900 sm:-left-1 sm:w-1.5" />
    </div>
  </div>
);

const CoffeeMugPixel = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      {/* Steam */}
      <div className="absolute -top-2 left-1/2 flex -translate-x-1/2 gap-0.5 sm:-top-3">
        <div className="h-1.5 w-0.5 bg-muted-foreground/50 sm:h-2 sm:w-1" />
        <div className="h-2 w-0.5 bg-muted-foreground/50 sm:h-2.5 sm:w-1" />
        <div className="h-1.5 w-0.5 bg-muted-foreground/50 sm:h-2 sm:w-1" />
      </div>
      {/* Mug body */}
      <div className="h-6 w-5 border-2 border-foreground bg-amber-100 dark:bg-amber-950 sm:h-7 sm:w-6 sm:border-3 md:h-8 md:w-7 md:border-4">
        {/* Coffee inside */}
        <div className="absolute bottom-0.5 left-0.5 right-0.5 h-3 bg-amber-800 dark:bg-amber-900 sm:h-3.5 md:h-4" />
      </div>
      {/* Handle */}
      <div className="absolute -right-1 top-1 h-4 w-2 rounded-r-full border-2 border-l-0 border-foreground sm:-right-1.5 sm:h-5 sm:w-2.5 sm:border-3 md:-right-2 md:h-6 md:w-3 md:border-4" />
    </div>
  </div>
);

const DuckPixel = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      {/* Duck body */}
      <div className="h-6 w-7 border-2 border-foreground bg-yellow-400 dark:bg-yellow-500 sm:h-7 sm:w-8 sm:border-3 md:h-8 md:w-9 md:border-4" />
      {/* Duck head */}
      <div className="absolute -top-2 left-1 h-3 w-4 border-2 border-foreground bg-yellow-400 dark:bg-yellow-500 sm:-top-2.5 sm:h-4 sm:w-5 sm:border-3 md:-top-3 md:h-5 md:w-6 md:border-4">
        {/* Eye */}
        <div className="absolute right-1 top-1 h-1 w-1 bg-foreground sm:h-1.5 sm:w-1.5" />
      </div>
      {/* Beak */}
      <div className="absolute -top-1 right-0 h-1 w-1.5 bg-orange-500 sm:h-1.5 sm:w-2 md:h-2 md:w-2.5" />
    </div>
  </div>
);

const inventoryItems: InventoryItem[] = [
  {
    id: "headphones",
    name: "Headphones of Focus",
    icon: "🎧",
    pixelArt: <HeadphonesPixel />,
    slot: "head",
    stats: [
      { label: "Concentration", value: 10, type: "positive" },
      { label: "Noise Resistance", value: 25, type: "positive" },
    ],
    rarity: "rare",
    description: "Legendary gear that blocks out all distractions and summons the coding flow state.",
    equipped: true,
  },
  {
    id: "keyboard",
    name: "Mechanical Keyboard of Typing",
    icon: "⌨️",
    pixelArt: <KeyboardPixel />,
    slot: "weapon",
    stats: [
      { label: "Typing Speed", value: 15, type: "positive" },
      { label: "Code Quality", value: 8, type: "positive" },
    ],
    rarity: "epic",
    description: "Each keystroke resonates with the power of a thousand commits.",
    equipped: true,
  },
  {
    id: "mouse",
    name: "Mouse of Precision",
    icon: "🖱️",
    pixelArt: <MousePixel />,
    slot: "weapon",
    stats: [
      { label: "Accuracy", value: 20, type: "positive" },
      { label: "Click Speed", value: 12, type: "positive" },
    ],
    rarity: "rare",
    description: "Grants pixel-perfect precision for UI adjustments and bug hunting.",
    equipped: true,
  },
  {
    id: "documentation",
    name: "Tome of Documentation",
    icon: "📚",
    pixelArt: <BookPixel />,
    slot: "accessory",
    stats: [
      { label: "Confusion", value: -5, type: "negative" },
      { label: "Knowledge", value: 30, type: "positive" },
      { label: "Stack Overflow Dependency", value: -15, type: "negative" },
    ],
    rarity: "legendary",
    description: "Ancient wisdom contained within. Reading it reduces confusion but takes time.",
    equipped: true,
  },
  {
    id: "coffee-mug",
    name: "Enchanted Coffee Mug",
    icon: "☕",
    pixelArt: <CoffeeMugPixel />,
    slot: "accessory",
    stats: [
      { label: "Energy", value: 50, type: "positive" },
      { label: "Sleep Quality", value: -10, type: "negative" },
    ],
    rarity: "epic",
    description: "Bottomless container of liquid productivity. Side effects may include night coding.",
    equipped: true,
  },
  {
    id: "rubber-duck",
    name: "Rubber Duck of Debugging",
    icon: "🦆",
    pixelArt: <DuckPixel />,
    slot: "tool",
    stats: [
      { label: "Problem Solving", value: 35, type: "positive" },
      { label: "Ego", value: -20, type: "negative" },
    ],
    rarity: "legendary",
    description: "The wisest debugging companion. Explains your code back to you, revealing all bugs.",
    equipped: true,
  },
];

const emptySlots = 3; // Number of empty inventory slots to show

export function InventorySystem({ className }: { className?: string }) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const totalStats = inventoryItems
    .filter((item) => item.equipped)
    .reduce(
      (acc, item) => {
        item.stats.forEach((stat) => {
          if (!acc[stat.label]) {
            acc[stat.label] = 0;
          }
          acc[stat.label] += stat.value;
        });
        return acc;
      },
      {} as Record<string, number>
    );

  return (
    <section className={cn("relative space-y-4 sm:space-y-5 md:space-y-6", className)}>
      {/* Header */}
      <div className="space-y-2 text-center sm:space-y-2.5 md:space-y-3">
        <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
          Character Equipment
        </p>
        <h2 className="retro text-lg uppercase tracking-[0.2em] sm:text-xl sm:tracking-[0.25em] md:text-2xl md:tracking-[0.3em]">
          Inventory System
        </h2>

        {/* Total Stats Panel */}
        <div className="mx-auto inline-block rounded-none border-2 border-border bg-card/80 px-3 py-2 shadow-[1px_1px_0_var(--border)] backdrop-blur-sm dark:border-ring sm:border-3 sm:px-4 sm:py-2.5 sm:shadow-[2px_2px_0_var(--border)] md:px-5 md:py-3">
          <p className="retro mb-1.5 text-[0.45rem] uppercase tracking-[0.2em] text-muted-foreground sm:mb-2 sm:text-[0.5rem] sm:tracking-[0.25em] md:text-[0.6rem]">
            Total Stats
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-1 md:gap-x-5 md:gap-y-1.5">
            {Object.entries(totalStats).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-1.5 sm:gap-2">
                <span className="retro text-[0.4rem] uppercase tracking-[0.12em] text-foreground sm:text-[0.45rem] sm:tracking-[0.15em] md:text-[0.5rem] md:tracking-[0.18em]">
                  {label}:
                </span>
                <span
                  className={cn(
                    "retro text-[0.4rem] font-bold tracking-[0.12em] sm:text-[0.45rem] sm:tracking-[0.15em] md:text-[0.5rem] md:tracking-[0.18em]",
                    value >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}
                >
                  {value >= 0 ? "+" : ""}
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="mx-auto grid max-w-2xl grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {inventoryItems.map((item) => (
          <InventorySlot
            key={item.id}
            item={item}
            isHovered={hoveredItem === item.id}
            onHoverStart={() => setHoveredItem(item.id)}
            onHoverEnd={() => setHoveredItem(null)}
            isSelected={selectedItem === item.id}
            onSelect={() =>
              setSelectedItem((prev) => (prev === item.id ? null : item.id))
            }
            isMobile={isMobile}
          />
        ))}
        {/* Empty slots */}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <EmptySlot key={`empty-${index}`} />
        ))}
      </div>

      <AnimatePresence>
        {isMobile && selectedItem && (
          <motion.div
            key="mobile-item-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="rounded-none border-2 border-border bg-card/90 p-3 shadow-[2px_2px_0_var(--border)] backdrop-blur-md dark:border-ring sm:border-3 sm:p-4"
          >
            {(() => {
              const item = inventoryItems.find((i) => i.id === selectedItem);
              if (!item) return null;
              return (
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="retro text-sm uppercase tracking-[0.18em] text-foreground">
                        {item.name}
                      </p>
                      <p className="retro text-[0.5rem] uppercase tracking-[0.15em] text-muted-foreground">
                        {item.slot} slot · {item.rarity}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      className="retro rounded-sm border border-border px-2 py-0.5 text-[0.45rem] uppercase tracking-[0.15em] text-muted-foreground hover:border-primary hover:bg-primary/10 dark:border-ring"
                    >
                      Close
                    </button>
                  </div>
                  <div className="rounded-none border border-border/60 bg-background/80 p-2 dark:border-ring/60">
                    <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground">
                      Buffs & Effects
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {item.stats.map((stat) => (
                        <p
                          key={stat.label}
                          className={cn(
                            "retro text-[0.45rem] tracking-[0.12em]",
                            stat.type === "positive"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          )}
                        >
                          {stat.label}: {stat.value >= 0 ? "+" : ""}
                          {stat.value}
                        </p>
                      ))}
                    </div>
                  </div>
                  <p className="retro text-[0.45rem] leading-relaxed tracking-[0.12em] text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function InventorySlot({
  item,
  isHovered,
  onHoverStart,
  onHoverEnd,
  isSelected,
  onSelect,
  isMobile,
}: {
  item: InventoryItem;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  isSelected: boolean;
  onSelect: () => void;
  isMobile: boolean;
}) {
  const rarityColors = {
    common: "border-gray-500 dark:border-gray-400",
    uncommon: "border-green-500 dark:border-green-400",
    rare: "border-blue-500 dark:border-blue-400",
    epic: "border-purple-500 dark:border-purple-400",
    legendary: "border-amber-500 dark:border-amber-400",
  };

  const rarityGlow = {
    common: "shadow-[0_0_10px_rgba(107,114,128,0.3)]",
    uncommon: "shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    rare: "shadow-[0_0_15px_rgba(59,130,246,0.4)]",
    epic: "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
    legendary: "shadow-[0_0_25px_rgba(245,158,11,0.6)]",
  };

  const rarityBg = {
    common: "bg-gradient-to-br from-card/80 to-gray-500/10",
    uncommon: "bg-gradient-to-br from-card/80 to-green-500/10",
    rare: "bg-gradient-to-br from-card/80 to-blue-500/10",
    epic: "bg-gradient-to-br from-card/80 to-purple-500/10",
    legendary: "bg-gradient-to-br from-card/80 to-amber-500/10",
  };

  const shouldShowTooltip = !isMobile && isHovered;

  return (
    <motion.div
      className="group relative"
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      {/* Item Card */}
      <div
        className={cn(
          "relative aspect-square cursor-pointer rounded-none border-2 backdrop-blur-sm transition-all duration-200 sm:border-3 md:border-3",
          rarityColors[item.rarity],
          rarityBg[item.rarity],
          "shadow-[1px_1px_0_var(--border)] hover:bg-accent/30 hover:border-primary hover:shadow-[3px_3px_0_var(--primary)] sm:hover:shadow-[4px_4px_0_var(--primary)] hover:-translate-y-1 sm:shadow-[2px_2px_0_var(--border)]",
          rarityGlow[item.rarity]
        )}
        onClick={() => {
          if (isMobile) {
            onSelect();
          }
        }}
        style={{
          transform: isSelected ? "scale(1.03)" : undefined,
          boxShadow: isSelected ? "0 0 0 2px var(--primary)" : undefined,
        }}
      >
        {/* Equipped badge */}
        {item.equipped && (
          <div className="absolute -right-0.5 -top-0.5 z-10 rounded-none border-2 border-border bg-primary px-1 py-0.5 shadow-[1px_1px_0_var(--border)] dark:border-ring sm:px-1.5 sm:py-0.5">
            <span className="retro text-[0.3rem] uppercase tracking-[0.1em] text-primary-foreground sm:text-[0.35rem] md:text-[0.4rem]">
              E
            </span>
          </div>
        )}

        {/* Item Icon */}
        <div className="flex h-full items-center justify-center p-2 sm:p-3 md:p-4">
          <motion.div
            className="flex items-center justify-center"
            animate={
              isHovered
                ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1.1, 1.1, 1.1, 1] }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            {item.pixelArt}
          </motion.div>
        </div>

        {/* Rarity indicator bars (corner decoration) */}
        <div className="pointer-events-none absolute left-0.5 top-0.5 flex gap-0.5 sm:left-1 sm:top-1">
          {Array.from({ length: Object.keys(rarityColors).indexOf(item.rarity) + 1 }).map((_, i) => (
            <div
              key={i}
              className={cn("h-0.5 w-0.5 sm:h-1 sm:w-1 md:h-1.5 md:w-1.5", rarityColors[item.rarity].replace("border-", "bg-"))}
            />
          ))}
        </div>

        {/* Shine effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {shouldShowTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 sm:w-64 md:w-72"
          >
            <div className="rounded-none border-2 border-border bg-card/95 p-2.5 shadow-[3px_3px_0_var(--border)] backdrop-blur-md dark:border-ring sm:border-3 sm:p-3 md:p-3.5">
              {/* Item name with rarity */}
              <div className="mb-2 space-y-1">
                <h3 className="retro text-[0.55rem] uppercase leading-tight tracking-[0.15em] text-foreground sm:text-xs sm:tracking-[0.18em] md:text-sm md:tracking-[0.2em]">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "retro rounded-none border-2 px-1.5 py-0.5 text-[0.4rem] uppercase tracking-[0.15em] sm:text-[0.45rem] md:text-[0.5rem]",
                      item.rarity === "common" &&
                        "border-gray-500 bg-gray-500/10 text-gray-600 dark:text-gray-400",
                      item.rarity === "uncommon" &&
                        "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400",
                      item.rarity === "rare" &&
                        "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400",
                      item.rarity === "epic" &&
                        "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400",
                      item.rarity === "legendary" &&
                        "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    )}
                  >
                    {item.rarity}
                  </span>
                  <span className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">
                    {item.slot}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="my-2 border-t-2 border-dashed border-border dark:border-ring" />

              {/* Stats */}
              <div className="mb-2 space-y-1">
                {item.stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="retro text-[0.45rem] uppercase tracking-[0.15em] text-foreground sm:text-[0.5rem] md:text-[0.55rem]">
                      {stat.label}
                    </span>
                    <span
                      className={cn(
                        "retro text-[0.45rem] font-bold tracking-[0.15em] sm:text-[0.5rem] md:text-[0.55rem]",
                        stat.type === "positive"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {stat.value >= 0 ? "+" : ""}
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="my-2 border-t-2 border-dashed border-border dark:border-ring" />

              {/* Description */}
              <p className="retro text-[0.4rem] leading-relaxed tracking-[0.1em] text-muted-foreground sm:text-[0.45rem] sm:tracking-[0.12em] md:text-[0.5rem] md:tracking-[0.15em]">
                {item.description}
              </p>
            </div>
            {/* Tooltip arrow */}
            <div className="mx-auto h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-border dark:border-t-ring" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EmptySlot() {
  return (
    <div className="relative aspect-square rounded-none border-2 border-dashed border-border/40 bg-background/40 shadow-[1px_1px_0_var(--border)] backdrop-blur-sm dark:border-ring/40 sm:border-3 sm:shadow-[2px_2px_0_var(--border)]">
      <div className="flex h-full items-center justify-center">
        <span className="text-2xl opacity-20 sm:text-3xl md:text-4xl">∅</span>
      </div>
    </div>
  );
}

export default InventorySystem;

