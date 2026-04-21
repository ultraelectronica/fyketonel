"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  pixelArt: ReactNode;
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

const rarityConfig: Record<InventoryItem["rarity"], { border: string; bg: string; glow: string; label: string }> = {
  common: {
    border: "border-gray-500 dark:border-gray-400",
    bg: "bg-gray-500/10",
    glow: "shadow-gray-500/30",
    label: "COMMON",
  },
  uncommon: {
    border: "border-green-500 dark:border-green-400",
    bg: "bg-green-500/10",
    glow: "shadow-green-500/30",
    label: "UNCOMMON",
  },
  rare: {
    border: "border-blue-500 dark:border-blue-400",
    bg: "bg-blue-500/10",
    glow: "shadow-blue-500/30",
    label: "RARE",
  },
  epic: {
    border: "border-purple-500 dark:border-purple-400",
    bg: "bg-purple-500/10",
    glow: "shadow-purple-500/30",
    label: "EPIC",
  },
  legendary: {
    border: "border-amber-500 dark:border-amber-400",
    bg: "bg-amber-500/10",
    glow: "shadow-amber-500/30",
    label: "LEGENDARY",
  },
};

const slotLabels: Record<InventoryItem["slot"], string> = {
  head: "Head",
  hands: "Hands",
  weapon: "Weapon",
  accessory: "Accessory",
  tool: "Tool",
};

const HeadphonesPixel = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="mx-auto h-1 w-8 bg-foreground sm:h-1.5 sm:w-10 md:h-2 md:w-12" />
      <div className="flex gap-4 sm:gap-5 md:gap-6">
        <div className="h-5 w-5 border-2 border-foreground bg-primary sm:h-6 sm:w-6 sm:border-3 md:h-7 md:w-7 md:border-4" />
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
    <div className="relative h-7 w-5 border-2 border-foreground bg-muted sm:h-8 sm:w-6 sm:border-3 md:h-10 md:w-7 md:border-4">
      <div className="absolute left-1/2 top-1 h-2 w-1.5 -translate-x-1/2 border border-foreground bg-primary sm:h-2.5 sm:w-2 md:h-3 md:w-2.5" />
      <div className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-foreground sm:h-5 md:h-6" />
    </div>
  </div>
);

const BookPixel = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="h-8 w-6 border-2 border-foreground bg-amber-600 dark:bg-amber-700 sm:h-10 sm:w-7 sm:border-3 md:h-12 md:w-8 md:border-4">
        <div className="absolute left-1 right-1 top-2 h-0.5 bg-foreground/50 sm:top-2.5" />
        <div className="absolute left-1 right-1 top-3.5 h-0.5 bg-foreground/50 sm:top-4" />
        <div className="absolute left-1 right-1 top-5 h-0.5 bg-foreground/50 sm:top-5.5" />
      </div>
      <div className="absolute bottom-0 top-0 -left-0.5 w-1 bg-amber-800 dark:bg-amber-900 sm:-left-1 sm:w-1.5" />
    </div>
  </div>
);

const CoffeeMugPixel = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="absolute -top-2 left-1/2 flex -translate-x-1/2 gap-0.5 sm:-top-3">
        <div className="h-1.5 w-0.5 bg-muted-foreground/50 sm:h-2 sm:w-1" />
        <div className="h-2 w-0.5 bg-muted-foreground/50 sm:h-2.5 sm:w-1" />
        <div className="h-1.5 w-0.5 bg-muted-foreground/50 sm:h-2 sm:w-1" />
      </div>
      <div className="h-6 w-5 border-2 border-foreground bg-amber-100 dark:bg-amber-950 sm:h-7 sm:w-6 sm:border-3 md:h-8 md:w-7 md:border-4">
        <div className="absolute bottom-0.5 left-0.5 right-0.5 h-3 bg-amber-800 dark:bg-amber-900 sm:h-3.5 md:h-4" />
      </div>
      <div className="absolute -right-1 top-1 h-4 w-2 rounded-r-full border-2 border-l-0 border-foreground sm:-right-1.5 sm:h-5 sm:w-2.5 sm:border-3 md:-right-2 md:h-6 md:w-3 md:border-4" />
    </div>
  </div>
);

