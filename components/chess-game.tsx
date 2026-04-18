"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";

type PieceType = "K" | "Q" | "R" | "B" | "N" | "P";
type PieceColor = "w" | "b";
type Piece = { type: PieceType; color: PieceColor } | null;
type Board = Piece[][];
type Player = PieceColor;

interface ChessMove {
  from: [number, number];
  to: [number, number];
  promotion?: PieceType;
}

interface ChessState {
  board: Board;
  currentPlayer: Player;
  statusText: string;
  selectedCell: [number, number] | null;
  validMoves: [number, number][];
  result: string | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  lastMove: { from: [number, number]; to: [number, number] } | null;
  promotionPending: { from: [number, number]; to: [number, number] } | null;
  moveHistory: Board[];
  halfMoveClock: number;
}

const PIECE_SYMBOLS: Record<string, string> = {
  "wK": "♔", "wQ": "♕", "wR": "♖", "wB": "♗", "wN": "♘", "wP": "♙",
  "bK": "♚", "bQ": "♛", "bR": "♜", "bB": "♝", "bN": "♞", "bP": "♟",
};

const PIECE_LETTERS: Record<PieceType, string> = {
  K: "K", Q: "Q", R: "R", B: "B", N: "N", P: "P",
};

const BOARD_SIZE = 8;

function createInitialBoard(): Board {
  const board: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null as Piece)
  );

  const backRank: PieceType[] = ["R", "N", "B", "Q", "K", "B", "N", "R"];

  for (let col = 0; col < BOARD_SIZE; col++) {
    board[0][col] = { type: backRank[col], color: "b" };
    board[1][col] = { type: "P", color: "b" };
    board[6][col] = { type: "P", color: "w" };
    board[7][col] = { type: backRank[col], color: "w" };
  }

  return board;
}

function copyBoard(board: Board): Board {
  return board.map(row => row.map(cell => cell ? { ...cell } : null));
}

function isEnemy(piece: Piece, color: Player): boolean {
  return piece !== null && piece.color !== color;
}

function isFriendly(piece: Piece, color: Player): boolean {
  return piece !== null && piece.color === color;
}

function getPawnMoves(board: Board, row: number, col: number, color: Player): [number, number][] {
  const moves: [number, number][] = [];
  const direction = color === "w" ? -1 : 1;
  const startRow = color === "w" ? 6 : 1;
  const newRow = row + direction;

  if (newRow >= 0 && newRow < BOARD_SIZE && board[newRow][col] === null) {
    moves.push([newRow, col]);
    if (row === startRow) {
      const doubleRow = row + 2 * direction;
      if (doubleRow >= 0 && doubleRow < BOARD_SIZE && board[doubleRow][col] === null) {
        moves.push([doubleRow, col]);
      }
    }
  }

  if (newRow >= 0 && newRow < BOARD_SIZE) {
    if (col + 1 < BOARD_SIZE && isEnemy(board[newRow][col + 1], color)) {
      moves.push([newRow, col + 1]);
    }
    if (col - 1 >= 0 && isEnemy(board[newRow][col - 1], color)) {
      moves.push([newRow, col - 1]);
    }
  }

  return moves;
}

function getKnightMoves(board: Board, row: number, col: number, color: Player): [number, number][] {
  const moves: [number, number][] = [];
  const deltas = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];

  for (const [dr, dc] of deltas) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
      if (!isFriendly(board[nr][nc], color)) {
        moves.push([nr, nc]);
      }
    }
  }

  return moves;
}

function getBishopMoves(board: Board, row: number, col: number, color: Player): [number, number][] {
  const moves: [number, number][] = [];
  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

  for (const [dr, dc] of directions) {
    let nr = row + dr;
    let nc = col + dc;
    while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
      if (isFriendly(board[nr][nc], color)) break;
      moves.push([nr, nc]);
      if (isEnemy(board[nr][nc], color)) break;
      nr += dr;
      nc += dc;
    }
  }

  return moves;
}

function getRookMoves(board: Board, row: number, col: number, color: Player): [number, number][] {
  const moves: [number, number][] = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  for (const [dr, dc] of directions) {
    let nr = row + dr;
    let nc = col + dc;
    while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
      if (isFriendly(board[nr][nc], color)) break;
      moves.push([nr, nc]);
      if (isEnemy(board[nr][nc], color)) break;
      nr += dr;
      nc += dc;
    }
  }

  return moves;
}

