"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/8bit/button";
import { useMediaQuery } from "react-responsive";

// ============================================
// PIXEL ART COMPONENTS
// ============================================

// Enhanced scroll with animated elements
const ScrollPixel = () => (
  <div className="flex flex-col items-center">
    {/* Top roller */}
    <div className="h-2 w-10 rounded-full border-2 border-foreground bg-amber-700 dark:bg-amber-600 sm:h-2.5 sm:w-12" />
    {/* Scroll body */}
    <div className="relative h-8 w-8 border-2 border-t-0 border-foreground bg-amber-100 dark:bg-amber-50 sm:h-10 sm:w-10">
      {/* Text lines */}
      <div className="absolute left-1 right-1 top-1.5 h-0.5 bg-foreground/30 sm:top-2" />
      <div className="absolute left-1 right-1 top-3 h-0.5 bg-foreground/30 sm:top-4" />
      <div className="absolute left-1 right-2 top-4.5 h-0.5 bg-foreground/30 sm:top-6" />
      <div className="absolute left-1 right-3 top-6 h-0.5 bg-foreground/30 sm:top-8" />
    </div>
    {/* Bottom roller */}
    <div className="h-2 w-10 rounded-full border-2 border-foreground bg-amber-700 dark:bg-amber-600 sm:h-2.5 sm:w-12" />
  </div>
);

// Enhanced treasure chest with glow effect
const ChestPixel = ({ isGlowing = false }: { isGlowing?: boolean }) => (
  <div className="flex flex-col items-center relative">
    {/* Glow effect when glowing */}
    {isGlowing && (
      <motion.div
        className="absolute inset-0 -inset-2 rounded-lg bg-amber-400/30 blur-md"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    )}
    {/* Chest lid */}
    <div className="relative h-3 w-10 rounded-t-lg border-2 border-b-0 border-foreground bg-amber-600 dark:bg-amber-700 sm:h-4 sm:w-12">
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-800 dark:bg-amber-900" />
    </div>
    {/* Chest body */}
    <div className="relative h-6 w-10 border-2 border-foreground bg-amber-500 dark:bg-amber-600 sm:h-7 sm:w-12">
      {/* Lock */}
      <div className="absolute left-1/2 top-0 h-3 w-2 -translate-x-1/2 border-2 border-foreground bg-yellow-400 dark:bg-yellow-500 sm:h-4 sm:w-3" />
      {/* Keyhole */}
      <div className="absolute left-1/2 top-1.5 h-1 w-0.5 -translate-x-1/2 bg-foreground sm:top-2" />
    </div>
  </div>
);

// New: Golden key pixel art
const KeyPixel = () => (
  <motion.div 
    className="flex items-center"
    animate={{ rotate: [0, -10, 10, 0] }}
    transition={{ duration: 0.6, repeat: 2 }}
  >
    {/* Key head */}
    <div className="relative h-4 w-4 rounded-full border-2 border-foreground bg-yellow-400 dark:bg-yellow-500 sm:h-5 sm:w-5">
      <div className="absolute inset-1 rounded-full border border-foreground/30" />
    </div>
    {/* Key shaft */}
    <div className="h-1.5 w-4 border-y-2 border-foreground bg-yellow-500 dark:bg-yellow-600 sm:w-5" />
    {/* Key teeth */}
    <div className="flex flex-col">
      <div className="h-0.5 w-1.5 bg-yellow-500 dark:bg-yellow-600" />
      <div className="h-1 w-2 border-2 border-foreground bg-yellow-400 dark:bg-yellow-500" />
      <div className="h-0.5 w-1.5 bg-yellow-500 dark:bg-yellow-600" />
    </div>
  </motion.div>
);