const DuckPixel = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="h-6 w-7 border-2 border-foreground bg-yellow-400 dark:bg-yellow-500 sm:h-7 sm:w-8 sm:border-3 md:h-8 md:w-9 md:border-4" />
      <div className="absolute -top-2 left-1 h-3 w-4 border-2 border-foreground bg-yellow-400 dark:bg-yellow-500 sm:-top-2.5 sm:h-4 sm:w-5 sm:border-3 md:-top-3 md:h-5 md:w-6 md:border-4">
        <div className="absolute right-1 top-1 h-1 w-1 bg-foreground sm:h-1.5 sm:w-1.5" />
      </div>
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
    name: "Mechanical Keyboard",
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
    name: "Tome of Docs",
    icon: "📚",
    pixelArt: <BookPixel />,
    slot: "accessory",
    stats: [
      { label: "Confusion", value: -5, type: "negative" },
      { label: "Knowledge", value: 30, type: "positive" },
    ],
    rarity: "legendary",
    description: "Ancient wisdom contained within. Reading it reduces confusion but takes time.",
    equipped: true,
  },
  {
    id: "coffee-mug",
    name: "Enchanted Coffee",
    icon: "☕",
    pixelArt: <CoffeeMugPixel />,
    slot: "accessory",
    stats: [
      { label: "Energy", value: 50, type: "positive" },
      { label: "Sleep", value: -10, type: "negative" },
    ],
    rarity: "epic",
    description: "Bottomless container of liquid productivity. Side effects may include night coding.",
    equipped: true,
  },
  {
    id: "rubber-duck",
    name: "Rubber Duck",
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

const emptySlots = 6;

export function InventorySystem({ className }: { className?: string }) {
  const [selectedItem, setSelectedItem] = useState<string | null>(inventoryItems[0].id);

  const equippedItems = inventoryItems.filter((item) => item.equipped);
  const legendaryCount = inventoryItems.filter((item) => item.rarity === "legendary").length;
  const totalStats = equippedItems.reduce(
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

  const currentItem = inventoryItems.find((item) => item.id === selectedItem);
  const currentRarity = currentItem ? rarityConfig[currentItem.rarity] : null;

  return (
    <section className={cn("relative h-full space-y-4 overflow-x-hidden", className)}>
      <div className="grid gap-2 sm:grid-cols-3">
        <SummaryChip label="Equipped" value={`${equippedItems.length}/${inventoryItems.length}`} helper="active loadout" />
        <SummaryChip label="Legendary" value={String(legendaryCount)} helper="high-tier relics" />
        <SummaryChip label="Inspect" value="Tap item" helper="mobile friendly" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <div className="min-w-0 space-y-4">
          <div className="rounded-none border-2 border-border bg-card/80 p-3 shadow-[4px_4px_0_var(--border)] sm:p-4">
            {currentItem && currentRarity ? (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,180px)_minmax(0,1fr)] lg:items-start">
                <div
                  className={cn(
                    "relative flex min-h-[180px] items-center justify-center overflow-hidden border-2 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:min-h-[220px]",
                    currentRarity.border,
                    currentRarity.bg,
                    currentRarity.glow
                  )}
                >
                  <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                    <span className="retro border border-border/60 bg-background/80 px-2 py-1 text-[0.5rem] uppercase tracking-[0.25em] text-muted-foreground">
                      {slotLabels[currentItem.slot]}
                    </span>
                    <span className="text-xl opacity-80 sm:text-2xl">{currentItem.icon}</span>
                  </div>
                  <div className="scale-[1.15] sm:scale-[1.35]">{currentItem.pixelArt}</div>
                  {currentItem.equipped && (
                    <span className="retro absolute bottom-3 left-3 border border-primary bg-primary px-2 py-1 text-[0.5rem] uppercase tracking-[0.2em] text-primary-foreground">
                      Equipped
                    </span>
                  )}
                </div>

                <div className="min-w-0 space-y-4">
                  <div className="space-y-2 border-b-2 border-dashed border-border/50 pb-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="retro text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground">
                          Selected Artifact
                        </p>
                        <h3 className="retro mt-1 text-sm uppercase tracking-[0.18em] text-foreground sm:text-base">
                          {currentItem.name}
                        </h3>
                      </div>
                      <span
                        className={cn(
                          "retro border px-2 py-1 text-[0.5rem] uppercase tracking-[0.25em]",
                          currentRarity.border,
                          currentRarity.bg
                        )}
                      >
                        {currentRarity.label}
                      </span>
                    </div>
                    <p className="retro max-w-2xl text-[0.58rem] leading-relaxed text-muted-foreground sm:text-[0.62rem]">
                      {currentItem.description}
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {currentItem.stats.map((stat) => (
                      <div key={stat.label} className="border border-border/60 bg-background/60 px-3 py-2">
                        <p className="retro text-[0.48rem] uppercase tracking-[0.22em] text-muted-foreground">
                          {stat.label}
                        </p>
                        <p
                          className={cn(
                            "retro mt-1 text-sm uppercase tracking-[0.14em]",
                            stat.type === "positive" ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {stat.value > 0 ? "+" : ""}
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="retro flex min-h-[220px] items-center justify-center text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                Select an item
              </div>
            )}
          </div>

          <div className="rounded-none border-2 border-dashed border-border/60 bg-background/40 p-3 shadow-[2px_2px_0_var(--border)] sm:p-4">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground">Storage Grid</p>
                <h3 className="retro mt-1 text-xs uppercase tracking-[0.18em] text-foreground sm:text-sm">
                  Browse the toolkit
                </h3>
              </div>
              <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">
                Tap any slot to inspect
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {inventoryItems.map((item) => (
                <InventorySlot
                  key={item.id}
                  item={item}
                  isSelected={selectedItem === item.id}
                  onSelect={() => setSelectedItem(item.id)}
                />
              ))}
              {Array.from({ length: emptySlots }).map((_, index) => (
                <EmptySlot key={`empty-${index}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="rounded-none border-2 border-border bg-card/80 p-3 shadow-[4px_4px_0_var(--border)] sm:p-4">
            <div className="mb-3 border-b-2 border-dashed border-border/50 pb-3">
              <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground">Loadout</p>
              <h3 className="retro mt-1 text-xs uppercase tracking-[0.18em] text-foreground sm:text-sm">
                Equipped artifacts
              </h3>
            </div>

            <div className="space-y-2">
              {equippedItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(item.id)}
                  className={cn(
                    "w-full border p-3 text-left transition-colors",
                    selectedItem === item.id
                      ? "border-primary bg-primary/10"
                      : "border-border/60 bg-background/50 hover:border-primary/70 hover:bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center border-2",
                        rarityConfig[item.rarity].border,
                        rarityConfig[item.rarity].bg
                      )}
                    >
                      <div className="scale-75">{item.pixelArt}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="retro truncate text-[0.58rem] uppercase tracking-[0.16em] text-foreground">
                          {item.name}
                        </p>
                        <span className="text-sm opacity-80">{item.icon}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="retro text-[0.45rem] uppercase tracking-[0.22em] text-muted-foreground">
                          {slotLabels[item.slot]}
                        </p>
                        <p className="retro text-[0.45rem] uppercase tracking-[0.2em] text-muted-foreground">
                          {rarityConfig[item.rarity].label}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-none border-2 border-border bg-background/80 p-3 shadow-[4px_4px_0_var(--border)] sm:p-4">
        <div className="mb-3 border-b-2 border-dashed border-border/50 pb-3">
          <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground">Character Stats</p>
          <h3 className="retro mt-1 text-xs uppercase tracking-[0.18em] text-foreground sm:text-sm">
            Combined bonuses
          </h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Object.entries(totalStats).map(([label, value]) => (
            <div key={label} className="min-w-0 border border-border/60 bg-card/60 px-3 py-2">
              <span className="retro block truncate text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">
                {label}
              </span>
              <span
                className={cn(
                  "retro mt-1 block text-[0.7rem] uppercase tracking-[0.14em]",
                  value >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600"
                )}
              >
                {value >= 0 ? "+" : ""}
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SummaryChip({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="border-2 border-border/70 bg-background/70 px-3 py-2 shadow-[2px_2px_0_var(--border)]">
      <p className="retro text-[0.45rem] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
      <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <p className="retro text-sm uppercase tracking-[0.16em] text-foreground sm:text-base">{value}</p>
        <p className="retro text-[0.45rem] uppercase tracking-[0.2em] text-muted-foreground">{helper}</p>
      </div>
    </div>
  );
}

function InventorySlot({
  item,
  isSelected,
  onSelect,
}: {
  item: InventoryItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const rarity = rarityConfig[item.rarity];

  return (
    <motion.button
      type="button"
      className={cn(
        "relative aspect-square rounded-none border-2 transition-all duration-200",
        rarity.border,
        rarity.bg,
        isSelected ? "z-10 scale-[1.02] shadow-[0_0_0_2px_var(--primary)]" : "hover:border-primary hover:bg-primary/20"
      )}
      onClick={onSelect}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className={cn("absolute left-0 top-0 h-2.5 w-2.5 border-b-2 border-r-2", rarity.border)} />

      <div className="absolute inset-x-1 top-1 flex items-center justify-between">
        <span className="retro text-[0.35rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.4rem]">
          {item.icon}
        </span>
        <span className="retro text-[0.35rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.4rem]">
          {slotLabels[item.slot].slice(0, 2)}
        </span>
      </div>

      <div className="flex h-full items-center justify-center p-2 pt-5">
        <div className="scale-[0.8] sm:scale-90">{item.pixelArt}</div>
      </div>

      {item.equipped && (
        <div className="retro absolute bottom-1 left-1 border border-primary bg-primary px-1.5 py-0.5 text-[0.35rem] uppercase tracking-[0.12em] text-primary-foreground sm:text-[0.4rem]">
          EQ
        </div>
      )}
    </motion.button>
  );
}

function EmptySlot() {
  return (
    <div className="relative aspect-square rounded-none border-2 border-dashed border-border/30 bg-background/20">
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="retro text-[0.45rem] uppercase tracking-[0.2em] text-muted-foreground">--</div>
      </div>
    </div>
  );
}

export default InventorySystem;
