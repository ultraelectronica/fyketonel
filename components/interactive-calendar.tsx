"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/8bit/calendar";
import { cn } from "@/lib/utils";

interface DailyEvent {
  date: Date;
  type: "boss" | "powerup" | "quest" | "bug" | "achievement" | "coffee";
  label: string;
  description: string;
  icon: React.ReactNode;
}

// Pixel art icons for calendar events
const BossIcon = () => (
  <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-600 animate-pulse" title="Boss Battle!" />
);

const PowerUpIcon = () => (
  <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 animate-bounce" title="Power-up!" />
);

const QuestIcon = () => (
  <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500" title="Daily Quest" />
);

const BugIcon = () => (
  <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-600" title="Bug Hunt Day" />
);

const AchievementIcon = () => (
  <div className="absolute -top-1 -right-1 h-2 w-2 bg-purple-600 animate-pulse" title="Achievement Unlocked!" />
);

const CoffeeIcon = () => (
  <div className="absolute -top-1 -right-1 h-2 w-2 bg-amber-700" title="Extra Coffee Day" />
);

// Daily status effects that rotate
const dailyStatuses = [
  { name: "🎯 Focus Mode", effect: "+20 Concentration", color: "text-blue-600 dark:text-blue-400" },
  { name: "☕ Caffeine Rush", effect: "+30 Energy", color: "text-amber-600 dark:text-amber-400" },
  { name: "🐛 Bug Magnet", effect: "-10 Luck", color: "text-red-600 dark:text-red-400" },
  { name: "✨ Inspiration", effect: "+15 Creativity", color: "text-purple-600 dark:text-purple-400" },
  { name: "🔥 On Fire!", effect: "+25 Productivity", color: "text-orange-600 dark:text-orange-400" },
  { name: "😴 Low Energy", effect: "-15 Speed", color: "text-gray-600 dark:text-gray-400" },
  { name: "💡 Big Brain Time", effect: "+20 Problem Solving", color: "text-yellow-600 dark:text-yellow-400" },
  { name: "🎮 Game Dev Mode", effect: "+10 Fun", color: "text-green-600 dark:text-green-400" },
];

// Random daily quests
const dailyQuests = [
  "Write 100 lines of code without Stack Overflow",
  "Fix 3 bugs before coffee break",
  "Document at least one function",
  "Refactor that old messy code",
  "Deploy to production (without breaking it)",
  "Review a pull request",
  "Update your dependencies",
  "Optimize a slow function",
  "Write a unit test",
  "Help a fellow developer",
];

// Generate events for the current month
const generateMonthlyEvents = (currentDate: Date): DailyEvent[] => {
  const events: DailyEvent[] = [];
  const today = new Date(currentDate);
  const year = today.getFullYear();
  const month = today.getMonth();
  
  // Add some special dates
  events.push({
    date: new Date(year, month, 1),
    type: "powerup",
    label: "Fresh Start",
    description: "New month, new commits! +50 Motivation",
    icon: <PowerUpIcon />,
  });
  
  // Every Friday is a boss battle (deadline day)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (date.getDay() === 5) { // Friday
      events.push({
        date: new Date(year, month, day),
        type: "boss",
        label: "Deadline Boss",
        description: "Weekly deadline battle! Stay focused!",
        icon: <BossIcon />,
      });
    }
  }
  
  // Random events throughout the month
  const randomDays = [7, 13, 15, 21, 28];
  const types: Array<"quest" | "bug" | "achievement" | "coffee"> = ["quest", "bug", "achievement", "coffee"];
  
  randomDays.forEach((day, index) => {
    if (day <= daysInMonth) {
      const type = types[index % types.length];
      const labels = {
        quest: "Daily Quest",
        bug: "Bug Hunt",
        achievement: "Achievement Day",
        coffee: "Extra Coffee",
      };
      const descriptions = {
        quest: "Complete today's coding challenge!",
        bug: "Time to squash some bugs! +10 XP",
        achievement: "Unlock a new skill today!",
        coffee: "Double coffee rations today! +40 Energy",
      };
      const icons = {
        quest: <QuestIcon />,
        bug: <BugIcon />,
        achievement: <AchievementIcon />,
        coffee: <CoffeeIcon />,
      };
      
      events.push({
        date: new Date(year, month, day),
        type,
        label: labels[type],
        description: descriptions[type],
        icon: icons[type],
      });
    }
  });
  
  return events;
};