// New: Document with animated pages
const DocumentPixel = ({ isAnimating = false }: { isAnimating?: boolean }) => (
  <div className="relative">
    {/* Stack effect - back pages */}
    <div className="absolute left-1 top-1 h-10 w-8 border-2 border-foreground/30 bg-gray-200 dark:bg-gray-700 sm:h-12 sm:w-9" />
    <div className="absolute left-0.5 top-0.5 h-10 w-8 border-2 border-foreground/40 bg-gray-100 dark:bg-gray-600 sm:h-12 sm:w-9" />
    {/* Main document */}
    <motion.div 
      className="relative h-10 w-8 border-2 border-foreground bg-white dark:bg-gray-200 sm:h-12 sm:w-9"
      animate={isAnimating ? { y: [-1, 1, -1] } : {}}
      transition={{ duration: 0.5, repeat: Infinity }}
    >
      {/* Header */}
      <div className="absolute left-1 right-1 top-1 h-1 bg-primary/60" />
      {/* Text lines */}
      <div className="absolute left-1 right-1 top-3 h-0.5 bg-foreground/40" />
      <div className="absolute left-1 right-2 top-4 h-0.5 bg-foreground/30" />
      <div className="absolute left-1 right-1.5 top-5 h-0.5 bg-foreground/40" />
      <div className="absolute left-1 right-3 top-6 h-0.5 bg-foreground/30" />
      <div className="absolute left-1 right-2 top-7 h-0.5 bg-foreground/40 sm:top-8" />
    </motion.div>
  </div>
);

// Sparkle/Particle component
const Sparkle = ({ delay = 0, xOffset = 0 }: { delay?: number; xOffset?: number }) => (
  <motion.div
    className="absolute h-1 w-1 rounded-full bg-yellow-300"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      y: [-10, -30],
      x: [0, xOffset],
    }}
    transition={{ duration: 1, delay, repeat: Infinity, repeatDelay: 2 }}
  />
);

