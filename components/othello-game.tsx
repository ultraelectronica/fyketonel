"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";

type Disc = "black" | "white" | null;
type Player = Exclude<Disc, null>;
type Board = Disc[][];

interface OthelloMove {
  row: number;
  col: number;
  flips: Array<[number, number]>;
}

interface OthelloState {
  board: Board;
  currentPlayer: Player;
  statusText: string;
  result: string | null;
}

const BOARD_SIZE = 8;
const DIRECTIONS: Array<[number, number]> = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function getOpponent(player: Player): Player {
  return player === "black" ? "white" : "black";
}

function createStartingBoard(): Board {
  const board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null as Disc)
  );

  board[3][3] = "white";
  board[3][4] = "black";
  board[4][3] = "black";
  board[4][4] = "white";

  return board;
}

function countDiscs(board: Board) {
  return board.flat().reduce(
    (counts, disc) => {
      if (disc === "black") {
        counts.black += 1;
      }
      if (disc === "white") {
        counts.white += 1;
      }

      return counts;
    },
    { black: 0, white: 0 }
  );
}

function getValidMoves(board: Board, player: Player) {
  const opponent = getOpponent(player);
  const moves: OthelloMove[] = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (board[row][col] !== null) {
        continue;
      }

      const flips: Array<[number, number]> = [];

      DIRECTIONS.forEach(([rowDelta, colDelta]) => {
        const path: Array<[number, number]> = [];
        let nextRow = row + rowDelta;
        let nextCol = col + colDelta;

        while (
          nextRow >= 0 &&
          nextRow < BOARD_SIZE &&
          nextCol >= 0 &&
          nextCol < BOARD_SIZE &&
          board[nextRow][nextCol] === opponent
        ) {
          path.push([nextRow, nextCol]);
          nextRow += rowDelta;
          nextCol += colDelta;
        }

        if (
          path.length > 0 &&
          nextRow >= 0 &&
          nextRow < BOARD_SIZE &&
          nextCol >= 0 &&
          nextCol < BOARD_SIZE &&
          board[nextRow][nextCol] === player
        ) {
          flips.push(...path);
        }
      });

      if (flips.length > 0) {
        moves.push({ row, col, flips });
      }
    }
  }

  return moves;
}

function applyMove(board: Board, move: OthelloMove, player: Player) {
  const nextBoard = board.map((row) => [...row]);

  nextBoard[move.row][move.col] = player;
  move.flips.forEach(([row, col]) => {
    nextBoard[row][col] = player;
  });

  return nextBoard;
}

function toBoardNotation(row: number, col: number) {
  return `${String.fromCharCode(65 + col)}${row + 1}`;
}

function buildResultText(board: Board) {
  const counts = countDiscs(board);
  if (counts.black === counts.white) {
    return `Draw game. Final score ${counts.black}-${counts.white}.`;
  }

  return counts.black > counts.white
    ? `You win ${counts.black}-${counts.white}.`
    : `CPU wins ${counts.white}-${counts.black}.`;
}

function resolveNextState(
  board: Board,
  requestedPlayer: Player,
  turnMessage: string
): OthelloState {
  const requestedMoves = getValidMoves(board, requestedPlayer);
  if (requestedMoves.length > 0) {
    return {
      board,
      currentPlayer: requestedPlayer,
      statusText: turnMessage,
      result: null,
    };
  }

  const fallbackPlayer = getOpponent(requestedPlayer);
  const fallbackMoves = getValidMoves(board, fallbackPlayer);
  if (fallbackMoves.length > 0) {
    return {
      board,
      currentPlayer: fallbackPlayer,
      statusText:
        requestedPlayer === "white"
          ? "CPU has no moves. Your turn again."
          : "No legal move. CPU keeps the turn.",
      result: null,
    };
  }

  const resultText = buildResultText(board);

  return {
    board,
    currentPlayer: "black",
    statusText: resultText,
    result: resultText,
  };
}

function createOpeningState(): OthelloState {
  return {
    board: createStartingBoard(),
    currentPlayer: "black",
    statusText: "Your move. Claim corners and starve the CPU.",
    result: null,
  };
}

