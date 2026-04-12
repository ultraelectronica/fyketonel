"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";

interface Cell {
  hasMine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacentMines: number;
}

interface DifficultyConfig {
  label: string;
  rows: number;
  cols: number;
  mines: number;
}

interface MinesweeperState {
  board: Cell[][];
  status: "ready" | "playing" | "won" | "lost";
  elapsed: number;
}

type DifficultyKey = "rookie" | "arcade" | "nightmare";
type ActionMode = "reveal" | "flag";

const DIFFICULTIES: Record<DifficultyKey, DifficultyConfig> = {
  rookie: { label: "Rookie", rows: 8, cols: 8, mines: 10 },
  arcade: { label: "Arcade", rows: 10, cols: 10, mines: 16 },
  nightmare: { label: "Nightmare", rows: 12, cols: 12, mines: 28 },
};

const NUMBER_COLOR_MAP: Record<number, string> = {
  1: "text-sky-400",
  2: "text-emerald-400",
  3: "text-rose-400",
  4: "text-violet-400",
  5: "text-amber-400",
  6: "text-cyan-400",
  7: "text-orange-400",
  8: "text-muted-foreground",
};

function createCell(): Cell {
  return {
    hasMine: false,
    revealed: false,
    flagged: false,
    adjacentMines: 0,
  };
}

function createEmptyBoard(rows: number, cols: number) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => createCell())
  );
}

function cloneBoard(board: Cell[][]) {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

function shuffle<T>(items: T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function getNeighborCoords(board: Cell[][], row: number, col: number) {
  const coords: Array<[number, number]> = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }

      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;
      if (
        nextRow >= 0 &&
        nextRow < board.length &&
        nextCol >= 0 &&
        nextCol < board[0].length
      ) {
        coords.push([nextRow, nextCol]);
      }
    }
  }

  return coords;
}

function seedBoard(
  rows: number,
  cols: number,
  mines: number,
  safeRow: number,
  safeCol: number
) {
  const board = createEmptyBoard(rows, cols);

  const protectedZone = new Set<string>();
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      const nextRow = safeRow + rowOffset;
      const nextCol = safeCol + colOffset;
      if (nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols) {
        protectedZone.add(`${nextRow}-${nextCol}`);
      }
    }
  }

  let candidates: Array<[number, number]> = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (!protectedZone.has(`${row}-${col}`)) {
        candidates.push([row, col]);
      }
    }
  }

  if (candidates.length < mines) {
    candidates = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        if (row !== safeRow || col !== safeCol) {
          candidates.push([row, col]);
        }
      }
    }
  }

  shuffle(candidates)
    .slice(0, mines)
    .forEach(([row, col]) => {
      board[row][col].hasMine = true;
    });

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      board[row][col].adjacentMines = getNeighborCoords(board, row, col).filter(
        ([neighborRow, neighborCol]) => board[neighborRow][neighborCol].hasMine
      ).length;
    }
  }

  return board;
}

function revealConnectedCells(board: Cell[][], startRow: number, startCol: number) {
  const queue: Array<[number, number]> = [[startRow, startCol]];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const [row, col] = queue.shift()!;
    const key = `${row}-${col}`;

    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    const cell = board[row][col];
    if (cell.flagged || cell.hasMine) {
      continue;
    }

    cell.revealed = true;
    if (cell.adjacentMines !== 0) {
      continue;
    }

    getNeighborCoords(board, row, col).forEach((coord) => {
      queue.push(coord);
    });
  }
}

function revealAllMines(board: Cell[][]) {
  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell.hasMine) {
        cell.revealed = true;
      }
    });
  });
}

function flagAllMines(board: Cell[][]) {
  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell.hasMine) {
        cell.flagged = true;
      }
    });
  });
}

function hasWon(board: Cell[][], mineCount: number) {
  const revealedSafeCells = board
    .flat()
    .filter((cell) => cell.revealed && !cell.hasMine).length;

  return revealedSafeCells === board.length * board[0].length - mineCount;
}

function createGameState(difficultyKey: DifficultyKey): MinesweeperState {
  const difficulty = DIFFICULTIES[difficultyKey];

  return {
    board: createEmptyBoard(difficulty.rows, difficulty.cols),
    status: "ready",
    elapsed: 0,
  };
}