// Scan beam with improved visuals
const ScanBeam = ({ isScanning }: { isScanning: boolean }) => (
  <AnimatePresence>
    {isScanning && (
      <motion.div
        initial={{ top: 0, opacity: 0 }}
        animate={{ top: ["0%", "100%", "0%"], opacity: [0.8, 0.8, 0.8] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute left-0 right-0 z-20 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_30px_var(--primary),0_0_60px_var(--primary)]"
      />
    )}
  </AnimatePresence>
);

// Particle burst on unlock
const ParticleBurst = ({ isActive }: { isActive: boolean }) => (
  <AnimatePresence>
    {isActive && (
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
            style={{
              background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f97316' : '#22c55e',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((i * 30 * Math.PI) / 180) * 100,
              y: Math.sin((i * 30 * Math.PI) / 180) * 100,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </div>
    )}
  </AnimatePresence>
);

// Loot drop animation
const LootDrop = ({ isActive, onComplete }: { isActive: boolean; onComplete: () => void }) => {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {/* Glowing orb */}
            <motion.div
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="absolute inset-0 -inset-4 rounded-full bg-amber-400/40 blur-xl" />
              <div className="relative rounded-none border-4 border-amber-500 bg-gradient-to-br from-amber-100 to-amber-200 p-6 shadow-[0_0_40px_rgba(251,191,36,0.6)] dark:from-amber-900 dark:to-amber-800">
                <DocumentPixel isAnimating />
              </div>
            </motion.div>
            {/* Loot text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <p className="retro text-lg uppercase tracking-[0.3em] text-amber-500 dark:text-amber-400 sm:text-xl">
                +1 Resume Acquired!
              </p>
              <p className="retro mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Item added to inventory
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// DATA
// ============================================

// Enhanced skills with categories and icons
const extractedSkills = [
  { name: "React / Next.js", level: 92, category: "Frontend", icon: "🎨" },
  { name: "TypeScript", level: 88, category: "Language", icon: "📝" },
  { name: "Node.js", level: 85, category: "Backend", icon: "⚙️" },
  { name: "Flutter / Dart", level: 82, category: "Mobile", icon: "📱" },
  { name: "Python", level: 80, category: "Language", icon: "🐍" },
  { name: "PostgreSQL", level: 78, category: "Database", icon: "🗄️" },
  { name: "AWS / Cloud", level: 75, category: "DevOps", icon: "☁️" },
];

// Achievement definitions
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  rarity: "common" | "rare" | "legendary";
}

const achievements: Achievement[] = [
  { id: "document-hunter", title: "Document Hunter", description: "Decrypted the resume", icon: "🔓", points: 15, rarity: "common" },
  { id: "loot-collector", title: "Loot Collector", description: "Downloaded the resume", icon: "📦", points: 25, rarity: "common" },
  { id: "power-reader", title: "Power Reader", description: "Viewed in full screen", icon: "🔍", points: 10, rarity: "common" },
  { id: "repeat-offender", title: "Repeat Offender", description: "Downloaded 3+ times", icon: "🔄", points: 50, rarity: "rare" },
];

// Document metadata
const documentMetadata = {
  experienceYears: 5,
  projectsCount: 12,
  skillsCount: 18,
  lastUpdated: "Dec 2024",
  fileIntegrity: "Verified ✓",
  archiveDate: "Dec 2024",
  dataWeight: "~137 KB",
  scrollLength: "1 Page",
};

// Category colors
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Frontend: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/50" },
  Backend: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", border: "border-green-500/50" },
  Language: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/50" },
  Database: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/50" },
  DevOps: { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/50" },
  Mobile: { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", border: "border-pink-500/50" },
};

// ============================================
// MAIN COMPONENT
// ============================================

export function ResumeArchive({ className }: { className?: string }) {
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showSkills, setShowSkills] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [showLootDrop, setShowLootDrop] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [showAchievementToast, setShowAchievementToast] = useState<Achievement | null>(null);
  const [viewedFullScreen, setViewedFullScreen] = useState(false);

  const isVerySmall = useMediaQuery({ maxWidth: 374 });

  // Unlock achievement helper
  const unlockAchievement = useCallback((achievementId: string) => {
    if (!unlockedAchievements.includes(achievementId)) {
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        setUnlockedAchievements(prev => [...prev, achievementId]);
        setShowAchievementToast(achievement);
        setTimeout(() => setShowAchievementToast(null), 3000);
      }
    }
  }, [unlockedAchievements]);

  // Handle decrypt animation
  const handleDecrypt = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setIsDecrypted(true);
          setShowParticles(true);
          setTimeout(() => setShowParticles(false), 1000);
          setTimeout(() => setShowSkills(true), 500);
          unlockAchievement("document-hunter");
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Handle download with loot drop effect
  const handleDownload = () => {
    setShowLootDrop(true);
    setDownloadCount((prev) => prev + 1);
    
    // Unlock achievements
    unlockAchievement("loot-collector");
    if (downloadCount >= 2) {
      unlockAchievement("repeat-offender");
    }

    // Trigger actual download
    const link = document.createElement("a");
    link.href = "/Resume/RESUME_FYKE_TONEL.pdf";
    link.download = "FYKE_TONEL_RESUME.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle full view
  const handleFullView = () => {
    window.open("/Resume/RESUME_FYKE_TONEL.pdf", "_blank");
    if (!viewedFullScreen) {
      setViewedFullScreen(true);
      unlockAchievement("power-reader");
    }
  };

  const totalPoints = unlockedAchievements.reduce((sum, id) => {
    const achievement = achievements.find(a => a.id === id);
    return sum + (achievement?.points || 0);
  }, 0);

  const panelClass = isVerySmall
    ? "rounded-none border border-border bg-card/80 p-2 shadow-[1px_1px_0_var(--border)] backdrop-blur-sm dark:border-ring"
    : "rounded-none border-2 border-border bg-card/80 p-3 shadow-[2px_2px_0_var(--border)] backdrop-blur-sm dark:border-ring min-[375px]:border-3 min-[375px]:p-4 min-[375px]:shadow-[3px_3px_0_var(--border)] sm:border-4 sm:p-5 sm:shadow-[4px_4px_0_var(--border)] md:p-6 md:shadow-[6px_6px_0_var(--border)]";

  return (
    <section className={cn("relative space-y-4 sm:space-y-5 md:space-y-6", className)}>
      {/* Loot Drop Overlay */}
      <LootDrop isActive={showLootDrop} onComplete={() => setShowLootDrop(false)} />

      {/* Achievement Toast */}
      <AnimatePresence>
        {showAchievementToast && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-4 top-20 z-50 flex items-center gap-3 rounded-none border-2 border-amber-500 bg-gradient-to-r from-amber-500/20 to-amber-600/10 px-4 py-3 shadow-[0_0_20px_rgba(251,191,36,0.3)] backdrop-blur-sm sm:right-6 sm:top-24"
          >
            <span className="text-2xl">{showAchievementToast.icon}</span>
            <div>
              <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-amber-500 sm:text-[0.6rem]">
                Achievement Unlocked!
              </p>
              <p className="retro text-xs uppercase tracking-[0.15em] text-foreground sm:text-sm">
                {showAchievementToast.title}
              </p>
              <p className="retro text-[0.4rem] uppercase tracking-[0.12em] text-muted-foreground sm:text-[0.45rem]">
                +{showAchievementToast.points} Reputation
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="space-y-2 text-center sm:space-y-2.5 md:space-y-3">
        <p className="retro text-[0.5rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs md:tracking-[0.4em]">
          Classified Documents
        </p>
        <h2 className="retro text-lg uppercase tracking-[0.2em] sm:text-xl sm:tracking-[0.25em] md:text-2xl md:tracking-[0.3em]">
          Resume Archive
        </h2>

        {/* Achievement Counter */}
        <div className="mx-auto inline-flex items-center gap-2 rounded-none border-2 border-border bg-card/80 px-3 py-1.5 shadow-[1px_1px_0_var(--border)] backdrop-blur-sm dark:border-ring sm:gap-2.5 sm:border-3 sm:px-4 sm:py-2 sm:shadow-[2px_2px_0_var(--border)]">
          <span className="text-lg sm:text-xl">🏆</span>
          <div className="text-left">
            <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem]">
              Archive Progress
            </p>
            <p className="retro text-xs font-bold tracking-[0.15em] text-primary sm:text-sm">
              {unlockedAchievements.length}/{achievements.length} • {totalPoints}G
            </p>
          </div>
        </div>
      </div>

      {/* Main Archive Container */}
      <div className={cn(panelClass, "relative overflow-hidden")}>
        {/* Animated scanlines overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
          }}
        />

        {/* Scan beam effect */}
        <ScanBeam isScanning={isScanning} />

        {/* Particle burst */}
        <ParticleBurst isActive={showParticles} />

        <div className="relative z-0 grid gap-4 sm:gap-5 md:gap-6 lg:grid-cols-2">
          {/* Left Side - Document Preview */}
          <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-5">
            {/* Document Frame */}
            <div className="relative w-full max-w-xs">
              {/* Holographic frame effect */}
              <div
                className={cn(
                  "relative aspect-[8.5/11] w-full overflow-hidden rounded-none border-2 transition-all duration-500 sm:border-3 md:border-4",
                  isDecrypted
                    ? "border-primary/60 shadow-[0_0_30px_rgba(var(--primary),0.4)]"
                    : "border-border/60 dark:border-ring/60"
                )}
              >
                {/* Glowing animated corners */}
                {isDecrypted && (
                  <>
                    <motion.div 
                      className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-primary sm:h-8 sm:w-8"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-primary sm:h-8 sm:w-8"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-primary sm:h-8 sm:w-8"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                    <motion.div 
                      className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-primary sm:h-8 sm:w-8"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                    />
                    {/* Sparkles */}
                    <Sparkle delay={0} xOffset={-8} />
                    <Sparkle delay={0.3} xOffset={5} />
                    <Sparkle delay={0.6} xOffset={-3} />
                  </>
                )}

                {/* Content based on decrypt state */}
                <AnimatePresence mode="wait">
                  {!isDecrypted ? (
                    <motion.div
                      key="locked"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95, rotateY: 90 }}
                      transition={{ duration: 0.5 }}
                      className="flex h-full flex-col items-center justify-center gap-4 bg-background/80 p-4"
                    >
                      <ChestPixel isGlowing={isScanning} />
                      <div className="space-y-2 text-center">
                        <p className="retro text-xs uppercase tracking-[0.2em] text-foreground sm:text-sm">
                          [ENCRYPTED]
                        </p>
                        <p className="retro text-[0.45rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.55rem]">
                          Access level: Public
                        </p>
                        {isScanning && (
                          <div className="space-y-2">
                            <div className="mx-auto mt-3 flex items-center justify-center gap-2">
                              <KeyPixel />
                            </div>
                            <div className="mx-auto h-2.5 w-32 overflow-hidden rounded-none border-2 border-border bg-background/80 dark:border-ring sm:h-3 sm:w-40">
                              <motion.div
                                className="h-full bg-gradient-to-r from-primary via-primary to-green-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${scanProgress}%` }}
                              />
                            </div>
                            <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-primary animate-pulse sm:text-[0.45rem]">
                              Decrypting... {scanProgress}%
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unlocked"
                      initial={{ opacity: 0, scale: 1.05, rotateY: -90 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      transition={{ duration: 0.5 }}
                      className="h-full w-full relative"
                    >
                      {/* Holographic shimmer overlay */}
                      <motion.div
                        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-transparent via-primary/5 to-transparent"
                        animate={{ 
                          background: [
                            "linear-gradient(45deg, transparent 0%, rgba(var(--primary), 0.05) 50%, transparent 100%)",
                            "linear-gradient(45deg, transparent 100%, rgba(var(--primary), 0.05) 50%, transparent 0%)",
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      {/* PDF Preview iframe */}
                      <iframe
                        src="/Resume/RESUME_FYKE_TONEL.pdf"
                        className="h-full w-full"
                        title="Resume Preview"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CLASSIFIED stamp overlay */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                    isDecrypted ? "opacity-0" : "opacity-100"
                  )}
                >
                  <motion.div 
                    className="rotate-[-15deg] border-4 border-dashed border-red-500/50 px-3 py-1 sm:px-4 sm:py-2"
                    animate={!isDecrypted ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <p className="retro text-lg uppercase tracking-[0.3em] text-red-500/60 sm:text-xl md:text-2xl">
                      Classified
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced Document Stats */}
              <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
                <div className="rounded-none border border-border bg-background/60 px-2 py-1 text-center dark:border-ring sm:px-3 sm:py-1.5">
                  <p className="retro text-[0.4rem] uppercase tracking-[0.12em] text-muted-foreground sm:text-[0.45rem]">
                    Archive Date
                  </p>
                  <p className="retro text-[0.5rem] uppercase tracking-[0.1em] text-foreground sm:text-[0.55rem]">
                    {documentMetadata.archiveDate}
                  </p>
                </div>
                <div className="rounded-none border border-border bg-background/60 px-2 py-1 text-center dark:border-ring sm:px-3 sm:py-1.5">
                  <p className="retro text-[0.4rem] uppercase tracking-[0.12em] text-muted-foreground sm:text-[0.45rem]">
                    Data Weight
                  </p>
                  <p className="retro text-[0.5rem] uppercase tracking-[0.1em] text-foreground sm:text-[0.55rem]">
                    {documentMetadata.dataWeight}
                  </p>
                </div>
                <div className="rounded-none border border-border bg-background/60 px-2 py-1 text-center dark:border-ring sm:px-3 sm:py-1.5">
                  <p className="retro text-[0.4rem] uppercase tracking-[0.12em] text-muted-foreground sm:text-[0.45rem]">
                    Pages
                  </p>
                  <p className="retro text-[0.5rem] uppercase tracking-[0.1em] text-foreground sm:text-[0.55rem]">
                    {documentMetadata.scrollLength}
                  </p>
                </div>
              </div>

              {/* Extended Metadata (shown when decrypted) */}
              <AnimatePresence>
                {isDecrypted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden sm:mt-3"
                  >
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <div className="rounded-none border border-primary/30 bg-primary/5 px-2 py-1 text-center sm:px-3 sm:py-1.5">
                        <p className="retro text-[0.4rem] uppercase tracking-[0.12em] text-primary sm:text-[0.45rem]">
                          Experience
                        </p>
                        <p className="retro text-[0.55rem] font-bold uppercase tracking-[0.1em] text-foreground sm:text-[0.6rem]">
                          {documentMetadata.experienceYears}+ Years
                        </p>
                      </div>
                      <div className="rounded-none border border-primary/30 bg-primary/5 px-2 py-1 text-center sm:px-3 sm:py-1.5">
                        <p className="retro text-[0.4rem] uppercase tracking-[0.12em] text-primary sm:text-[0.45rem]">
                          Projects
                        </p>
                        <p className="retro text-[0.55rem] font-bold uppercase tracking-[0.1em] text-foreground sm:text-[0.6rem]">
                          {documentMetadata.projectsCount}+
                        </p>
                      </div>
                      <div className="rounded-none border border-green-500/30 bg-green-500/5 px-2 py-1 text-center sm:px-3 sm:py-1.5">
                        <p className="retro text-[0.4rem] uppercase tracking-[0.12em] text-green-600 dark:text-green-400 sm:text-[0.45rem]">
                          Integrity
                        </p>
                        <p className="retro text-[0.55rem] font-bold uppercase tracking-[0.1em] text-green-600 dark:text-green-400 sm:text-[0.6rem]">
                          {documentMetadata.fileIntegrity}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side - Actions & Skills */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-5">
            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4">
              {!isDecrypted ? (
                <Button
                  onClick={handleDecrypt}
                  disabled={isScanning}
                  className="retro w-full h-12 text-[0.55rem] uppercase tracking-[0.2em] sm:h-14 sm:text-[0.65rem] sm:tracking-[0.25em] md:h-16 md:text-xs"
                >
                  {isScanning ? (
                    <span className="flex items-center gap-2">
                      <motion.span 
                        className="inline-block h-2 w-2 rounded-full bg-current"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                      Decrypting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>🔓</span>
                      Decrypt Document
                    </span>
                  )}
                </Button>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <Button
                    onClick={handleDownload}
                    className="retro flex-1 h-12 text-[0.55rem] uppercase tracking-[0.2em] sm:h-14 sm:text-[0.65rem] sm:tracking-[0.25em] md:h-16 md:text-xs transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]"
                  >
                    <span className="mr-2">📦</span>
                    Collect Loot
                    {downloadCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-2 rounded bg-primary-foreground/20 px-1.5 py-0.5 text-[0.4rem]"
                      >
                        x{downloadCount}
                      </motion.span>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleFullView}
                    className="retro flex-1 h-12 text-[0.55rem] uppercase tracking-[0.2em] sm:h-14 sm:text-[0.65rem] sm:tracking-[0.25em] md:h-16 md:text-xs"
                  >
                    <span className="mr-2">🔍</span>
                    Full View
                  </Button>
                </div>
              )}
            </div>

            {/* Enhanced Skill Scanner Results */}
            <AnimatePresence>
              {showSkills && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-none border-2 border-dashed border-border bg-background/60 p-3 dark:border-ring sm:border-3 sm:p-4"
                >
                  <div className="mb-3 flex items-center justify-between sm:mb-4">
                    <div className="flex items-center gap-2">
                      <ScrollPixel />
                      <div>
                        <p className="retro text-[0.5rem] uppercase tracking-[0.2em] text-foreground sm:text-[0.6rem]">
                          Skill Scan Complete
                        </p>
                        <p className="retro text-[0.4rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.45rem]">
                          {extractedSkills.length} abilities detected
                        </p>
                      </div>
                    </div>
                    <div className="rounded-none border border-green-500/50 bg-green-500/10 px-2 py-0.5">
                      <p className="retro text-[0.4rem] uppercase tracking-[0.12em] text-green-600 dark:text-green-400 sm:text-[0.45rem]">
                        ● Online
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3">
                    {extractedSkills.map((skill, index) => {
                      const colors = categoryColors[skill.category] || categoryColors.Frontend;
                      return (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{skill.icon}</span>
                              <span className="retro text-[0.45rem] uppercase tracking-[0.12em] text-foreground sm:text-[0.5rem]">
                                {skill.name}
                              </span>
                              <span className={cn(
                                "retro rounded-none border px-1 py-0.5 text-[0.35rem] uppercase tracking-[0.1em] sm:text-[0.4rem]",
                                colors.bg, colors.text, colors.border
                              )}>
                                {skill.category}
                              </span>
                            </div>
                            <span className="retro text-[0.45rem] font-bold uppercase tracking-[0.1em] text-primary sm:text-[0.5rem]">
                              LV.{skill.level}
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-none border border-border bg-background dark:border-ring sm:h-2.5">
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                            >
                              {/* Animated shine */}
                              <motion.div
                                className="h-full w-4 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                animate={{ x: ["-100%", "400%"] }}
                                transition={{ duration: 2, delay: index * 0.1 + 0.8, repeat: Infinity, repeatDelay: 3 }}
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Achievements mini-display */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-4 border-t border-dashed border-border pt-3 dark:border-ring sm:mt-5 sm:pt-4"
                  >
                    <p className="retro mb-2 text-[0.45rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.5rem]">
                      Archive Achievements
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {achievements.map((achievement) => {
                        const isUnlocked = unlockedAchievements.includes(achievement.id);
                        return (
                          <div
                            key={achievement.id}
                            className={cn(
                              "flex items-center gap-1 rounded-none border px-2 py-1 transition-all",
                              isUnlocked
                                ? "border-amber-500/50 bg-amber-500/10"
                                : "border-border/50 bg-background/40 opacity-50 grayscale"
                            )}
                          >
                            <span className="text-base">{achievement.icon}</span>
                            <span className={cn(
                              "retro text-[0.4rem] uppercase tracking-[0.1em] sm:text-[0.45rem]",
                              isUnlocked ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                            )}>
                              {achievement.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lore text */}
            {!isDecrypted && (
              <motion.div 
                className="rounded-none border border-border/50 bg-background/40 p-3 dark:border-ring/50 sm:p-4"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <p className="retro text-center text-[0.45rem] leading-relaxed text-muted-foreground sm:text-[0.55rem]">
                  「 An ancient scroll containing the chronicles of a developer&apos;s journey.
                  Decrypt to reveal the artifacts within. 」
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResumeArchive;
