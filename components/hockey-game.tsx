"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";

interface GameScore {
  player: number;
  ai: number;
}

const STORAGE_KEY = "hockey-game-score";
const WINNING_SCORE = 6;

function PixelHollowCircle({ cx, cy, radius, color }: { cx: number; cy: number; radius: number; color: string }) {
  const s = radius / 5;
  const pixels = [
    [3,0],[4,0],[5,0],[6,0],
    [2,1],[7,1],
    [1,2],[8,2],
    [0,3],[0,4],[0,5],[0,6],
    [9,3],[9,4],[9,5],[9,6],
    [1,7],[8,7],
    [2,8],[7,8],
    [3,9],[4,9],[5,9],[6,9]
  ];
  return (
    <g transform={`translate(${cx - radius}, ${cy - radius})`}>
      {pixels.map(([px, py], i) => (
        <rect key={i} x={px * s} y={py * s} width={s} height={s} fill={color} />
      ))}
    </g>
  );
}

function PixelSolidCircle({ cx, cy, radius, color }: { cx: number; cy: number; radius: number; color: string }) {
  const s = radius / 4;
  const rows = [
    { y: 0, x: 2, w: 4 },
    { y: 1, x: 1, w: 6 },
    { y: 2, x: 0, w: 8 },
    { y: 3, x: 0, w: 8 },
    { y: 4, x: 0, w: 8 },
    { y: 5, x: 0, w: 8 },
    { y: 6, x: 1, w: 6 },
    { y: 7, x: 2, w: 4 },
  ];
  return (
    <g transform={`translate(${cx - radius}, ${cy - radius})`}>
      {rows.map((row, i) => (
        <rect key={i} x={row.x * s} y={row.y * s} width={row.w * s} height={s} fill={color} />
      ))}
    </g>
  );
}