function getQueenMoves(board: Board, row: number, col: number, color: Player): [number, number][] {
  return [...getBishopMoves(board, row, col, color), ...getRookMoves(board, row, col, color)];
}

function getKingMoves(board: Board, row: number, col: number, color: Player): [number, number][] {
  const moves: [number, number][] = [];
  const deltas = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

  for (const [dr, dc] of deltas) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
      if (!isFriendly(board[nr][nc], color)) {
        moves.push([nr, nc]);
      }
    }
  }

  return moves;
}

function getPieceMoves(board: Board, row: number, col: number): [number, number][] {
  const piece = board[row][col];
  if (!piece) return [];

  const { type, color } = piece;

  switch (type) {
    case "P": return getPawnMoves(board, row, col, color);
    case "N": return getKnightMoves(board, row, col, color);
    case "B": return getBishopMoves(board, row, col, color);
    case "R": return getRookMoves(board, row, col, color);
    case "Q": return getQueenMoves(board, row, col, color);
    case "K": return getKingMoves(board, row, col, color);
    default: return [];
  }
}

function findKing(board: Board, color: Player): [number, number] | null {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece?.type === "K" && piece.color === color) {
        return [r, c];
      }
    }
  }
  return null;
}

function isSquareAttacked(board: Board, row: number, col: number, byColor: Player): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece && piece.color === byColor) {
        const moves = getPieceMoves(board, r, c);
        if (moves.some(([mr, mc]) => mr === row && mc === col)) {
          return true;
        }
      }
    }
  }
  return false;
}

function isInCheck(board: Board, color: Player): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const [kr, kc] = kingPos;
  return isSquareAttacked(board, kr, kc, color === "w" ? "b" : "w");
}

function isValidMove(board: Board, from: [number, number], to: [number, number], color: Player): boolean {
  const piece = board[from[0]][from[1]];
  if (!piece || piece.color !== color) return false;

  const moves = getPieceMoves(board, from[0], from[1]);
  if (!moves.some(([mr, mc]) => mr === to[0] && mc === to[1])) return false;

  const testBoard = copyBoard(board);
  testBoard[to[0]][to[1]] = piece;
  testBoard[from[0]][from[1]] = null;

  return !isInCheck(testBoard, color);
}

function getAllValidMoves(board: Board, color: Player): ChessMove[] {
  const moves: ChessMove[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== color) continue;

      const pieceMoves = getPieceMoves(board, r, c);
      for (const [mr, mc] of pieceMoves) {
        if (isValidMove(board, [r, c], [mr, mc], color)) {
          moves.push({ from: [r, c], to: [mr, mc] });
        }
      }
    }
  }

  return moves;
}

function createInitialState(): ChessState {
  return {
    board: createInitialBoard(),
    currentPlayer: "w",
    statusText: "White to move. Select a piece.",
    selectedCell: null,
    validMoves: [],
    result: null,
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    lastMove: null,
    promotionPending: null,
    moveHistory: [],
    halfMoveClock: 0,
  };
}

function evaluateMove(board: Board, move: ChessMove): number {
  let score = 0;
  const target = board[move.to[0]][move.to[1]];
  if (target) {
    const values: Record<PieceType, number> = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 100 };
    score += values[target.type];
  }

  if (move.to[0] === 0 || move.to[0] === 7) {
    score += 5;
  }

  return score;
}

function chooseCPUMove(board: Board): ChessMove | null {
  const moves = getAllValidMoves(board, "b");
  if (moves.length === 0) return null;

  const scoredMoves = moves.map(move => ({
    move,
    score: evaluateMove(board, move) + Math.random() * 2,
  }));

  scoredMoves.sort((a, b) => b.score - a.score);
  return scoredMoves[0].move;
}

function isPromotionMove(piece: Piece, toRow: number): boolean {
  return piece?.type === "P" && (toRow === 0 || toRow === BOARD_SIZE - 1);
}

function boardsEqual(a: Board, b: Board): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const pa = a[r][c];
      const pb = b[r][c];
      if (pa === null && pb === null) continue;
      if (pa === null || pb === null) return false;
      if (pa.type !== pb.type || pa.color !== pb.color) return false;
    }
  }
  return true;
}

