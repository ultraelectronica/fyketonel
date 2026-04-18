"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChessGame } from "@/components/chess-game";
import { HockeyGame } from "@/components/hockey-game";
import { MinesweeperGame } from "@/components/minesweeper-game";
import { OthelloGame } from "@/components/othello-game";
import { SnakeGame } from "@/components/snake-game";
import { SudokuGame } from "@/components/sudoku-game";
import { TicTacToeGame } from "@/components/tictactoe-game";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";

type ArcadeGameId = "hockey" | "minesweeper" | "snake" | "othello" | "tictactoe" | "sudoku" | "chess";

const ARCADE_GAMES: Array<{
  id: ArcadeGameId;
  label: string;
  summary: string;
}> = [
  {
    id: "hockey",
    label: "Air Hockey",
    summary: "Fast paddle duels with direct pointer control and smarter rebounds.",
  },
  {
    id: "minesweeper",
    label: "Minesweeper",
    summary: "Scan the field, flag bombs, and clear the board without detonating.",
  },
  {
    id: "snake",
    label: "Snake",
    summary: "Feed the serpent, survive the walls, and chase a higher arcade score.",
  },
  {
    id: "othello",
    label: "Othello",
    summary: "Flip discs, lock down corners, and outmaneuver the CPU on an 8x8 board.",
  },
  {
    id: "tictactoe",
    label: "TicTacToe",
    summary: "Challenge the CPU in the classic X and O showdown.",
  },
  {
    id: "sudoku",
    label: "Sudoku",
    summary: "Fill the grid so every row, column, and box contains digits 1-9.",
  },
  {
    id: "chess",
    label: "Chess",
    summary: "Classic chess battle against the CPU. Checkmate to win.",
  },
];

export function ArcadeCenter({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeGame, setActiveGame] = useState<ArcadeGameId>("tictactoe");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const selectedGame =
    ARCADE_GAMES.find((game) => game.id === activeGame) ?? ARCADE_GAMES[0];
  const canFullscreen = activeGame !== "hockey" || isFullscreen;

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (!document.fullscreenElement) {
      if (!container.requestFullscreen) {
        return;
      }

      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
      return;
    }

    if (!document.exitFullscreen) {
      return;
    }

    document.exitFullscreen().then(() => {
      setIsFullscreen(false);
    });
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col gap-3",
        className,
        isFullscreen && "h-full min-h-screen bg-background p-4"
      )}
    >
      <div className="flex flex-wrap gap-2">
        {ARCADE_GAMES.map((game) => (
          <Button
            key={game.id}
            type="button"
            variant={game.id === activeGame ? "default" : "outline"}
            onClick={() => setActiveGame(game.id)}
            className="retro h-8 min-w-[110px] px-3 text-[10px] uppercase tracking-widest"
          >
            {game.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {canFullscreen && (
          <Button
            type="button"
            variant="outline"
            onClick={toggleFullscreen}
            className="retro h-8 px-3 text-[10px] uppercase tracking-widest"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
        )}
        {!canFullscreen && (
          <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
            Air Hockey already has its own fullscreen controls.
          </p>
        )}
      </div>

      <div className="rounded border border-dashed border-border bg-background/50 px-3 py-2">
        <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
          {selectedGame.summary}
        </p>
      </div>

      <div className={cn("min-h-[440px]", isFullscreen && "flex-1") }>
        {activeGame === "hockey" && <HockeyGame className="w-full" />}
        {activeGame === "minesweeper" && <MinesweeperGame isFullscreen={isFullscreen} />}
        {activeGame === "snake" && <SnakeGame isFullscreen={isFullscreen} />}
        {activeGame === "othello" && <OthelloGame isFullscreen={isFullscreen} />}
        {activeGame === "tictactoe" && <TicTacToeGame isFullscreen={isFullscreen} />}
        {activeGame === "sudoku" && <SudokuGame isFullscreen={isFullscreen} />}
        {activeGame === "chess" && <ChessGame isFullscreen={isFullscreen} />}
      </div>
    </div>
  );
}
