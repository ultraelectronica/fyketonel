"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";

interface GameScore {
  player: number;
  ai: number;
}

interface Vector {
  x: number;
  y: number;
}

interface Paddle extends Vector {
  radius: number;
}

interface Puck extends Vector {
  radius: number;
  vx: number;
  vy: number;
}

interface VisualGameState {
  playerPaddle: Paddle;
  aiPaddle: Paddle;
  puck: Puck;
}

interface InternalGameState extends VisualGameState {
  keys: { up: boolean; down: boolean; left: boolean; right: boolean };
  pointerTarget: Vector | null;
  playerVelocity: Vector;
  aiVelocity: Vector;
  lastTime: number;
}

interface PixelCircleProps {
  cx: number;
  cy: number;
  radius: number;
  color: string;
}

interface PixelSolidCircleProps {
  cx: number;
  cy: number;
  radius: number;
  color: string;
}

interface PaddleCollisionOptions {
  puck: Puck;
  prevX: number;
  prevY: number;
  paddle: Paddle;
  paddleVelocity: Vector;
  tableHeight: number;
  minPuckSpeed: number;
  maxPuckSpeed: number;
  fallbackNormalX: number;
}

type Side = "player" | "ai";

const STORAGE_KEY = "hockey-game-score";
const WINNING_SCORE = 6;
const BASE_WIDTH = 400;
const BASE_HEIGHT = 300;
const BASE_PADDLE_RADIUS = 20;
const BASE_PUCK_RADIUS = 8;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function magnitude(x: number, y: number) {
  return Math.hypot(x, y);
}

function normalizeVector(
  x: number,
  y: number,
  fallbackX = 1,
  fallbackY = 0
): Vector {
  const length = magnitude(x, y);
  if (length > 1e-6) {
    return { x: x / length, y: y / length };
  }

  const fallbackLength = magnitude(fallbackX, fallbackY);
  if (fallbackLength > 1e-6) {
    return { x: fallbackX / fallbackLength, y: fallbackY / fallbackLength };
  }

  return { x: 1, y: 0 };
}

function reflectIntoBounds(value: number, min: number, max: number) {
  if (max <= min) {
    return min;
  }

  let reflected = value;
  while (reflected < min || reflected > max) {
    if (reflected < min) {
      reflected = min + (min - reflected);
    }
    if (reflected > max) {
      reflected = max - (reflected - max);
    }
  }

  return reflected;
}

function getGoalBounds(height: number) {
  const goalHeight = Math.min(height - 48, Math.max(90, height * 0.3));
  const goalTop = (height - goalHeight) / 2;
  return {
    goalTop,
    goalBottom: goalTop + goalHeight,
    goalHeight,
  };
}

function getSegmentCircleHit(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  circleX: number,
  circleY: number,
  radius: number
) {
  const dx = endX - startX;
  const dy = endY - startY;
  const fx = startX - circleX;
  const fy = startY - circleY;
  const a = dx * dx + dy * dy;

  if (a <= 1e-10) {
    return null;
  }

  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - radius * radius;
  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return null;
  }

  const root = Math.sqrt(discriminant);
  const t0 = (-b - root) / (2 * a);
  const t1 = (-b + root) / (2 * a);
  const hitT = [t0, t1].find((candidate) => candidate >= 0 && candidate <= 1);

  if (hitT === undefined) {
    return null;
  }

  return {
    x: startX + dx * hitT,
    y: startY + dy * hitT,
  };
}