export function HockeyGame({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });
  const [gameState, setGameState] = useState({
    playerPaddle: { x: 0, y: 0, radius: 20 },
    aiPaddle: { x: 0, y: 0, radius: 20 },
    puck: { x: 0, y: 0, radius: 8, vx: 0, vy: 0 },
  });
  const loadInitialScore = (): GameScore => {
    if (typeof window === "undefined") return { player: 0, ai: 0 };
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as GameScore;
      } catch {
        return { player: 0, ai: 0 };
      }
    }
    return { player: 0, ai: 0 };
  };

  const [score, setScore] = useState<GameScore>(() => loadInitialScore());
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef<GameScore>(loadInitialScore());
  const gameOverRef = useRef(false);
  
  const gameStateRef = useRef({
    playerPaddle: { x: 0, y: 0, radius: 20 },
    aiPaddle: { x: 0, y: 0, radius: 20 },
    puck: { x: 0, y: 0, radius: 8, vx: 0, vy: 0 },
    keys: { up: false, down: false },
    lastTime: 0,
  });

  const saveScore = useCallback((newScore: GameScore) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newScore));
    scoreRef.current = newScore;
  }, []);

  const updateScore = useCallback((newScore: GameScore) => {
    saveScore(newScore);
    setScore(newScore);
    if (newScore.player >= WINNING_SCORE || newScore.ai >= WINNING_SCORE) {
      setGameOver(true);
      gameOverRef.current = true;
      setIsPaused(true);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hockeyScoreUpdate", { detail: newScore }));
    }
  }, [saveScore]);

  const baseDiagonal = Math.sqrt(400 * 400 + 300 * 300);
  const currentDiagonal = Math.sqrt(dimensions.width * dimensions.width + dimensions.height * dimensions.height);
  const speedScale = Math.min(1.8, Math.max(1, currentDiagonal / baseDiagonal));

  const initGame = useCallback(() => {
    const state = gameStateRef.current;
    const paddleMargin = 30 * speedScale;
    
    state.playerPaddle.x = paddleMargin;
    state.playerPaddle.y = dimensions.height / 2;
    
    state.aiPaddle.x = dimensions.width - paddleMargin;
    state.aiPaddle.y = dimensions.height / 2;
    
    state.puck.x = dimensions.width / 2;
    state.puck.y = dimensions.height / 2;
    
    const speed = 4.5 * speedScale;
    const angle = (Math.random() - 0.5) * Math.PI / 3;
    state.puck.vx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1);
    state.puck.vy = Math.sin(angle) * speed;
    
    setGameState({
      playerPaddle: { ...state.playerPaddle },
      aiPaddle: { ...state.aiPaddle },
      puck: { ...state.puck },
    });
  }, [dimensions, speedScale]);

  const resetGame = useCallback(() => {
    setScore({ player: 0, ai: 0 });
    scoreRef.current = { player: 0, ai: 0 };
    setGameOver(false);
    gameOverRef.current = false;
    setIsPaused(false);
    initGame();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hockeyScoreUpdate", { detail: { player: 0, ai: 0 } }));
    }
  }, [initGame]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      gameStateRef.current.keys.up = true;
      e.preventDefault();
    }
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      gameStateRef.current.keys.down = true;
      e.preventDefault();
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      gameStateRef.current.keys.up = false;
    }
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      gameStateRef.current.keys.down = false;
    }
  }, []);

  const update = useCallback(() => {
    const state = gameStateRef.current;
    const paddleSpeed = 6 * speedScale;
    
    if (state.keys.up && state.playerPaddle.y - state.playerPaddle.radius > 0) {
      state.playerPaddle.y -= paddleSpeed;
    }
    if (state.keys.down && state.playerPaddle.y + state.playerPaddle.radius < dimensions.height) {
      state.playerPaddle.y += paddleSpeed;
    }
    
    const aiCenter = state.aiPaddle.y;
    const puckY = state.puck.y;
    const aiSpeed = 5 * speedScale;
    
    if (aiCenter < puckY - 5) {
      state.aiPaddle.y = Math.min(dimensions.height - state.aiPaddle.radius, state.aiPaddle.y + aiSpeed);
    } else if (aiCenter > puckY + 5) {
      state.aiPaddle.y = Math.max(state.aiPaddle.radius, state.aiPaddle.y - aiSpeed);
    }
    
    state.puck.x += state.puck.vx;
    state.puck.y += state.puck.vy;
    
    if (state.puck.y - state.puck.radius <= 0 || state.puck.y + state.puck.radius >= dimensions.height) {
      state.puck.vy = -state.puck.vy;
    }
    
    const playerDist = Math.sqrt(
      Math.pow(state.puck.x - state.playerPaddle.x, 2) + 
      Math.pow(state.puck.y - state.playerPaddle.y, 2)
    );
    
    if (playerDist < state.playerPaddle.radius + state.puck.radius) {
      const angle = Math.atan2(state.puck.y - state.playerPaddle.y, state.puck.x - state.playerPaddle.x);
      const speed = Math.sqrt(state.puck.vx * state.puck.vx + state.puck.vy * state.puck.vy);
      state.puck.vx = Math.cos(angle) * speed * 1.2;
      state.puck.vy = Math.sin(angle) * speed * 1.2;
      const overlap = state.playerPaddle.radius + state.puck.radius - playerDist;
      state.puck.x += Math.cos(angle) * overlap;
      state.puck.y += Math.sin(angle) * overlap;
    }
    
    const aiDist = Math.sqrt(
      Math.pow(state.puck.x - state.aiPaddle.x, 2) + 
      Math.pow(state.puck.y - state.aiPaddle.y, 2)
    );
    
    if (aiDist < state.aiPaddle.radius + state.puck.radius) {
      const angle = Math.atan2(state.puck.y - state.aiPaddle.y, state.puck.x - state.aiPaddle.x);
      const speed = Math.sqrt(state.puck.vx * state.puck.vx + state.puck.vy * state.puck.vy);
      state.puck.vx = Math.cos(angle) * speed * 1.2;
      state.puck.vy = Math.sin(angle) * speed * 1.2;
      const overlap = state.aiPaddle.radius + state.puck.radius - aiDist;
      state.puck.x += Math.cos(angle) * overlap;
      state.puck.y += Math.sin(angle) * overlap;
    }
    
    if (state.puck.x < 0) {
      if (gameOverRef.current) return;
      const newScore = { player: scoreRef.current.player, ai: scoreRef.current.ai + 1 };
      updateScore(newScore);
      initGame();
      return;
    }
    if (state.puck.x > dimensions.width) {
      if (gameOverRef.current) return;
      const newScore = { player: scoreRef.current.player + 1, ai: scoreRef.current.ai };
      updateScore(newScore);
      initGame();
      return;
    }
    
    setGameState({
      playerPaddle: { ...state.playerPaddle },
      aiPaddle: { ...state.aiPaddle },
      puck: { ...state.puck },
    });
  }, [dimensions, initGame, updateScore, speedScale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeGame = () => {
      const rect = container.getBoundingClientRect();
      if (isFullscreen) {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      } else {
        setDimensions({ width: rect.width, height: Math.min(400, rect.height) });
      }
    };

    resizeGame();
    window.addEventListener("resize", resizeGame);

    return () => {
      window.removeEventListener("resize", resizeGame);
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    initGame();
  }, [dimensions, initGame]);

  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      if (isPaused || gameOver || dimensions.width === 0 || dimensions.height === 0) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const state = gameStateRef.current;
      state.lastTime = currentTime;

      update();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    gameStateRef.current.lastTime = performance.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp, update, isPaused, gameOver, dimensions]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen().then(() => {
          setIsFullscreen(true);
          setTimeout(() => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
          }, 100);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
          setTimeout(() => {
            const rect = container.getBoundingClientRect();
            setDimensions({ width: rect.width, height: Math.min(400, rect.height) });
          }, 100);
        });
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className={cn("relative flex flex-col gap-2", className, isFullscreen && "fixed inset-0 z-50 bg-background")}>
      <div 
        ref={containerRef}
        className={cn(
          "relative border-2 border-dashed border-border bg-background/50 overflow-hidden",
          isFullscreen ? "w-full h-full border-0" : "min-h-[300px]"
        )}
      >
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="block w-full"
          style={{ imageRendering: "pixelated" }}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        >

          <rect
            width={dimensions.width}
            height={dimensions.height}
            fill="var(--background)"
          />
          
          <line
            x1={dimensions.width / 2}
            y1={0}
            x2={dimensions.width / 2}
            y2={dimensions.height}
            stroke="var(--border)"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
          
          <rect
            x={0}
            y={dimensions.height / 2 - 40}
            width={20}
            height={80}
            fill="var(--primary)"
            opacity="0.3"
          />
          
          <rect
            x={dimensions.width - 20}
            y={dimensions.height / 2 - 40}
            width={20}
            height={80}
            fill="var(--primary)"
            opacity="0.3"
          />
          
          <PixelHollowCircle
            cx={gameState.playerPaddle.x}
            cy={gameState.playerPaddle.y}
            radius={gameState.playerPaddle.radius}
            color="var(--primary)"
          />
          
          <PixelHollowCircle
            cx={gameState.aiPaddle.x}
            cy={gameState.aiPaddle.y}
            radius={gameState.aiPaddle.radius}
            color="var(--primary)"
          />
          
          <PixelSolidCircle
            cx={gameState.puck.x}
            cy={gameState.puck.y}
            radius={gameState.puck.radius}
            color="var(--foreground)"
          />
          
          <text
            x={dimensions.width / 4}
            y={30}
            fill="var(--foreground)"
            fontSize="16"
            fontFamily="var(--font-kongtext)"
            textAnchor="middle"
            className="retro"
          >
            {score.player}
          </text>
          
          <text
            x={(dimensions.width / 4) * 3}
            y={30}
            fill="var(--foreground)"
            fontSize="16"
            fontFamily="var(--font-kongtext)"
            textAnchor="middle"
            className="retro"
          >
            {score.ai}
          </text>
        </svg>
        
        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <p className="retro text-lg uppercase tracking-widest text-primary">PAUSED</p>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 gap-4">
            <p className="retro text-xl uppercase tracking-widest text-primary">
              {score.player >= WINNING_SCORE ? "PLAYER WINS!" : "AI WINS!"}
            </p>
            <p className="retro text-sm uppercase tracking-wider text-muted-foreground">
              FINAL SCORE: {score.player} - {score.ai}
            </p>
            <Button
              onClick={resetGame}
              variant="outline"
              className="retro h-10 px-6 text-xs uppercase tracking-widest"
            >
              NEW GAME
            </Button>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => setIsPaused(!isPaused)}
          variant="outline"
          className="retro flex-1 h-8 text-xs uppercase tracking-widest"
        >
          {isPaused ? "RESUME" : "PAUSE"}
        </Button>
        <Button
          onClick={toggleFullscreen}
          variant="outline"
          className="retro flex-1 h-8 text-xs uppercase tracking-widest"
        >
          {isFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}
        </Button>
      </div>
    </div>
  );
}
