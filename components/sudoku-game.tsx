"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";

type Cell = number | null;
type Board = Cell[][];

type GridSize = 4 | 6 | 9;

interface GridConfig {
  size: GridSize;
  boxRows: number;
  boxCols: number;
  maxNum: number;
  label: string;
}

const GRID_CONFIGS: Record<GridSize, GridConfig> = {
  4: { size: 4, boxRows: 2, boxCols: 2, maxNum: 4, label: "4x4" },
  6: { size: 6, boxRows: 2, boxCols: 3, maxNum: 6, label: "6x6" },
  9: { size: 9, boxRows: 3, boxCols: 3, maxNum: 9, label: "9x9" },
};

interface SudokuState {
  board: Board;
  solution: Board;
  selectedCell: [number, number] | null;
  statusText: string;
  isComplete: boolean;
  isError: boolean;
}

function createEmptyBoard(size: number): Board {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null as Cell)
  );
}

function isValidPlacement(board: Board, row: number, col: number, num: number, config: GridConfig): boolean {
  for (let c = 0; c < config.size; c++) {
    if (board[row][c] === num) return false;
  }

  for (let r = 0; r < config.size; r++) {
    if (board[r][col] === num) return false;
  }

  const boxRow = Math.floor(row / config.boxRows) * config.boxRows;
  const boxCol = Math.floor(col / config.boxCols) * config.boxCols;
  for (let r = boxRow; r < boxRow + config.boxRows; r++) {
    for (let c = boxCol; c < boxCol + config.boxCols; c++) {
      if (board[r][c] === num) return false;
    }
  }

  return true;
}