function resolvePaddleCollision({
  puck,
  prevX,
  prevY,
  paddle,
  paddleVelocity,
  tableHeight,
  minPuckSpeed,
  maxPuckSpeed,
  fallbackNormalX,
}: PaddleCollisionOptions) {
  const combinedRadius = paddle.radius + puck.radius;
  let collisionX = puck.x;
  let collisionY = puck.y;
  let collided = false;

  if (magnitude(collisionX - paddle.x, collisionY - paddle.y) < combinedRadius) {
    collided = true;
  } else {
    const hit = getSegmentCircleHit(
      prevX,
      prevY,
      puck.x,
      puck.y,
      paddle.x,
      paddle.y,
      combinedRadius
    );

    if (hit) {
      collisionX = hit.x;
      collisionY = hit.y;
      collided = true;
    }
  }

  if (!collided) {
    return false;
  }

  const normal = normalizeVector(
    collisionX - paddle.x,
    collisionY - paddle.y,
    fallbackNormalX,
    0
  );
  const tangent = { x: -normal.y, y: normal.x };
  const relativeVx = puck.vx - paddleVelocity.x;
  const relativeVy = puck.vy - paddleVelocity.y;
  const normalVelocity = relativeVx * normal.x + relativeVy * normal.y;

  let nextRelativeVx = relativeVx;
  let nextRelativeVy = relativeVy;

  if (normalVelocity < 0) {
    nextRelativeVx = relativeVx - 2 * normalVelocity * normal.x;
    nextRelativeVy = relativeVy - 2 * normalVelocity * normal.y;
  } else {
    nextRelativeVx += normal.x * 140;
    nextRelativeVy += normal.y * 140;
  }

  let nextVx = nextRelativeVx + paddleVelocity.x * 0.85;
  let nextVy = nextRelativeVy + paddleVelocity.y * 0.85;
  const tangentTransfer =
    (paddleVelocity.x * tangent.x + paddleVelocity.y * tangent.y) * 0.3;

  nextVx += tangent.x * tangentTransfer;
  nextVy += tangent.y * tangentTransfer;

  const impactBoost =
    Math.max(0, -normalVelocity) * 0.18 +
    magnitude(paddleVelocity.x, paddleVelocity.y) * 0.08;
  const direction = normalizeVector(nextVx, nextVy, normal.x, normal.y);
  const nextSpeed = clamp(
    magnitude(nextVx, nextVy) + impactBoost,
    minPuckSpeed,
    maxPuckSpeed
  );

  puck.vx = direction.x * nextSpeed;
  puck.vy = direction.y * nextSpeed;
  puck.x = paddle.x + normal.x * (combinedRadius + 0.75);
  puck.y = clamp(
    paddle.y + normal.y * (combinedRadius + 0.75),
    puck.radius,
    tableHeight - puck.radius
  );

  return true;
}

function PixelHollowCircle({ cx, cy, radius, color }: PixelCircleProps) {
  const s = radius / 5;
  const pixels: [number, number][] = [
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [2, 1],
    [7, 1],
    [1, 2],
    [8, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [9, 3],
    [9, 4],
    [9, 5],
    [9, 6],
    [1, 7],
    [8, 7],
    [2, 8],
    [7, 8],
    [3, 9],
    [4, 9],
    [5, 9],
    [6, 9],
  ];

  return (
    <g transform={`translate(${cx - radius}, ${cy - radius})`}>
      {pixels.map(([px, py], index) => (
        <rect
          key={index}
          x={px * s}
          y={py * s}
          width={s}
          height={s}
          fill={color}
        />
      ))}
    </g>
  );
}

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
      {rows.map((row, index) => (
        <rect
          key={index}
          x={row.x * s}
          y={row.y * s}
          width={row.w * s}
          height={s}
          fill={color}
        />
      ))}
    </g>
  );
}

