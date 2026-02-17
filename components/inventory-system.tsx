"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

const emptySlots = 6; // Increased empty slots to fill grid

export function InventorySystem({ className }: { className?: string }) {
  const [selectedItem, setSelectedItem] = useState<string | null>(inventoryItems[0].id);

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

  const currentItem = inventoryItems.find((i) => i.id === selectedItem);

  return (
    <section className={cn("relative h-full", className)}>
        <div className="flex flex-col gap-3 md:flex-row h-full">
            {/* Inventory Grid (Left/Top) */}
            <div className="flex-1 bg-background/50 p-2 border-2 border-dashed border-border/50">
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {inventoryItems.map((item) => (
                    <InventorySlot
                        key={item.id}
                        item={item}
                        isSelected={selectedItem === item.id}
                        onSelect={() => setSelectedItem(item.id)}
                    />
                    ))}
                    {/* Empty slots */}
                    {Array.from({ length: emptySlots }).map((_, index) => (
                    <EmptySlot key={`empty-${index}`} />
                    ))}
                </div>
            </div>

            {/* Info Panel (Right/Bottom) */}
            <div className="flex-1 flex flex-col gap-3">
                
                {/* Selected Item Details */}
                <div className="flex-1 rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)] relative">
                    {currentItem ? (
                        <>
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="retro text-xs uppercase tracking-[0.15em] text-foreground font-bold">
                                        {currentItem.name}
                                    </h3>
                                    <p className="retro text-[0.5rem] uppercase tracking-wider text-muted-foreground mt-0.5">
                                        {currentItem.rarity} • {currentItem.slot}
                                    </p>
                                </div>
                                <div className="text-xl opacity-80">{currentItem.icon}</div>
                            </div>
                            
                            <div className="space-y-1 mb-3 border-y border-dashed border-border/50 py-2">
                                {currentItem.stats.map((stat) => (
                                    <div key={stat.label} className="flex justify-between items-center text-[0.55rem]">
                                         <span className="retro uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                                         <span className={cn(
                                             "retro font-bold",
                                             stat.type === "positive" ? "text-green-500" : "text-red-500"
                                         )}>
                                             {stat.value > 0 ? "+" : ""}{stat.value}
                                         </span>
                                    </div>
                                ))}
                            </div>
                            
                            <p className="retro text-[0.5rem] leading-relaxed text-muted-foreground">
                                {currentItem.description}
                            </p>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground retro text-[0.6rem] uppercase">
                            Select an item
                        </div>
                    )}
                </div>

                {/* Total Stats Summary - Compact */}
                <div className="rounded-none border-2 border-border bg-background/80 p-2 shadow-[2px_2px_0_var(--border)]">
                    <p className="retro mb-1.5 text-[0.45rem] uppercase tracking-[0.2em] text-muted-foreground border-b border-border/50 pb-0.5">
                        Character Stats
                    </p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                        {Object.entries(totalStats).slice(0, 6).map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between text-[0.5rem]">
                                <span className="retro uppercase text-muted-foreground truncate mr-2">{label}</span>
                                <span className={cn(
                                    "retro font-bold",
                                    value >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600"
                                )}>
                                    {value >= 0 ? "+" : ""}{value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    </section>
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
  const rarityColors = {
    common: "border-gray-500 dark:border-gray-400",
    uncommon: "border-green-500 dark:border-green-400",
    rare: "border-blue-500 dark:border-blue-400",
    epic: "border-purple-500 dark:border-purple-400",
    legendary: "border-amber-500 dark:border-amber-400",
  };

  const rarityBg = {
    common: "bg-gray-500/10",
    uncommon: "bg-green-500/10",
    rare: "bg-blue-500/10",
    epic: "bg-purple-500/10",
    legendary: "bg-amber-500/10",
  };

  return (
    <motion.div
      className={cn(
        "relative aspect-square cursor-pointer rounded-none border-2 transition-all duration-200",
        rarityColors[item.rarity],
        rarityBg[item.rarity],
        isSelected ? "shadow-[0_0_0_2px_var(--primary)] z-10 scale-105" : "hover:border-primary hover:bg-primary/20"
      )}
      onClick={onSelect}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
        {/* Rarity Corner */}
        <div className={cn(
            "absolute top-0 left-0 w-2 h-2 border-b-2 border-r-2",
            rarityColors[item.rarity]
        )} />

      {/* Item Icon */}
      <div className="flex h-full items-center justify-center p-1">
          <div className="scale-75 sm:scale-90">
            {item.pixelArt}
          </div>
      </div>
      
       {item.equipped && (
          <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground text-[0.3rem] px-1 font-bold">
              E
          </div>
        )}
    </motion.div>
  );
}

function EmptySlot() {
  return (
    <div className="relative aspect-square rounded-none border-2 border-dashed border-border/30 bg-background/20">
       <div className="absolute inset-0 flex items-center justify-center opacity-10">
           <div className="w-2 h-2 rounded-full bg-foreground" />
       </div>
    </div>
  );
}

export default InventorySystem;

