"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";

interface Segment {
  row: number;
  col: number;
}

type Direction = "up" | "down" | "left" | "right";

interface SnakeState {
  snake: Segment[];
  food: Segment;
  direction: Direction;
  queuedDirection: Direction;
  score: number;
  status: "idle" | "running" | "paused" | "lost" | "won";
}

const GRID_SIZE = 14;
const STORAGE_KEY = "snake-game-best-score";
const STARTING_SNAKE: Segment[] = [
  { row: 7, col: 4 },
  { row: 7, col: 3 },
  { row: 7, col: 2 },
];

function sameSegment(a: Segment, b: Segment) {
  return a.row === b.row && a.col === b.col;
}

function isOppositeDirection(current: Direction, next: Direction) {
  return (
    (current === "up" && next === "down") ||
    (current === "down" && next === "up") ||
    (current === "left" && next === "right") ||
    (current === "right" && next === "left")
  );
}

function spawnFood(snake: Segment[]) {
  const openCells: Segment[] = [];

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (!snake.some((segment) => segment.row === row && segment.col === col)) {
        openCells.push({ row, col });
      }
    }
  }

  return openCells[Math.floor(Math.random() * openCells.length)] ?? { row: 0, col: 0 };
}

const INITIAL_FOOD: Segment = { row: 3, col: 10 };

function getStartingState(): SnakeState {
  return {
    snake: STARTING_SNAKE,
    food: INITIAL_FOOD,
    direction: "right",
    queuedDirection: "right",
    score: 0,
    status: "idle",
  };
}

function getNextHead(head: Segment, direction: Direction) {
  if (direction === "up") {
    return { row: head.row - 1, col: head.col };
  }
  if (direction === "down") {
    return { row: head.row + 1, col: head.col };
  }
  if (direction === "left") {
    return { row: head.row, col: head.col - 1 };
  }

  return { row: head.row, col: head.col + 1 };
}