function countRepetitions(history: Board[], current: Board): number {
  let count = 0;
  for (const board of history) {
    if (boardsEqual(board, current)) count++;
  }
  return count;
}

function hasInsufficientMaterial(board: Board): boolean {
  const pieces = board.flat().filter((p): p is NonNullable<Piece> => p !== null);
  if (pieces.length === 2) {
    return true;
  }

  if (pieces.length === 3) {
    const nonKing = pieces.find(p => p.type !== "K");
    if (nonKing && (nonKing.type === "B" || nonKing.type === "N")) {
      return true;
    }
  }

  return false;
}

function finalizeMove(state: ChessState, from: [number, number], to: [number, number], promotion?: PieceType): ChessState {
  const piece = state.board[from[0]][from[1]];
  if (!piece) return state;

  const newBoard = copyBoard(state.board);
  const captured = newBoard[to[0]][to[1]];
  newBoard[to[0]][to[1]] = promotion
    ? { type: promotion, color: piece.color }
    : piece;
  newBoard[from[0]][from[1]] = null;

  const isPawnOrCapture = piece.type === "P" || captured !== null;
  const halfMoveClock = isPawnOrCapture ? 0 : state.halfMoveClock + 1;

  const isCheck = isInCheck(newBoard, piece.color === "w" ? "b" : "w");
  let statusText = "";
  let isCheckmate = false;
  let isStalemate = false;
  let result = null;

  const nextPlayer = piece.color === "w" ? "b" : "w";
  const nextMoves = getAllValidMoves(newBoard, nextPlayer);

  const repetitionCount = countRepetitions(state.moveHistory, newBoard);

  if (nextMoves.length === 0) {
    if (isCheck) {
      isCheckmate = true;
      result = piece.color === "w" ? "White wins by checkmate!" : "Black wins by checkmate!";
      statusText = result;
    } else {
      isStalemate = true;
      result = "Stalemate! It's a draw.";
      statusText = result;
    }
  } else if (halfMoveClock >= 100) {
    isStalemate = true;
    result = "Draw by 50-move rule.";
    statusText = result;
  } else if (repetitionCount >= 2) {
    isStalemate = true;
    result = "Draw by threefold repetition.";
    statusText = result;
  } else if (hasInsufficientMaterial(newBoard)) {
    isStalemate = true;
    result = "Draw by insufficient material.";
    statusText = result;
  } else if (isCheck) {
    statusText = `Check! ${nextPlayer === "w" ? "White" : "Black"} to move.`;
  } else {
    statusText = `${nextPlayer === "w" ? "White" : "Black"} to move.`;
  }

  return {
    ...state,
    board: newBoard,
    currentPlayer: nextPlayer,
    statusText,
    selectedCell: null,
    validMoves: [],
    isCheck,
    isCheckmate,
    isStalemate,
    result,
    lastMove: { from, to },
    promotionPending: null,
    moveHistory: [...state.moveHistory, copyBoard(state.board)],
    halfMoveClock,
  };
}

function makeMove(state: ChessState, from: [number, number], to: [number, number]): ChessState {
  const piece = state.board[from[0]][from[1]];
  if (!piece) return state;

  if (isPromotionMove(piece, to[0])) {
    return {
      ...state,
      selectedCell: null,
      validMoves: [],
      promotionPending: { from, to },
    };
  }

  return finalizeMove(state, from, to);
}