function scoreMove(board: Board, move: OthelloMove, player: Player) {
  const corners = new Set(["0-0", "0-7", "7-0", "7-7"]);
  const dangerSquares = new Set([
    "0-1",
    "1-0",
    "1-1",
    "0-6",
    "1-6",
    "1-7",
    "6-0",
    "6-1",
    "7-1",
    "6-6",
    "6-7",
    "7-6",
  ]);
  const moveKey = `${move.row}-${move.col}`;
  const nextBoard = applyMove(board, move, player);
  const playerMoves = getValidMoves(nextBoard, player).length;
  const opponentMoves = getValidMoves(nextBoard, getOpponent(player)).length;
  const isEdge = move.row === 0 || move.row === 7 || move.col === 0 || move.col === 7;

  let score = move.flips.length * 7;
  if (corners.has(moveKey)) {
    score += 150;
  }
  if (isEdge) {
    score += 18;
  }
  if (dangerSquares.has(moveKey)) {
    score -= 35;
  }

  score += playerMoves * 3;
  score -= opponentMoves * 4;

  return score;
}

function chooseBestMove(board: Board, player: Player) {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) {
    return null;
  }

  return moves.reduce((bestMove, currentMove) => {
    if (!bestMove) {
      return currentMove;
    }

    return scoreMove(board, currentMove, player) > scoreMove(board, bestMove, player)
      ? currentMove
      : bestMove;
  }, null as OthelloMove | null);
}

export function OthelloGame({
  className,
  isFullscreen = false,
}: {
  className?: string;
  isFullscreen?: boolean;
}) {
  const [game, setGame] = useState<OthelloState>(createOpeningState);

  const humanMoves = getValidMoves(game.board, "black");
  const moveLookup = new Set(humanMoves.map((move) => `${move.row}-${move.col}`));
  const counts = countDiscs(game.board);
  const boardMaxWidth = isFullscreen ? "min(82vmin, 760px)" : "420px";

  const resetGame = useCallback(() => {
    setGame(createOpeningState());
  }, []);

  const handleMove = useCallback((row: number, col: number) => {
    setGame((current) => {
      if (current.result || current.currentPlayer !== "black") {
        return current;
      }

      const move = getValidMoves(current.board, "black").find(
        (candidate) => candidate.row === row && candidate.col === col
      );
      if (!move) {
        return current;
      }

      return resolveNextState(
        applyMove(current.board, move, "black"),
        "white",
        `You played ${toBoardNotation(row, col)}. CPU is thinking.`
      );
    });
  }, []);

  useEffect(() => {
    if (game.result || game.currentPlayer !== "white") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setGame((current) => {
        if (current.result || current.currentPlayer !== "white") {
          return current;
        }

        const move = chooseBestMove(current.board, "white");
        if (!move) {
          return resolveNextState(current.board, "black", "CPU passes. Your turn.");
        }

        return resolveNextState(
          applyMove(current.board, move, "white"),
          "black",
          `CPU played ${toBoardNotation(move.row, move.col)}. Your move.`
        );
      });
    }, 500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [game.currentPlayer, game.result]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="grid gap-2 text-[10px] uppercase tracking-widest text-muted-foreground sm:grid-cols-3">
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          Black: {counts.black}
        </div>
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          White: {counts.white}
        </div>
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          {game.result
            ? "Match Over"
            : game.currentPlayer === "black"
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
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            width: "100%",
            maxWidth: boardMaxWidth,
          }}
        >
          {game.board.map((boardRow, rowIndex) =>
            boardRow.map((cell, colIndex) => {
              const isPlayable =
                game.currentPlayer === "black" && moveLookup.has(`${rowIndex}-${colIndex}`);

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  type="button"
                  onClick={() => handleMove(rowIndex, colIndex)}
                  className={cn(
                    "flex aspect-square items-center justify-center border border-border bg-primary/10 transition-none",
                    isPlayable && "bg-primary/20 hover:bg-primary/30"
                  )}
                >
                  {cell ? (
                    <span
                      className={cn(
                        "block h-4/5 w-4/5 rounded-full border-2 border-border",
                        cell === "black" ? "bg-foreground" : "bg-background"
                      )}
                    />
                  ) : isPlayable ? (
                    <span className="block h-2 w-2 rounded-full bg-primary" />
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
        You play black. Secure corners, avoid feeding edges, and force the CPU to pass.
      </p>
    </div>
  );
}
