"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";

// score shape
interface GameScore {
  player: number;
  ai: number;
}

// paddle/puck shape
interface Paddle {
  x: number;
  y: number;
  radius: number;
}

interface Puck {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
}

interface VisualGameState {
  playerPaddle: Paddle;
  aiPaddle: Paddle;
  puck: Puck;
}

interface InternalGameState {
  playerPaddle: Paddle;
  aiPaddle: Paddle;
  puck: Puck;
  keys: { up: boolean; down: boolean; left: boolean; right: boolean };
  // -1 means no touch active, otherwise the target in game coords
  touchTargetY: number;
  touchTargetX: number;
  lastTime: number;
}

// pixel data for hollow circle outline
interface PixelCircleProps {
  cx: number;
  cy: number;
  radius: number;
  color: string;
}

// pixel data for solid filled circle
interface PixelSolidCircleProps {
  cx: number;
  cy: number;
  radius: number;
  color: string;
}

const STORAGE_KEY = "hockey-game-score";
const WINNING_SCORE = 6;

// draws an 8-bit hollow circle from pixel coords
function PixelHollowCircle({ cx, cy, radius, color }: PixelCircleProps) {
  const s = radius / 5;
  const pixels: [number, number][] = [
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

// draws an 8-bit solid circle row by row
function PixelSolidCircle({ cx, cy, radius, color }: PixelSolidCircleProps) {
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
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // tracks whether the player has started the game
  const [hasStarted, setHasStarted] = useState(false);
  // blink toggle for the "PRESS START" text
  const [blinkVisible, setBlinkVisible] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });
  const [gameState, setGameState] = useState<VisualGameState>({
    playerPaddle: { x: 0, y: 0, radius: 20 },
    aiPaddle: { x: 0, y: 0, radius: 20 },
    puck: { x: 0, y: 0, radius: 8, vx: 0, vy: 0 },
  });

  // Initial score must be deterministic for SSR (no localStorage on server).
  const [score, setScore] = useState<GameScore>({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef<GameScore>({ player: 0, ai: 0 });
  const gameOverRef = useRef(false);

  // After mount, sync score from localStorage so client matches saved state (avoids hydration mismatch).
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GameScore;
        scoreRef.current = parsed;
        queueMicrotask(() => setScore(parsed));
      } catch {
        /* ignore invalid saved data */
      }
    }
  }, []);
  
  const gameStateRef = useRef<InternalGameState>({
    playerPaddle: { x: 0, y: 0, radius: 20 },
    aiPaddle: { x: 0, y: 0, radius: 20 },
    puck: { x: 0, y: 0, radius: 8, vx: 0, vy: 0 },
    keys: { up: false, down: false, left: false, right: false },
    touchTargetY: -1,
    touchTargetX: -1,
    lastTime: 0,
  });

  // convert screen touch to game coordinates
  const screenToGameY = useCallback((screenY: number): number => {
    const svg = svgRef.current;
    if (!svg) return -1;
    const rect = svg.getBoundingClientRect();
    const ratio = dimensions.height / rect.height;
    return (screenY - rect.top) * ratio;
  }, [dimensions.height]);

  const screenToGameX = useCallback((screenX: number): number => {
    const svg = svgRef.current;
    if (!svg) return -1;
    const rect = svg.getBoundingClientRect();
    const ratio = dimensions.width / rect.width;
    return (screenX - rect.left) * ratio;
  }, [dimensions.width]);

  // touch handlers for direct paddle control on the game field
  const handleTouchStart = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    gameStateRef.current.touchTargetY = screenToGameY(touch.clientY);
    gameStateRef.current.touchTargetX = screenToGameX(touch.clientX);
  }, [screenToGameY, screenToGameX]);

  const handleTouchMove = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    gameStateRef.current.touchTargetY = screenToGameY(touch.clientY);
    gameStateRef.current.touchTargetX = screenToGameX(touch.clientX);
  }, [screenToGameY, screenToGameX]);

  const handleTouchEnd = useCallback(() => {
    gameStateRef.current.touchTargetY = -1;
    gameStateRef.current.touchTargetX = -1;
  }, []);

  // blink the start screen text every 600ms
  useEffect(() => {
    if (hasStarted) return;
    const interval = setInterval(() => {
      setBlinkVisible((prev) => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, [hasStarted]);

  // save score to localStorage and ref
  const saveScore = useCallback((newScore: GameScore) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newScore));
    scoreRef.current = newScore;
  }, []);

  // update score, check for win condition
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

  // speed scaling based on viewport diagonal
  const baseDiagonal = Math.sqrt(400 * 400 + 300 * 300);
  const currentDiagonal = Math.sqrt(dimensions.width * dimensions.width + dimensions.height * dimensions.height);
  const speedScale = Math.min(1.8, Math.max(1, currentDiagonal / baseDiagonal));

  // reset positions and launch puck
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

  // full reset: score, flags, positions
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

  // start the game from the title screen
  const startGame = useCallback(() => {
    setHasStarted(true);
    setIsPaused(false);
    resetGame();
  }, [resetGame]);

  // keyboard input handlers
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      gameStateRef.current.keys.up = true;
      e.preventDefault();
    }
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      gameStateRef.current.keys.down = true;
      e.preventDefault();
    }
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      gameStateRef.current.keys.left = true;
      e.preventDefault();
    }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      gameStateRef.current.keys.right = true;
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
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      gameStateRef.current.keys.left = false;
    }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      gameStateRef.current.keys.right = false;
    }
  }, []);

  // main physics tick
  const update = useCallback(() => {
    const state = gameStateRef.current;
    const paddleSpeed = 6 * speedScale;
    const paddleMargin = 30 * speedScale;
    const playerMinX = paddleMargin;
    const playerMaxX = dimensions.width / 2 - paddleMargin;

    // move player paddle via keyboard (vertical)
    if (state.keys.up && state.playerPaddle.y - state.playerPaddle.radius > 0) {
      state.playerPaddle.y -= paddleSpeed;
    }
    if (state.keys.down && state.playerPaddle.y + state.playerPaddle.radius < dimensions.height) {
      state.playerPaddle.y += paddleSpeed;
    }

    // move player paddle via keyboard (horizontal)
    if (state.keys.left && state.playerPaddle.x - state.playerPaddle.radius > playerMinX) {
      state.playerPaddle.x -= paddleSpeed;
    }
    if (state.keys.right && state.playerPaddle.x + state.playerPaddle.radius < playerMaxX) {
      state.playerPaddle.x += paddleSpeed;
    }

    // move player paddle via touch (overrides keyboard for position)
    if (state.touchTargetY >= 0 || state.touchTargetX >= 0) {
      if (state.touchTargetY >= 0) {
        const clampedY = Math.max(
          state.playerPaddle.radius,
          Math.min(dimensions.height - state.playerPaddle.radius, state.touchTargetY)
        );
        state.playerPaddle.y += (clampedY - state.playerPaddle.y) * 0.3;
      }
      if (state.touchTargetX >= 0) {
        const clampedX = Math.max(
          playerMinX + state.playerPaddle.radius,
          Math.min(playerMaxX - state.playerPaddle.radius, state.touchTargetX)
        );
        state.playerPaddle.x += (clampedX - state.playerPaddle.x) * 0.3;
      }
    }
    
    // dumb AI: chase the puck
    const aiCenter = state.aiPaddle.y;
    const puckY = state.puck.y;
    const aiSpeed = 5 * speedScale;
    
    if (aiCenter < puckY - 5) {
      state.aiPaddle.y = Math.min(dimensions.height - state.aiPaddle.radius, state.aiPaddle.y + aiSpeed);
    } else if (aiCenter > puckY + 5) {
      state.aiPaddle.y = Math.max(state.aiPaddle.radius, state.aiPaddle.y - aiSpeed);
    }
    
    // move puck
    state.puck.x += state.puck.vx;
    state.puck.y += state.puck.vy;
    
    // bounce off top/bottom walls
    if (state.puck.y - state.puck.radius <= 0 || state.puck.y + state.puck.radius >= dimensions.height) {
      state.puck.vy = -state.puck.vy;
    }
    
    // player paddle collision
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
    
    // AI paddle collision
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
    
    // puck went off left edge: AI scores
    if (state.puck.x < 0) {
      if (gameOverRef.current) return;
      const newScore = { player: scoreRef.current.player, ai: scoreRef.current.ai + 1 };
      updateScore(newScore);
      initGame();
      return;
    }
    // puck went off right edge: player scores
    if (state.puck.x > dimensions.width) {
      if (gameOverRef.current) return;
      const newScore = { player: scoreRef.current.player + 1, ai: scoreRef.current.ai };
      updateScore(newScore);
      initGame();
      return;
    }
    
    // push state for render
    setGameState({
      playerPaddle: { ...state.playerPaddle },
      aiPaddle: { ...state.aiPaddle },
      puck: { ...state.puck },
    });
  }, [dimensions, initGame, updateScore, speedScale]);

  // resize handler
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

  // re-init when dimensions change
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    initGame();
  }, [dimensions, initGame]);

  // game loop: runs every frame, skips update if paused/over/not started
  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      if (!hasStarted || isPaused || gameOver || dimensions.width === 0 || dimensions.height === 0) {
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
  }, [handleKeyDown, handleKeyUp, update, isPaused, gameOver, dimensions, hasStarted]);

  // fullscreen toggle
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

  // sync fullscreen state if user exits via Escape
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
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="block w-full touch-none"
          style={{ imageRendering: "pixelated" }}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >

          <rect
            width={dimensions.width}
            height={dimensions.height}
            fill="var(--background)"
          />
          
          {/* center divider */}
          <line
            x1={dimensions.width / 2}
            y1={0}
            x2={dimensions.width / 2}
            y2={dimensions.height}
            stroke="var(--border)"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
          
          {/* left goal zone */}
          <rect
            x={0}
            y={dimensions.height / 2 - 40}
            width={20}
            height={80}
            fill="var(--primary)"
            opacity="0.3"
          />
          
          {/* right goal zone */}
          <rect
            x={dimensions.width - 20}
            y={dimensions.height / 2 - 40}
            width={20}
            height={80}
            fill="var(--primary)"
            opacity="0.3"
          />
          
          {/* player paddle */}
          <PixelHollowCircle
            cx={gameState.playerPaddle.x}
            cy={gameState.playerPaddle.y}
            radius={gameState.playerPaddle.radius}
            color="var(--primary)"
          />
          
          {/* AI paddle */}
          <PixelHollowCircle
            cx={gameState.aiPaddle.x}
            cy={gameState.aiPaddle.y}
            radius={gameState.aiPaddle.radius}
            color="var(--primary)"
          />
          
          {/* puck */}
          <PixelSolidCircle
            cx={gameState.puck.x}
            cy={gameState.puck.y}
            radius={gameState.puck.radius}
            color="var(--foreground)"
          />
          
          {/* player score */}
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
          
          {/* AI score */}
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
        
        {/* starting screen overlay */}
        {!hasStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 gap-6">
            <p className="retro text-xl uppercase tracking-widest text-primary">
              AIR HOCKEY
            </p>
            <div className="flex flex-col items-center gap-2">
              <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
                W / ↑ &nbsp; MOVE UP &nbsp; · &nbsp; S / ↓ &nbsp; MOVE DOWN
              </p>
              <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
                A / ← &nbsp; MOVE LEFT &nbsp; · &nbsp; D / → &nbsp; MOVE RIGHT
              </p>
              <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                TOUCH / DRAG ON MOBILE
              </p>
            </div>
            <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
              FIRST TO {WINNING_SCORE} WINS
            </p>
            {blinkVisible && (
              <p className="retro text-sm uppercase tracking-widest text-primary">
                PRESS START
              </p>
            )}
            {!blinkVisible && (
              <p className="retro text-sm uppercase tracking-widest text-primary invisible">
                PRESS START
              </p>
            )}
            <Button
              onClick={startGame}
              variant="outline"
              className="retro h-10 px-8 text-xs uppercase tracking-widest"
            >
              START
            </Button>
          </div>
        )}

        {/* pause overlay */}
        {hasStarted && isPaused && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <p className="retro text-lg uppercase tracking-widest text-primary">PAUSED</p>
          </div>
        )}

        {/* game over overlay */}
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

      {/* bottom controls: only show after game starts */}
      {hasStarted && (
        <div className="flex flex-col gap-2">
          {/* mobile D-pad: up/down and left/right buttons */}
          <div className="flex flex-col gap-2 sm:hidden">
            <div className="flex gap-2 justify-center">
              <Button
                onTouchStart={() => { gameStateRef.current.keys.up = true; }}
                onTouchEnd={() => { gameStateRef.current.keys.up = false; }}
                onMouseDown={() => { gameStateRef.current.keys.up = true; }}
                onMouseUp={() => { gameStateRef.current.keys.up = false; }}
                onMouseLeave={() => { gameStateRef.current.keys.up = false; }}
                variant="outline"
                className="retro w-14 h-12 text-lg uppercase tracking-widest select-none"
              >
                ▲
              </Button>
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                onTouchStart={() => { gameStateRef.current.keys.left = true; }}
                onTouchEnd={() => { gameStateRef.current.keys.left = false; }}
                onMouseDown={() => { gameStateRef.current.keys.left = true; }}
                onMouseUp={() => { gameStateRef.current.keys.left = false; }}
                onMouseLeave={() => { gameStateRef.current.keys.left = false; }}
                variant="outline"
                className="retro flex-1 h-12 text-lg uppercase tracking-widest select-none"
              >
                ◀
              </Button>
              <Button
                onTouchStart={() => { gameStateRef.current.keys.right = true; }}
                onTouchEnd={() => { gameStateRef.current.keys.right = false; }}
                onMouseDown={() => { gameStateRef.current.keys.right = true; }}
                onMouseUp={() => { gameStateRef.current.keys.right = false; }}
                onMouseLeave={() => { gameStateRef.current.keys.right = false; }}
                variant="outline"
                className="retro flex-1 h-12 text-lg uppercase tracking-widest select-none"
              >
                ▶
              </Button>
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                onTouchStart={() => { gameStateRef.current.keys.down = true; }}
                onTouchEnd={() => { gameStateRef.current.keys.down = false; }}
                onMouseDown={() => { gameStateRef.current.keys.down = true; }}
                onMouseUp={() => { gameStateRef.current.keys.down = false; }}
                onMouseLeave={() => { gameStateRef.current.keys.down = false; }}
                variant="outline"
                className="retro w-14 h-12 text-lg uppercase tracking-widest select-none"
              >
                ▼
              </Button>
            </div>
          </div>
          {/* pause + fullscreen row */}
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
      )}
    </div>
  );
}