export function ChessGame({
  className,
  isFullscreen = false,
}: {
  className?: string;
  isFullscreen?: boolean;
}) {
  const [game, setGame] = useState<ChessState>(createInitialState);

  const resetGame = useCallback(() => {
    setGame(createInitialState());
  }, []);

  const handlePromotion = useCallback((pieceType: PieceType) => {
    if (!game.promotionPending) return;
    const { from, to } = game.promotionPending;
    setGame(current => finalizeMove(current, from, to, pieceType));
  }, [game.promotionPending]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (game.result || game.currentPlayer !== "w" || game.promotionPending) return;

    const { selectedCell, board } = game;

    if (selectedCell) {
      const isValidMoveCell = game.validMoves.some(([r, c]) => r === row && c === col);

      if (isValidMoveCell) {
        setGame(current => makeMove(current, selectedCell, [row, col]));
        return;
      }

      const piece = board[row][col];
      if (piece?.color === "w") {
        const moves = getPieceMoves(board, row, col).filter(([mr, mc]) =>
          isValidMove(board, [row, col], [mr, mc], "w")
        );
        setGame(current => ({
          ...current,
          selectedCell: [row, col],
          validMoves: moves,
        }));
        return;
      }

      setGame(current => ({
        ...current,
        selectedCell: null,
        validMoves: [],
      }));
    } else {
      const piece = board[row][col];
      if (piece?.color === "w") {
        const moves = getPieceMoves(board, row, col).filter(([mr, mc]) =>
          isValidMove(board, [row, col], [mr, mc], "w")
        );
        setGame(current => ({
          ...current,
          selectedCell: [row, col],
          validMoves: moves,
        }));
      }
    }
  }, [game]);

  useEffect(() => {
    if (game.result || game.currentPlayer !== "b" || game.promotionPending) return;

    const timeout = setTimeout(() => {
      const move = chooseCPUMove(game.board);
      if (move) {
        const piece = game.board[move.from[0]][move.from[1]];
        if (piece && isPromotionMove(piece, move.to[0])) {
          setGame(current => finalizeMove(current, move.from, move.to, "Q"));
        } else {
          setGame(current => finalizeMove(current, move.from, move.to));
        }
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [game.currentPlayer, game.result, game.board, game.promotionPending]);

  const boardMaxWidth = isFullscreen ? "min(80vmin, 640px)" : "400px";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="grid gap-2 text-[10px] uppercase tracking-widest text-muted-foreground sm:grid-cols-3">
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          {game.currentPlayer === "w" ? "White Turn" : "Black Turn"}
        </div>
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          {game.isCheck ? "Check!" : game.isCheckmate ? "Checkmate" : game.isStalemate ? "Stalemate" : "In Progress"}
        </div>
        <div className="retro rounded border border-dashed border-border px-3 py-2 text-center">
          You play White
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={resetGame}
          className="retro h-8 px-3 text-[10px] uppercase tracking-widest"
        >
          New Game
        </Button>
        <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
          {game.statusText}
        </p>
      </div>

      {game.promotionPending && (
        <div className="rounded border border-dashed border-border bg-background/50 p-3">
          <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Promote pawn to:
          </p>
          <div className="flex gap-2">
            {(["Q", "R", "B", "N"] as PieceType[]).map((type) => (
              <Button
                key={type}
                type="button"
                variant="outline"
                onClick={() => handlePromotion(type)}
                className="retro h-10 w-10 text-xl"
              >
                {PIECE_SYMBOLS[`w${type}`]}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded border border-dashed border-border bg-background/50 p-2">
        <div
          className="mx-auto grid gap-px"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            width: "100%",
            maxWidth: boardMaxWidth,
          }}
        >
          {game.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isSelected =
                game.selectedCell?.[0] === rowIndex &&
                game.selectedCell?.[1] === colIndex;
              const isValidMove = game.validMoves.some(
                ([r, c]) => r === rowIndex && c === colIndex
              );
              const isDark = (rowIndex + colIndex) % 2 === 1;
              const isLastMove =
                game.lastMove &&
                ((game.lastMove.from[0] === rowIndex && game.lastMove.from[1] === colIndex) ||
                 (game.lastMove.to[0] === rowIndex && game.lastMove.to[1] === colIndex));

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  type="button"
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={cn(
                    "flex aspect-square items-center justify-center border border-border text-xs transition-none",
                    isDark ? "bg-muted" : "bg-muted/40",
                    isSelected && "ring-2 ring-primary ring-inset",
                    isValidMove && !cell && "bg-primary/40",
                    isLastMove && !isSelected && "bg-primary/20"
                  )}
                >
                  {cell && (
                    <span
                      className={cn(
                        "text-lg font-bold leading-none rounded px-[2px] py-[1px]",
                        cell.color === "w"
                          ? "bg-white text-black"
                          : "bg-black text-white"
                      )}
                    >
                      {PIECE_LETTERS[cell.type]}
                    </span>
                  )}
                  {isValidMove && cell && (
                    <span className="absolute h-3 w-3 rounded-full bg-primary/70" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-1">
        {["K", "Q", "R", "B", "N"].map((type) => (
          <span key={type} className="retro text-xl text-muted-foreground">
            {PIECE_SYMBOLS[`w${type}`]}
          </span>
        ))}
      </div>

      <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
        Click a piece to see valid moves. Capture the enemy king to win.
      </p>
    </div>
  );
}