"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];

interface TicTacToeState {
  board: Board;
  currentPlayer: Player;
  statusText: string;
  winner: Player | "draw" | null;
  winLine: number[] | null;
}

function checkWinner(board: Board): { winner: Player | "draw"; line: number[] | null } | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }

  if (board.every(cell => cell !== null)) {
    return { winner: "draw", line: null };
  }

  return null;
}

function createInitialState(): TicTacToeState {
  return {
    board: Array(9).fill(null),
    currentPlayer: "X",
    statusText: "Your move. Claim the center first.",
    winner: null,
    winLine: null,
  };
}

function getCPUMove(board: Board): number | null {
  const available = board
    .map((cell, idx) => (cell === null ? idx : null))
    .filter((idx): idx is number => idx !== null);

  if (available.length === 0) return null;

  for (const idx of available) {
    const testBoard = [...board];
    testBoard[idx] = "O";
    if (checkWinner(testBoard)?.winner === "O") return idx;
  }

  for (const idx of available) {
    const testBoard = [...board];
    testBoard[idx] = "X";
    if (checkWinner(testBoard)?.winner === "X") return idx;
  }

  const corners = [0, 2, 6, 8].filter(idx => available.includes(idx));
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  if (available.includes(4)) return 4;

  const edges = [1, 3, 5, 7].filter(idx => available.includes(idx));
  if (edges.length > 0) {
    return edges[Math.floor(Math.random() * edges.length)];
  }

  return available[Math.floor(Math.random() * available.length)];
}

export function TicTacToeGame({
  className,
  isFullscreen = false,
}: {
  className?: string;
  isFullscreen?: boolean;
}) {
  const [game, setGame] = useState<TicTacToeState>(createInitialState);

  const resetGame = useCallback(() => {
    setGame(createInitialState());
  }, []);

  const handleCellClick = useCallback((index: number) => {
    setGame((current) => {
      if (current.board[index] !== null || current.winner !== null) {
        return current;
      }

      const newBoard = [...current.board];
      newBoard[index] = "X";

      const result = checkWinner(newBoard);
      if (result) {
        return {
          board: newBoard,
          currentPlayer: "X",
          statusText: result.winner === "draw"
            ? "It's a draw!"
            : `You win! X marks the spot!`,
          winner: result.winner === "draw" ? "draw" : "X",
          winLine: result.line,
        };
      }

      return {
        board: newBoard,
        currentPlayer: "O",
        statusText: "You played. CPU is thinking...",
        winner: null,
        winLine: null,
      };
    });
  }, []);

  useEffect(() => {
    if (game.currentPlayer !== "O" || game.winner !== null) return;

    const timeout = setTimeout(() => {
      const cpuMove = getCPUMove(game.board);
      if (cpuMove === null) return;

      setGame((current) => {
        if (current.winner !== null) return current;

        const newBoard = [...current.board];
        newBoard[cpuMove] = "O";

        const result = checkWinner(newBoard);
        if (result) {
          return {
            board: newBoard,
            currentPlayer: "O",
            statusText: result.winner === "draw"
              ? "It's a draw!"
              : `CPU wins! Better luck next time.`,
            winner: result.winner === "draw" ? "draw" : "O",
            winLine: result.line,
          };
        }

        return {
          board: newBoard,
          currentPlayer: "X",
          statusText: "CPU played. Your move.",
          winner: null,
          winLine: null,
        };
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [game.currentPlayer, game.winner, game.board]);

  const boardMaxWidth = isFullscreen ? "min(70vmin, 500px)" : "300px";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="grid gap-2 text-[10px] uppercase tracking-widest text-muted-foreground sm:grid-cols-3">
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          X: {game.board.filter(c => c === "X").length}
        </div>
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          O: {game.board.filter(c => c === "O").length}
        </div>
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          {game.winner
            ? game.winner === "draw"
              ? "Draw"
              : game.winner === "X"
                ? "You Win!"
                : "CPU Wins"
            : game.currentPlayer === "X"
              ? "Your Turn"
              : "CPU Turn"}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={resetGame}
          className="retro h-8 px-3 text-[10px] uppercase tracking-widest"
        >
          New Match
        </Button>
        <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
          {game.statusText}
        </p>
      </div>

      <div className="rounded border border-dashed border-border bg-background/50 p-3">
        <div
          className="mx-auto grid gap-1"
          style={{
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            width: "100%",
            maxWidth: boardMaxWidth,
          }}
        >
          {game.board.map((cell, index) => {
            const isWinningCell = game.winLine?.includes(index);

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleCellClick(index)}
                className={cn(
                  "flex aspect-square items-center justify-center border border-border bg-primary/10 transition-none",
                  cell === null && !game.winner && "hover:bg-primary/30",
                  isWinningCell && "bg-primary/40"
                )}
              >
                {cell && (
                  <span
                    className={cn(
                      "text-4xl font-bold",
                      cell === "X" ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {cell}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
        You play X. First to three in a row wins.
      </p>
    </div>
  );
}