export function MinesweeperGame({
  className,
  isFullscreen = false,
}: {
  className?: string;
  isFullscreen?: boolean;
}) {
  const [difficultyKey, setDifficultyKey] = useState<DifficultyKey>("arcade");
  const [flagMode, setFlagMode] = useState(false);
  const [game, setGame] = useState<MinesweeperState>(() => createGameState("arcade"));

  const difficulty = DIFFICULTIES[difficultyKey];
  const flaggedCount = game.board.flat().filter((cell) => cell.flagged).length;
  const mineCounter = Math.max(0, difficulty.mines - flaggedCount);

  const resetGame = useCallback(() => {
    setFlagMode(false);
    setGame(createGameState(difficultyKey));
  }, [difficultyKey]);

  const selectDifficulty = useCallback((nextDifficulty: DifficultyKey) => {
    setFlagMode(false);
    setDifficultyKey(nextDifficulty);
    setGame(createGameState(nextDifficulty));
  }, []);

  useEffect(() => {
    if (game.status !== "playing") {
      return;
    }

    const timer = window.setInterval(() => {
      setGame((current) =>
        current.status === "playing"
          ? { ...current, elapsed: current.elapsed + 1 }
          : current
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [game.status]);

  const handleCellAction = useCallback(
    (row: number, col: number, mode: ActionMode) => {
      setGame((current) => {
        if (current.status === "won" || current.status === "lost") {
          return current;
        }

        let nextBoard = cloneBoard(current.board);
        let nextStatus: MinesweeperState["status"] = current.status;

        if (mode === "reveal" && current.status === "ready") {
          nextBoard = seedBoard(
            difficulty.rows,
            difficulty.cols,
            difficulty.mines,
            row,
            col
          );
          nextStatus = "playing";
        }

        const cell = nextBoard[row][col];
        if (mode === "flag") {
          if (cell.revealed) {
            return current;
          }

          cell.flagged = !cell.flagged;
          return { ...current, board: nextBoard };
        }

        if (cell.flagged || cell.revealed) {
          return current;
        }

        if (cell.hasMine) {
          revealAllMines(nextBoard);
          return { ...current, board: nextBoard, status: "lost" };
        }

        revealConnectedCells(nextBoard, row, col);
        if (hasWon(nextBoard, difficulty.mines)) {
          flagAllMines(nextBoard);
          nextStatus = "won";
        }

        return {
          ...current,
          board: nextBoard,
          status: nextStatus,
        };
      });
    },
    [difficulty.cols, difficulty.mines, difficulty.rows]
  );

  const boardWidth = Math.min(440, difficulty.cols * 34);
  const boardMaxWidth = isFullscreen
    ? `min(82vmin, ${difficulty.cols * 56}px)`
    : `${boardWidth}px`;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {(Object.entries(DIFFICULTIES) as Array<[DifficultyKey, DifficultyConfig]>).map(
          ([key, config]) => (
            <Button
              key={key}
              type="button"
              variant={difficultyKey === key ? "default" : "outline"}
              onClick={() => selectDifficulty(key)}
              className="retro h-8 px-3 text-[10px] uppercase tracking-widest"
            >
              {config.label}
            </Button>
          )
        )}
      </div>

      <div className="grid gap-2 text-[10px] uppercase tracking-widest text-muted-foreground sm:grid-cols-3">
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          Mines: {mineCounter}
        </div>
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          Time: {game.elapsed}s
        </div>
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          {game.status === "won"
            ? "Board Cleared"
            : game.status === "lost"
              ? "Mine Triggered"
              : flagMode
                ? "Flag Mode"
                : "Reveal Mode"}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={resetGame}
          className="retro h-8 px-3 text-[10px] uppercase tracking-widest"
        >
          Reset Field
        </Button>
        <Button
          type="button"
          variant={flagMode ? "default" : "outline"}
          onClick={() => setFlagMode((current) => !current)}
          className="retro h-8 px-3 text-[10px] uppercase tracking-widest"
        >
          {flagMode ? "Flags Armed" : "Toggle Flags"}
        </Button>
      </div>

      <div className="rounded border border-dashed border-border bg-background/50 p-3">
        <div
          className="mx-auto grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${difficulty.cols}, minmax(0, 1fr))`,
            width: "100%",
            maxWidth: boardMaxWidth,
          }}
        >
          {game.board.map((boardRow, rowIndex) =>
            boardRow.map((cell, colIndex) => {
              const displayValue =
                cell.flagged && !cell.revealed
                  ? "F"
                  : cell.revealed && cell.hasMine
                    ? "*"
                    : cell.revealed && cell.adjacentMines > 0
                      ? String(cell.adjacentMines)
                      : "";

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  type="button"
                  onClick={() =>
                    handleCellAction(
                      rowIndex,
                      colIndex,
                      flagMode ? "flag" : "reveal"
                    )
                  }
                  onContextMenu={(event) => {
                    event.preventDefault();
                    handleCellAction(rowIndex, colIndex, "flag");
                  }}
                  className={cn(
                    "retro aspect-square w-full border transition-none",
                    isFullscreen ? "text-sm" : "text-xs",
                    cell.revealed
                      ? "border-border bg-background text-foreground"
                      : "border-border bg-muted/70 text-muted-foreground hover:bg-primary/10",
                    cell.revealed && cell.hasMine && "bg-destructive/15 text-destructive",
                    cell.flagged && !cell.revealed && "text-amber-300"
                  )}
                >
                  <span
                    className={cn(
                      cell.revealed && cell.adjacentMines > 0
                        ? NUMBER_COLOR_MAP[cell.adjacentMines]
                        : ""
                    )}
                  >
                    {displayValue}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
        Tap to reveal. Right-click or flag mode marks mines before they mark you.
      </p>
    </div>
  );
}