export function HockeyGame({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scoreRef = useRef<GameScore>({ player: 0, ai: 0 });
  const gameOverRef = useRef(false);
  const awaitingServeRef = useRef(false);
  const serveSideRef = useRef<Side>("player");
  const serveStartTimeRef = useRef(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [blinkVisible, setBlinkVisible] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
  });
  const [gameState, setGameState] = useState<VisualGameState>({
    playerPaddle: {
      x: BASE_PADDLE_RADIUS + 30,
      y: BASE_HEIGHT / 2,
      radius: BASE_PADDLE_RADIUS,
    },
    aiPaddle: {
      x: BASE_WIDTH - BASE_PADDLE_RADIUS - 30,
      y: BASE_HEIGHT / 2,
      radius: BASE_PADDLE_RADIUS,
    },
    puck: {
      x: BASE_WIDTH / 2,
      y: BASE_HEIGHT / 2,
      radius: BASE_PUCK_RADIUS,
      vx: 0,
      vy: 0,
    },
  });
  const [score, setScore] = useState<GameScore>({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);

  const baseDiagonal = magnitude(BASE_WIDTH, BASE_HEIGHT);
  const currentDiagonal = magnitude(dimensions.width, dimensions.height);
  const baseSpeedScale = clamp(currentDiagonal / baseDiagonal, 1, 1.85);
  const isTouchDevice =
    typeof window !== "undefined" && "ontouchstart" in window;
  const speedScale =
    isFullscreen && isTouchDevice ? baseSpeedScale * 0.82 : baseSpeedScale;
  const entityScale =
    isFullscreen ? clamp(currentDiagonal / baseDiagonal, 1.15, 2.1) : 1;
  const paddleRadius = BASE_PADDLE_RADIUS * entityScale;
  const puckRadius = BASE_PUCK_RADIUS * entityScale;
  const lanePadding = 30 * speedScale;
  const boardStroke = Math.max(4, 5 * entityScale);
  const goalPocketWidth = Math.max(18, 24 * entityScale);
  const { goalTop, goalBottom, goalHeight } = getGoalBounds(dimensions.height);

  const gameStateRef = useRef<InternalGameState>({
    playerPaddle: {
      x: BASE_PADDLE_RADIUS + 30,
      y: BASE_HEIGHT / 2,
      radius: BASE_PADDLE_RADIUS,
    },
    aiPaddle: {
      x: BASE_WIDTH - BASE_PADDLE_RADIUS - 30,
      y: BASE_HEIGHT / 2,
      radius: BASE_PADDLE_RADIUS,
    },
    puck: {
      x: BASE_WIDTH / 2,
      y: BASE_HEIGHT / 2,
      radius: BASE_PUCK_RADIUS,
      vx: 0,
      vy: 0,
    },
    keys: { up: false, down: false, left: false, right: false },
    pointerTarget: null,
    playerVelocity: { x: 0, y: 0 },
    aiVelocity: { x: 0, y: 0 },
    lastTime: 0,
  });

  const syncVisualState = useCallback(() => {
    const state = gameStateRef.current;
    setGameState({
      playerPaddle: { ...state.playerPaddle },
      aiPaddle: { ...state.aiPaddle },
      puck: { ...state.puck },
    });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as GameScore;
      scoreRef.current = parsed;
      queueMicrotask(() => setScore(parsed));
    } catch {
      // Ignore invalid score snapshots.
    }
  }, []);

  useEffect(() => {
    if (hasStarted) {
      return;
    }

    const interval = window.setInterval(() => {
      setBlinkVisible((current) => !current);
    }, 600);

    return () => window.clearInterval(interval);
  }, [hasStarted]);

  const saveScore = useCallback((nextScore: GameScore) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextScore));
    scoreRef.current = nextScore;
  }, []);

  const updateScore = useCallback(
    (nextScore: GameScore) => {
      saveScore(nextScore);
      setScore(nextScore);

      if (
        nextScore.player >= WINNING_SCORE ||
        nextScore.ai >= WINNING_SCORE
      ) {
        setGameOver(true);
        gameOverRef.current = true;
        setIsPaused(true);
      }

      window.dispatchEvent(
        new CustomEvent("hockeyScoreUpdate", { detail: nextScore })
      );
    },
    [saveScore]
  );

  const setDefaultPaddles = useCallback(() => {
    const state = gameStateRef.current;

    state.playerPaddle.radius = paddleRadius;
    state.aiPaddle.radius = paddleRadius;
    state.puck.radius = puckRadius;
    state.playerPaddle.x = lanePadding + state.playerPaddle.radius;
    state.playerPaddle.y = dimensions.height / 2;
    state.aiPaddle.x =
      dimensions.width - lanePadding - state.aiPaddle.radius;
    state.aiPaddle.y = dimensions.height / 2;
    state.playerVelocity = { x: 0, y: 0 };
    state.aiVelocity = { x: 0, y: 0 };
  }, [dimensions.height, dimensions.width, lanePadding, paddleRadius, puckRadius]);

  const launchPuck = useCallback(
    (direction: 1 | -1) => {
      const state = gameStateRef.current;
      const launchSpeed = 315 * speedScale;
      const angle = (Math.random() - 0.5) * Math.PI * 0.7;
      const horizontal = Math.max(0.45, Math.abs(Math.cos(angle)));

      state.puck.vx = horizontal * launchSpeed * direction;
      state.puck.vy = Math.sin(angle) * launchSpeed;
    },
    [speedScale]
  );

  const initRound = useCallback(() => {
    const state = gameStateRef.current;

    awaitingServeRef.current = false;
    setDefaultPaddles();
    state.puck.x = dimensions.width / 2;
    state.puck.y = dimensions.height / 2;

    const openingDirection: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
    launchPuck(openingDirection);
    syncVisualState();
  }, [dimensions.height, dimensions.width, launchPuck, setDefaultPaddles, syncVisualState]);

  const placeAfterGoal = useCallback(
    (scorer: Side) => {
      const state = gameStateRef.current;
      const setupGap = 12 * entityScale;

      setDefaultPaddles();
      state.puck.vx = 0;
      state.puck.vy = 0;
      state.puck.y = dimensions.height / 2;

      if (scorer === "player") {
        state.puck.x =
          state.playerPaddle.x +
          state.playerPaddle.radius +
          state.puck.radius +
          setupGap;
      } else {
        state.puck.x =
          state.aiPaddle.x -
          state.aiPaddle.radius -
          state.puck.radius -
          setupGap;
      }

      awaitingServeRef.current = true;
      serveSideRef.current = scorer;
      serveStartTimeRef.current = performance.now();
      syncVisualState();
    },
    [dimensions.height, entityScale, setDefaultPaddles, syncVisualState]
  );

  const handleGoal = useCallback(
    (scorer: Side) => {
      const nextScore =
        scorer === "player"
          ? {
              player: scoreRef.current.player + 1,
              ai: scoreRef.current.ai,
            }
          : {
              player: scoreRef.current.player,
              ai: scoreRef.current.ai + 1,
            };

      updateScore(nextScore);

      if (
        nextScore.player < WINNING_SCORE &&
        nextScore.ai < WINNING_SCORE
      ) {
        placeAfterGoal(scorer);
      }
    },
    [placeAfterGoal, updateScore]
  );

  const resetGame = useCallback(() => {
    const freshScore = { player: 0, ai: 0 };

    saveScore(freshScore);
    setScore(freshScore);
    setGameOver(false);
    gameOverRef.current = false;
    setIsPaused(false);
    initRound();

    window.dispatchEvent(
      new CustomEvent("hockeyScoreUpdate", { detail: freshScore })
    );
  }, [initRound, saveScore]);

  const startGame = useCallback(() => {
    setHasStarted(true);
    setIsPaused(false);
    resetGame();
  }, [resetGame]);

  const clearMovementKeys = useCallback(() => {
    gameStateRef.current.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (event.code === "Space" && hasStarted && !gameOverRef.current) {
        setIsPaused((current) => !current);
        event.preventDefault();
        return;
      }

      if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
        gameStateRef.current.keys.up = true;
        event.preventDefault();
      }
      if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
        gameStateRef.current.keys.down = true;
        event.preventDefault();
      }
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        gameStateRef.current.keys.left = true;
        event.preventDefault();
      }
      if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        gameStateRef.current.keys.right = true;
        event.preventDefault();
      }
    },
    [hasStarted]
  );

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      gameStateRef.current.keys.up = false;
    }
    if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
      gameStateRef.current.keys.down = false;
    }
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      gameStateRef.current.keys.left = false;
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      gameStateRef.current.keys.right = false;
    }
  }, []);

  const screenToGamePoint = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) {
        return null;
      }

      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return null;
      }

      return {
        x: (clientX - rect.left) * (dimensions.width / rect.width),
        y: (clientY - rect.top) * (dimensions.height / rect.height),
      };
    },
    [dimensions.height, dimensions.width]
  );

  const updatePointerTarget = useCallback(
    (clientX: number, clientY: number) => {
      const point = screenToGamePoint(clientX, clientY);
      if (!point) {
        return;
      }

      gameStateRef.current.pointerTarget = point;
    },
    [screenToGamePoint]
  );

  const clearPointerTarget = useCallback(() => {
    gameStateRef.current.pointerTarget = null;
  }, []);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      updatePointerTarget(event.clientX, event.clientY);
    },
    [updatePointerTarget]
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      if (!gameStateRef.current.pointerTarget) {
        return;
      }

      event.preventDefault();
      updatePointerTarget(event.clientX, event.clientY);
    },
    [updatePointerTarget]
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      event.preventDefault();
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      clearPointerTarget();
    },
    [clearPointerTarget]
  );

  const update = useCallback(
    (currentTime: number) => {
      const state = gameStateRef.current;
      const elapsed = currentTime - state.lastTime;
      const dt = clamp((elapsed || 16.67) / 1000, 1 / 240, 0.04);
      const safeDt = Math.max(dt, 1 / 240);
      const playerMinX = lanePadding + state.playerPaddle.radius;
      const playerMaxX =
        dimensions.width / 2 - lanePadding - state.playerPaddle.radius;
      const aiMinX =
        dimensions.width / 2 + lanePadding + state.aiPaddle.radius;
      const aiMaxX = dimensions.width - lanePadding - state.aiPaddle.radius;
      const playerKeyboardSpeed = 520 * speedScale;
      const playerPointerSpeed = 900 * speedScale;
      const aiBaseSpeed = 420 * speedScale;
      const minPuckSpeed = 215 * speedScale;
      const maxPuckSpeed = 760 * speedScale;

      state.lastTime = currentTime;

      const previousPlayer = {
        x: state.playerPaddle.x,
        y: state.playerPaddle.y,
      };

      if (state.pointerTarget) {
        const targetX = clamp(state.pointerTarget.x, playerMinX, playerMaxX);
        const targetY = clamp(
          state.pointerTarget.y,
          state.playerPaddle.radius,
          dimensions.height - state.playerPaddle.radius
        );
        const deltaX = targetX - state.playerPaddle.x;
        const deltaY = targetY - state.playerPaddle.y;
        const distance = magnitude(deltaX, deltaY);
        const maxMove = playerPointerSpeed * dt;

        if (distance > maxMove) {
          const direction = normalizeVector(deltaX, deltaY);
          state.playerPaddle.x += direction.x * maxMove;
          state.playerPaddle.y += direction.y * maxMove;
        } else {
          state.playerPaddle.x = targetX;
          state.playerPaddle.y = targetY;
        }
      } else {
        let inputX = 0;
        let inputY = 0;

        if (state.keys.left) {
          inputX -= 1;
        }
        if (state.keys.right) {
          inputX += 1;
        }
        if (state.keys.up) {
          inputY -= 1;
        }
        if (state.keys.down) {
          inputY += 1;
        }

        if (inputX !== 0 || inputY !== 0) {
          const direction = normalizeVector(inputX, inputY);
          state.playerPaddle.x += direction.x * playerKeyboardSpeed * dt;
          state.playerPaddle.y += direction.y * playerKeyboardSpeed * dt;
        }
      }

      state.playerPaddle.x = clamp(state.playerPaddle.x, playerMinX, playerMaxX);
      state.playerPaddle.y = clamp(
        state.playerPaddle.y,
        state.playerPaddle.radius,
        dimensions.height - state.playerPaddle.radius
      );
      state.playerVelocity = {
        x: (state.playerPaddle.x - previousPlayer.x) / safeDt,
        y: (state.playerPaddle.y - previousPlayer.y) / safeDt,
      };

      const previousAi = {
        x: state.aiPaddle.x,
        y: state.aiPaddle.y,
      };
      const aiHomeX = clamp(dimensions.width * 0.77, aiMinX, aiMaxX);
      let aiTargetX = aiHomeX;
      let aiTargetY = dimensions.height / 2;

      if (awaitingServeRef.current && serveSideRef.current === "ai") {
        aiTargetX = clamp(
          state.puck.x + state.aiPaddle.radius + state.puck.radius + 8 * entityScale,
          aiMinX,
          aiMaxX
        );
        aiTargetY = state.puck.y;
      } else if (state.puck.vx > 0 || state.puck.x > dimensions.width * 0.55) {
        const defenseX = clamp(dimensions.width * 0.74, aiMinX, aiMaxX);
        aiTargetX = defenseX;

        if (state.puck.x > dimensions.width * 0.7 && state.puck.vx > -60) {
          aiTargetX = clamp(
            state.puck.x + state.aiPaddle.radius * 0.7,
            aiMinX,
            aiMaxX
          );
        }

        if (state.puck.vx > 40) {
          const timeToDefense = (aiTargetX - state.puck.x) / state.puck.vx;
          if (timeToDefense > 0 && timeToDefense < 2.25) {
            aiTargetY = reflectIntoBounds(
              state.puck.y + state.puck.vy * timeToDefense,
              state.aiPaddle.radius,
              dimensions.height - state.aiPaddle.radius
            );
          } else {
            aiTargetY = state.puck.y;
          }
        } else {
          aiTargetY = state.puck.y;
        }
      } else {
        aiTargetY = dimensions.height / 2 + (state.puck.y - dimensions.height / 2) * 0.25;
      }

      aiTargetX = clamp(aiTargetX, aiMinX, aiMaxX);
      aiTargetY = clamp(
        aiTargetY,
        state.aiPaddle.radius,
        dimensions.height - state.aiPaddle.radius
      );

      const aiMaxMove =
        (aiBaseSpeed + (state.puck.x > dimensions.width * 0.66 ? 120 * speedScale : 0)) *
        dt;
      const aiDx = aiTargetX - state.aiPaddle.x;
      const aiDy = aiTargetY - state.aiPaddle.y;
      const aiDistance = magnitude(aiDx, aiDy);

      if (aiDistance > aiMaxMove) {
        const direction = normalizeVector(aiDx, aiDy);
        state.aiPaddle.x += direction.x * aiMaxMove;
        state.aiPaddle.y += direction.y * aiMaxMove;
      } else {
        state.aiPaddle.x = aiTargetX;
        state.aiPaddle.y = aiTargetY;
      }

      state.aiPaddle.x = clamp(state.aiPaddle.x, aiMinX, aiMaxX);
      state.aiPaddle.y = clamp(
        state.aiPaddle.y,
        state.aiPaddle.radius,
        dimensions.height - state.aiPaddle.radius
      );
      state.aiVelocity = {
        x: (state.aiPaddle.x - previousAi.x) / safeDt,
        y: (state.aiPaddle.y - previousAi.y) / safeDt,
      };

      if (awaitingServeRef.current) {
        if (serveSideRef.current === "player") {
          const serveDistance = magnitude(
            state.puck.x - state.playerPaddle.x,
            state.puck.y - state.playerPaddle.y
          );

          if (serveDistance <= state.playerPaddle.radius + state.puck.radius) {
            const serveNormal = normalizeVector(
              state.puck.x - state.playerPaddle.x,
              state.puck.y - state.playerPaddle.y,
              1,
              0
            );

            state.puck.x =
              state.playerPaddle.x +
              serveNormal.x * (state.playerPaddle.radius + state.puck.radius + 1);
            state.puck.y = clamp(
              state.playerPaddle.y +
                serveNormal.y * (state.playerPaddle.radius + state.puck.radius + 1),
              state.puck.radius,
              dimensions.height - state.puck.radius
            );
            awaitingServeRef.current = false;
            launchPuck(1);
          }
        } else if (currentTime - serveStartTimeRef.current >= 850) {
          awaitingServeRef.current = false;
          launchPuck(-1);
        }

        syncVisualState();
        return;
      }

      const frameTravel = magnitude(state.puck.vx * dt, state.puck.vy * dt);
      const substeps = Math.max(
        1,
        Math.ceil(frameTravel / Math.max(state.puck.radius * 0.9, 10))
      );
      const stepDt = dt / substeps;

      for (let step = 0; step < substeps; step += 1) {
        const prevX = state.puck.x;
        const prevY = state.puck.y;

        state.puck.x += state.puck.vx * stepDt;
        state.puck.y += state.puck.vy * stepDt;

        if (state.puck.y - state.puck.radius <= 0) {
          state.puck.y = state.puck.radius;
          state.puck.vy = Math.abs(state.puck.vy) * 0.99;
        } else if (state.puck.y + state.puck.radius >= dimensions.height) {
          state.puck.y = dimensions.height - state.puck.radius;
          state.puck.vy = -Math.abs(state.puck.vy) * 0.99;
        }

        const inGoalChannel =
          state.puck.y > goalTop + state.puck.radius &&
          state.puck.y < goalBottom - state.puck.radius;

        if (state.puck.x - state.puck.radius <= 0) {
          if (inGoalChannel) {
            if (state.puck.x < -state.puck.radius * 1.25) {
              handleGoal("ai");
              return;
            }
          } else {
            state.puck.x = state.puck.radius;
            state.puck.vx = Math.abs(state.puck.vx) * 0.995;
          }
        }

        if (state.puck.x + state.puck.radius >= dimensions.width) {
          if (inGoalChannel) {
            if (state.puck.x > dimensions.width + state.puck.radius * 1.25) {
              handleGoal("player");
              return;
            }
          } else {
            state.puck.x = dimensions.width - state.puck.radius;
            state.puck.vx = -Math.abs(state.puck.vx) * 0.995;
          }
        }

        resolvePaddleCollision({
          puck: state.puck,
          prevX,
          prevY,
          paddle: state.playerPaddle,
          paddleVelocity: state.playerVelocity,
          tableHeight: dimensions.height,
          minPuckSpeed,
          maxPuckSpeed,
          fallbackNormalX: 1,
        });

        resolvePaddleCollision({
          puck: state.puck,
          prevX,
          prevY,
          paddle: state.aiPaddle,
          paddleVelocity: state.aiVelocity,
          tableHeight: dimensions.height,
          minPuckSpeed,
          maxPuckSpeed,
          fallbackNormalX: -1,
        });

        const currentSpeed = magnitude(state.puck.vx, state.puck.vy);
        if (currentSpeed > 0) {
          const speedAfterDrag = clamp(
            currentSpeed * Math.exp(-0.06 * stepDt),
            minPuckSpeed,
            maxPuckSpeed
          );
          const direction = normalizeVector(
            state.puck.vx,
            state.puck.vy,
            Math.sign(state.puck.vx) || 1,
            0
          );

          state.puck.vx = direction.x * speedAfterDrag;
          state.puck.vy = direction.y * speedAfterDrag;
        }
      }

      syncVisualState();
    },
    [
      dimensions.height,
      dimensions.width,
      entityScale,
      goalTop,
      goalBottom,
      handleGoal,
      lanePadding,
      launchPuck,
      speedScale,
      syncVisualState,
    ]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const resizeGame = () => {
      if (document.fullscreenElement) {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
        return;
      }

      const rect = container.getBoundingClientRect();
      setDimensions({ width: rect.width, height: Math.min(400, rect.height) });
    };

    resizeGame();
    window.addEventListener("resize", resizeGame);

    return () => {
      window.removeEventListener("resize", resizeGame);
    };
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) {
      return;
    }

    initRound();
  }, [dimensions.height, dimensions.width, initRound]);

  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      if (
        hasStarted &&
        !isPaused &&
        !gameOver &&
        dimensions.width > 0 &&
        dimensions.height > 0
      ) {
        update(currentTime);
      } else {
        gameStateRef.current.lastTime = currentTime;
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearMovementKeys);
    gameStateRef.current.lastTime = performance.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearMovementKeys);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    clearMovementKeys,
    dimensions.height,
    dimensions.width,
    gameOver,
    handleKeyDown,
    handleKeyUp,
    hasStarted,
    isPaused,
    update,
  ]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (!document.fullscreenElement) {
      if (!container.requestFullscreen) {
        return;
      }

      setIsPaused(true);
      container.requestFullscreen().then(() => {
        if (
          isTouchDevice &&
          "lock" in screen.orientation &&
          typeof screen.orientation.lock === "function"
        ) {
          (
            screen.orientation as ScreenOrientation & {
              lock: (orientation: string) => Promise<void>;
            }
          )
            .lock("landscape")
            .catch(() => {});
        }

        setIsFullscreen(true);
        window.setTimeout(() => {
          setDimensions({ width: window.innerWidth, height: window.innerHeight });
        }, isTouchDevice ? 200 : 100);
      });
      return;
    }

    if (!document.exitFullscreen) {
      return;
    }

    document.exitFullscreen().then(() => {
      if (
        "unlock" in screen.orientation &&
        typeof screen.orientation.unlock === "function"
      ) {
        screen.orientation.unlock();
      }

      setIsFullscreen(false);
      window.setTimeout(() => {
        const rect = container.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.min(400, rect.height) });
      }, 100);
    });
  }, [isTouchDevice]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const inFullscreen = Boolean(document.fullscreenElement);
      const container = containerRef.current;

      setIsFullscreen(inFullscreen);
      if (inFullscreen) {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      } else if (container) {
        const rect = container.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.min(400, rect.height) });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2",
        className,
        isFullscreen && "fixed inset-0 z-50 bg-background"
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden border-2 border-dashed border-border bg-background/50",
          isFullscreen ? "h-full w-full border-0" : "min-h-[300px]"
        )}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="block w-full touch-none"
          style={{ imageRendering: "pixelated", touchAction: "none" }}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={clearPointerTarget}
          onLostPointerCapture={clearPointerTarget}
        >
          <rect
            width={dimensions.width}
            height={dimensions.height}
            fill="var(--background)"
          />

          <rect
            x={0}
            y={0}
            width={boardStroke}
            height={goalTop}
            fill="var(--border)"
          />
          <rect
            x={0}
            y={goalBottom}
            width={boardStroke}
            height={dimensions.height - goalBottom}
            fill="var(--border)"
          />
          <rect
            x={dimensions.width - boardStroke}
            y={0}
            width={boardStroke}
            height={goalTop}
            fill="var(--border)"
          />
          <rect
            x={dimensions.width - boardStroke}
            y={goalBottom}
            width={boardStroke}
            height={dimensions.height - goalBottom}
            fill="var(--border)"
          />

          <rect
            x={0}
            y={goalTop}
            width={goalPocketWidth}
            height={goalHeight}
            fill="var(--primary)"
            opacity="0.18"
          />
          <rect
            x={dimensions.width - goalPocketWidth}
            y={goalTop}
            width={goalPocketWidth}
            height={goalHeight}
            fill="var(--primary)"
            opacity="0.18"
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

          <PixelHollowCircle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            radius={28 * entityScale}
            color="var(--border)"
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

        {!hasStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-background/95">
            <p className="retro text-xl uppercase tracking-widest text-primary">
              AIR HOCKEY
            </p>
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
                WASD / ARROWS TO MOVE
              </p>
              <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
                CLICK + DRAG OR TOUCH + DRAG FOR DIRECT CONTROL
              </p>
              <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
                SCORE THROUGH THE OPEN GOAL MOUTH
              </p>
            </div>
            <p className="retro text-[10px] uppercase tracking-wider text-muted-foreground">
              FIRST TO {WINNING_SCORE} WINS
            </p>
            <p
              className={cn(
                "retro text-sm uppercase tracking-widest text-primary",
                !blinkVisible && "invisible"
              )}
            >
              PRESS START
            </p>
            <Button
              onClick={startGame}
              variant="outline"
              className="retro h-10 px-8 text-xs uppercase tracking-widest"
            >
              START
            </Button>
          </div>
        )}

        {hasStarted && isPaused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80">
            <p className="retro text-lg uppercase tracking-widest text-primary">
              PAUSED
            </p>
            <Button
              onClick={() => setIsPaused(false)}
              variant="outline"
              className="retro h-10 px-6 text-xs uppercase tracking-widest"
            >
              RESUME
            </Button>
          </div>
        )}

        {isFullscreen && hasStarted && !gameOver && (
          <div className="absolute right-2 top-2 z-10 flex gap-2">
            <Button
              onClick={() => setIsPaused((current) => !current)}
              variant="outline"
              className="retro h-9 bg-background/90 px-4 text-xs uppercase tracking-widest"
            >
              {isPaused ? "RESUME" : "PAUSE"}
            </Button>
            <Button
              onClick={toggleFullscreen}
              variant="outline"
              className="retro h-9 bg-background/90 px-4 text-xs uppercase tracking-widest"
            >
              EXIT FULLSCREEN
            </Button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/90">
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

      {hasStarted && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:hidden">
            <div className="flex justify-center gap-2">
              <Button
                onTouchStart={() => {
                  gameStateRef.current.keys.up = true;
                }}
                onTouchEnd={() => {
                  gameStateRef.current.keys.up = false;
                }}
                onTouchCancel={() => {
                  gameStateRef.current.keys.up = false;
                }}
                onMouseDown={() => {
                  gameStateRef.current.keys.up = true;
                }}
                onMouseUp={() => {
                  gameStateRef.current.keys.up = false;
                }}
                onMouseLeave={() => {
                  gameStateRef.current.keys.up = false;
                }}
                variant="outline"
                className="retro h-12 w-14 select-none text-lg uppercase tracking-widest"
              >
                ▲
              </Button>
            </div>
            <div className="flex justify-center gap-2">
              <Button
                onTouchStart={() => {
                  gameStateRef.current.keys.left = true;
                }}
                onTouchEnd={() => {
                  gameStateRef.current.keys.left = false;
                }}
                onTouchCancel={() => {
                  gameStateRef.current.keys.left = false;
                }}
                onMouseDown={() => {
                  gameStateRef.current.keys.left = true;
                }}
                onMouseUp={() => {
                  gameStateRef.current.keys.left = false;
                }}
                onMouseLeave={() => {
                  gameStateRef.current.keys.left = false;
                }}
                variant="outline"
                className="retro h-12 flex-1 select-none text-lg uppercase tracking-widest"
              >
                ◀
              </Button>
              <Button
                onTouchStart={() => {
                  gameStateRef.current.keys.right = true;
                }}
                onTouchEnd={() => {
                  gameStateRef.current.keys.right = false;
                }}
                onTouchCancel={() => {
                  gameStateRef.current.keys.right = false;
                }}
                onMouseDown={() => {
                  gameStateRef.current.keys.right = true;
                }}
                onMouseUp={() => {
                  gameStateRef.current.keys.right = false;
                }}
                onMouseLeave={() => {
                  gameStateRef.current.keys.right = false;
                }}
                variant="outline"
                className="retro h-12 flex-1 select-none text-lg uppercase tracking-widest"
              >
                ▶
              </Button>
            </div>
            <div className="flex justify-center gap-2">
              <Button
                onTouchStart={() => {
                  gameStateRef.current.keys.down = true;
                }}
                onTouchEnd={() => {
                  gameStateRef.current.keys.down = false;
                }}
                onTouchCancel={() => {
                  gameStateRef.current.keys.down = false;
                }}
                onMouseDown={() => {
                  gameStateRef.current.keys.down = true;
                }}
                onMouseUp={() => {
                  gameStateRef.current.keys.down = false;
                }}
                onMouseLeave={() => {
                  gameStateRef.current.keys.down = false;
                }}
                variant="outline"
                className="retro h-12 w-14 select-none text-lg uppercase tracking-widest"
              >
                ▼
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setIsPaused((current) => !current)}
              variant="outline"
              className="retro h-8 flex-1 text-xs uppercase tracking-widest"
            >
              {isPaused ? "RESUME" : "PAUSE"}
            </Button>
            <Button
              onClick={toggleFullscreen}
              variant="outline"
              className="retro h-8 flex-1 text-xs uppercase tracking-widest"
            >
              {isFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