export function InteractiveCalendar({ className }: { className?: string }) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [monthlyEvents] = useState<DailyEvent[]>(generateMonthlyEvents(today));
  
  // Get daily status (deterministic based on day of year)
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const dailyStatus = dailyStatuses[dayOfYear % dailyStatuses.length];
  
  // Get daily quest (changes each day)
  const dailyQuest = dailyQuests[dayOfYear % dailyQuests.length];
  
  // Find event for selected date
  const selectedEvent = monthlyEvents.find(
    event => event.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      {/* Daily Status Bar */}
      <div className="rounded-none border-2 border-dashed border-border bg-background/60 p-2 backdrop-blur-sm dark:border-ring sm:border-3 sm:p-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <p className="retro text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-xs">
              Today&apos;s Status
            </p>
            <p className={cn("retro text-[0.65rem] font-bold uppercase tracking-[0.15em] sm:text-xs md:text-sm", dailyStatus.color)}>
              {dailyStatus.name}
            </p>
          </div>
          <div className="text-right">
            <p className={cn("retro text-[0.6rem] font-bold tracking-[0.12em] sm:text-xs", dailyStatus.color)}>
              {dailyStatus.effect}
            </p>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="relative calendar-with-events">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="text-center w-full max-w-none"
        />
        
        {/* Event Legend */}
        <div className="mt-2 flex flex-wrap gap-1.5 justify-center">
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 bg-red-600 animate-pulse" />
            <span className="retro text-[0.35rem] text-muted-foreground sm:text-[0.4rem]">Boss</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 bg-yellow-400 animate-bounce" />
            <span className="retro text-[0.35rem] text-muted-foreground sm:text-[0.4rem]">Power-up</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 bg-blue-500" />
            <span className="retro text-[0.35rem] text-muted-foreground sm:text-[0.4rem]">Quest</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 bg-purple-600 animate-pulse" />
            <span className="retro text-[0.55rem] text-muted-foreground sm:text-[0.6rem]">Achievement</span>
          </div>
        </div>
      </div>

      {/* Daily Quest */}
      <div className="rounded-none border-2 border-border bg-card/80 p-2 shadow-[1px_1px_0_var(--border)] backdrop-blur-sm dark:border-ring sm:border-3 sm:p-2.5 sm:shadow-[2px_2px_0_var(--border)]">
        <p className="retro mb-1 text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-xs">
          📋 Daily Quest
        </p>
        <p className="retro text-[0.65rem] leading-relaxed tracking-[0.12em] text-foreground sm:text-xs">
          {dailyQuest}
        </p>
      </div>

      {/* Selected Date Info */}
      {selectedEvent && (
        <div className={cn(
          "rounded-none border-2 p-2 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200 sm:border-3 sm:p-2.5",
          selectedEvent.type === "boss" && "border-red-500 bg-red-500/10 dark:border-red-400",
          selectedEvent.type === "powerup" && "border-yellow-400 bg-yellow-400/10 dark:border-yellow-300",
          selectedEvent.type === "quest" && "border-blue-500 bg-blue-500/10 dark:border-blue-400",
          selectedEvent.type === "bug" && "border-green-500 bg-green-500/10 dark:border-green-400",
          selectedEvent.type === "achievement" && "border-purple-500 bg-purple-500/10 dark:border-purple-400",
          selectedEvent.type === "coffee" && "border-amber-600 bg-amber-600/10 dark:border-amber-500"
        )}>
          <p className="retro mb-1 text-[0.45rem] font-bold uppercase tracking-[0.15em] text-foreground sm:text-[0.5rem] md:text-[0.55rem]">
            {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {selectedEvent.label}
          </p>
          <p className="retro text-[0.4rem] leading-relaxed tracking-[0.12em] text-muted-foreground sm:text-[0.45rem] md:text-[0.5rem]">
            {selectedEvent.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default InteractiveCalendar;