export function SnakeGame({
  className,
  isFullscreen = false,
}: {
  className?: string;
  isFullscreen?: boolean;
}) {
  const [bestScore, setBestScore] = useState(0);
  const [game, setGame] = useState<SnakeState>(getStartingState);
  const bestScoreRef = useRef(0);

  useEffect(() => {
    const savedBest = localStorage.getItem(STORAGE_KEY);
    if (!savedBest) {
      return;
    }

    const parsed = Number(savedBest);
    if (!Number.isNaN(parsed)) {
      bestScoreRef.current = parsed;
      queueMicrotask(() => setBestScore(parsed));
    }
  }, []);

  useEffect(() => {
    if (bestScore !== bestScoreRef.current) {
      return;
    }

    bestScoreRef.current = bestScore;
    localStorage.setItem(STORAGE_KEY, String(bestScore));
  }, [bestScore]);

  const resetGame = useCallback(() => {
    setGame({ ...getStartingState(), food: spawnFood(STARTING_SNAKE) });
  }, []);

  const startGame = useCallback(() => {
    setGame((current) =>
      current.status === "running"
        ? current
        : { ...getStartingState(), food: spawnFood(STARTING_SNAKE), status: "running" }
    );
  }, []);

  const togglePause = useCallback(() => {
    setGame((current) => {
      if (current.status === "running") {
        return { ...current, status: "paused" };
      }
      if (current.status === "paused") {
        return { ...current, status: "running" };
      }

      return current;
    });
  }, []);

  const queueDirection = useCallback((direction: Direction) => {
    setGame((current) => {
      const baselineDirection =
        current.status === "running" ? current.queuedDirection : current.direction;

      if (
        current.snake.length > 1 &&
        isOppositeDirection(baselineDirection, direction)
      ) {
        return current;
      }

      return {
        ...current,
        queuedDirection: direction,
        status: current.status === "idle" ? "running" : current.status,
      };
    });
  }, []);

  const tick = useCallback(() => {
    setGame((current) => {
      if (current.status !== "running") {
        return current;
      }

      const nextDirection = current.queuedDirection;
      const nextHead = getNextHead(current.snake[0], nextDirection);
      const hitsWall =
        nextHead.row < 0 ||
        nextHead.row >= GRID_SIZE ||
        nextHead.col < 0 ||
        nextHead.col >= GRID_SIZE;

      if (hitsWall) {
        return { ...current, direction: nextDirection, status: "lost" };
      }

      const willEat = sameSegment(nextHead, current.food);
      const nextSnake = willEat
        ? [nextHead, ...current.snake]
        : [nextHead, ...current.snake.slice(0, -1)];
      const bitesSelf = nextSnake.slice(1).some((segment) => sameSegment(segment, nextHead));

      if (bitesSelf) {
        return { ...current, direction: nextDirection, status: "lost" };
      }

      const nextScore = willEat ? current.score + 1 : current.score;
      const hasFilledBoard = nextSnake.length === GRID_SIZE * GRID_SIZE;

      if (nextScore > bestScoreRef.current) {
        bestScoreRef.current = nextScore;
        queueMicrotask(() => setBestScore(nextScore));
      }

      return {
        snake: nextSnake,
        food: willEat && !hasFilledBoard ? spawnFood(nextSnake) : current.food,
        direction: nextDirection,
        queuedDirection: nextDirection,
        score: nextScore,
        status: hasFilledBoard ? "won" : current.status,
      };
    });
  }, []);

  useEffect(() => {
    if (game.status !== "running") {
      return;
    }

    const tickRate = Math.max(90, 170 - Math.floor(game.score / 2) * 8);
    const timer = window.setInterval(tick, tickRate);

    return () => {
      window.clearInterval(timer);
    };
  }, [game.score, game.status, tick]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
        queueDirection("up");
        event.preventDefault();
      }
      if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
        queueDirection("down");
        event.preventDefault();
      }
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        queueDirection("left");
        event.preventDefault();
      }
      if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        queueDirection("right");
        event.preventDefault();
      }
      if (event.code === "Space") {
        if (game.status === "idle" || game.status === "lost" || game.status === "won") {
          startGame();
        } else {
          togglePause();
        }
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [game.status, queueDirection, startGame, togglePause]);

  const snakeCells = new Set(game.snake.map((segment) => `${segment.row}-${segment.col}`));
  const headKey = `${game.snake[0].row}-${game.snake[0].col}`;
  const boardMaxWidth = isFullscreen ? "min(82vmin, 760px)" : "420px";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="grid gap-2 text-[10px] uppercase tracking-widest text-muted-foreground sm:grid-cols-3">
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          Score: {game.score}
        </div>
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          Best: {bestScore}
        </div>
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          {game.status === "idle"
            ? "Ready"
            : game.status === "running"
              ? "Running"
              : game.status === "paused"
                ? "Paused"
                : game.status === "won"
                  ? "Victory"
                  : "Crashed"}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={startGame}
          className="retro h-8 px-3 text-[10px] uppercase tracking-widest"
        >
          {game.status === "idle" ? "Start Run" : "Restart Run"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={togglePause}
          className="retro h-8 px-3 text-[10px] uppercase tracking-widest"
          disabled={game.status === "idle" || game.status === "lost" || game.status === "won"}
        >
          {game.status === "paused" ? "Resume" : "Pause"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={resetGame}
          className="retro h-8 px-3 text-[10px] uppercase tracking-widest"
        >
          Clear Grid
        </Button>
      </div>

      <div className="rounded border border-dashed border-border bg-background/50 p-3">
        <div
          className="mx-auto grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: "100%",
            maxWidth: boardMaxWidth,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
            const row = Math.floor(index / GRID_SIZE);
            const col = index % GRID_SIZE;
            const key = `${row}-${col}`;
            const isFood = game.food.row === row && game.food.col === col;
            const isHead = key === headKey;
            const isSnake = snakeCells.has(key);

            return (
              <div
                key={key}
                className={cn(
                  "aspect-square border border-border/30 bg-background/70",
                  isSnake && "bg-primary/70",
                  isHead && "bg-foreground",
                  isFood && "bg-rose-400"
                )}
              />
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:hidden">
        <div />
        <Button
          type="button"
          variant="outline"
          onClick={() => queueDirection("up")}
          className="retro h-10 text-lg"
        >
          ▲
        </Button>
        <div />
        <Button
          type="button"
          variant="outline"
          onClick={() => queueDirection("left")}
          className="retro h-10 text-lg"
        >
          ◀
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => queueDirection("down")}
          className="retro h-10 text-lg"
        >
          ▼
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => queueDirection("right")}
          className="retro h-10 text-lg"
        >
          ▶
        </Button>
      </div>

      <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
        Arrow keys or WASD steer the snake. Space starts, pauses, or resumes a run.
      </p>
    </div>
  );
}