function solveSudoku(board: Board, config: GridConfig): Board | null {
  const copy = board.map(row => [...row]);

  const solve = (): boolean => {
    for (let row = 0; row < config.size; row++) {
      for (let col = 0; col < config.size; col++) {
        if (copy[row][col] === null) {
          const nums = Array.from({ length: config.maxNum }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
          for (const num of nums) {
            if (isValidPlacement(copy, row, col, num, config)) {
              copy[row][col] = num;
              if (solve()) return true;
              copy[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  return solve() ? copy : null;
}

function generateSudoku(config: GridConfig, difficulty: number): { puzzle: Board; solution: Board } | null {
  const solution = solveSudoku(createEmptyBoard(config.size), config);
  if (!solution) return null;

  const puzzle = solution.map(row => [...row]);
  const totalCells = config.size * config.size;
  const cellsToRemove = difficulty === 1 ? Math.floor(totalCells * 0.35) : difficulty === 2 ? Math.floor(totalCells * 0.5) : Math.floor(totalCells * 0.65);

  const positions: [number, number][] = [];
  for (let r = 0; r < config.size; r++) {
    for (let c = 0; c < config.size; c++) {
      positions.push([r, c]);
    }
  }

  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
    const [r, c] = positions[i];
    puzzle[r][c] = null;
  }

  return { puzzle, solution };
}

function checkComplete(board: Board, config: GridConfig): boolean {
  for (let r = 0; r < config.size; r++) {
    for (let c = 0; c < config.size; c++) {
      if (board[r][c] === null) return false;
    }
  }
  return true;
}

function createInitialState(config: GridConfig): SudokuState {
  const generated = generateSudoku(config, 2);
  return {
    board: generated?.puzzle ?? createEmptyBoard(config.size),
    solution: generated?.solution ?? createEmptyBoard(config.size),
    selectedCell: null,
    statusText: "Select a cell and tap a number to place it.",
    isComplete: false,
    isError: false,
  };
}

export function SudokuGame({
  className,
  isFullscreen = false,
}: {
  className?: string;
  isFullscreen?: boolean;
}) {
  const [game, setGame] = useState<SudokuState>(() => createInitialState(GRID_CONFIGS[9]));
  const [difficulty] = useState<1 | 2 | 3>(2);
  const [gridSize, setGridSize] = useState<GridSize>(9);

  const config = GRID_CONFIGS[gridSize];

  const resetGame = useCallback((newDifficulty?: 1 | 2 | 3, newSize?: GridSize) => {
    const diff = newDifficulty ?? difficulty;
    const size = newSize ?? gridSize;
    const cfg = GRID_CONFIGS[size];
    const generated = generateSudoku(cfg, diff);
    setGame({
      board: generated?.puzzle ?? createEmptyBoard(cfg.size),
      solution: generated?.solution ?? createEmptyBoard(cfg.size),
      selectedCell: null,
      statusText: "Select a cell and tap a number to place it.",
      isComplete: false,
      isError: false,
    });
  }, [difficulty, gridSize]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (game.isComplete) return;
    setGame(current => ({
      ...current,
      selectedCell: [row, col],
      isError: false,
    }));
  }, [game.isComplete]);

  const handleNumberClick = useCallback((num: number) => {
    if (!game.selectedCell || game.isComplete) return;

    const [row, col] = game.selectedCell;
    if (game.board[row][col] !== null) return;

    setGame(current => {
      const newBoard = current.board.map(r => [...r]);
      newBoard[row][col] = num;

      const isCorrect = current.solution[row][col] === num;
      if (!isCorrect) {
        return {
          ...current,
          board: newBoard,
          statusText: `Incorrect. ${num} doesn't belong there.`,
          isError: true,
        };
      }

      const complete = checkComplete(newBoard, config);
      return {
        ...current,
        board: newBoard,
        statusText: complete
          ? "Puzzle solved! You're a Sudoku master!"
          : "Correct! Keep going.",
        isComplete: complete,
        isError: false,
      };
    });
  }, [game.selectedCell, game.isComplete, game.board, config]);

  const handleClear = useCallback(() => {
    if (!game.selectedCell || game.isComplete) return;

    const [row, col] = game.selectedCell;
    if (game.board[row][col] !== null) return;

    setGame(current => ({
      ...current,
      statusText: "Cell cleared. Select a number to place.",
    }));
  }, [game.selectedCell, game.isComplete, game.board]);

  const boardMaxWidth = isFullscreen ? "min(80vmin, 600px)" : "380px";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="grid gap-2 text-[10px] uppercase tracking-widest text-muted-foreground sm:grid-cols-2">
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          {config.label} - {difficulty === 1 ? "Easy" : difficulty === 2 ? "Medium" : "Hard"}
        </div>
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          {game.isComplete ? "Solved!" : "In Progress"}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => resetGame(difficulty, gridSize)}
          className="retro h-8 px-3 text-[10px] uppercase tracking-widest"
        >
          New Puzzle
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setGridSize(4);
            resetGame(2, 4);
          }}
          className={cn(
            "retro h-8 px-3 text-[10px] uppercase tracking-widest",
            gridSize === 4 && "bg-primary/20"
          )}
        >
          4x4
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setGridSize(6);
            resetGame(2, 6);
          }}
          className={cn(
            "retro h-8 px-3 text-[10px] uppercase tracking-widest",
            gridSize === 6 && "bg-primary/20"
          )}
        >
          6x6
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setGridSize(9);
            resetGame(2, 9);
          }}
          className={cn(
            "retro h-8 px-3 text-[10px] uppercase tracking-widest",
            gridSize === 9 && "bg-primary/20"
          )}
        >
          9x9
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => resetGame(1, gridSize)}
          className={cn(
            "retro h-8 px-3 text-[10px] uppercase tracking-widest",
            difficulty === 1 && "bg-primary/20"
          )}
        >
          Easy
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => resetGame(2, gridSize)}
          className={cn(
            "retro h-8 px-3 text-[10px] uppercase tracking-widest",
            difficulty === 2 && "bg-primary/20"
          )}
        >
          Medium
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => resetGame(3, gridSize)}
          className={cn(
            "retro h-8 px-3 text-[10px] uppercase tracking-widest",
            difficulty === 3 && "bg-primary/20"
          )}
        >
          Hard
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
          {game.statusText}
        </p>
      </div>

      <div className="rounded border border-dashed border-border bg-background/50 p-2">
        <div
          className="mx-auto grid gap-px"
          style={{
            gridTemplateColumns: `repeat(${config.size}, minmax(0, 1fr))`,
            width: "100%",
            maxWidth: boardMaxWidth,
          }}
        >
          {game.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isSelected =
                game.selectedCell?.[0] === rowIndex &&
                game.selectedCell?.[1] === colIndex;
              const isGiven = cell !== null && game.solution[rowIndex][colIndex] === cell;
              const showError = isSelected && game.isError;

              const isTopBorder = rowIndex % config.boxRows === 0;
              const isLeftBorder = colIndex % config.boxCols === 0;
              const isRightBorder = (colIndex + 1) % config.boxCols === 0;
              const isBottomBorder = (rowIndex + 1) % config.boxRows === 0;

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  type="button"
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={cn(
                    "flex aspect-square items-center justify-center border border-border bg-primary/5 text-xs transition-none",
                    isTopBorder && "border-t-2 border-t-border",
                    isLeftBorder && "border-l-2 border-l-border",
                    isRightBorder && "border-r-2 border-r-border",
                    isBottomBorder && "border-b-2 border-b-border",
                    isSelected && "bg-primary/30",
                    showError && "bg-destructive/30",
                    cell !== null && !isGiven && "text-destructive"
                  )}
                >
                  {cell && <span className={cn(isGiven && "font-bold")}>{cell}</span>}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-1">
        {Array.from({ length: config.maxNum }, (_, i) => i + 1).map((num) => (
          <Button
            key={num}
            type="button"
            variant="outline"
            onClick={() => handleNumberClick(num)}
            className="retro h-10 w-10 text-sm uppercase"
          >
            {num}
          </Button>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleClear}
        className="retro h-8 px-3 text-[10px] uppercase tracking-widest"
      >
        Clear Selection
      </Button>

      <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
        Fill the grid so every row, column, and box contains 1-{config.maxNum}.
      </p>
    </div>
  );
}