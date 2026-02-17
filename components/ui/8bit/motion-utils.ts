
import { Variants, Transition, Easing } from "framer-motion";

// Helper for stepped easing
export const steps = (numSteps: number): Easing => (progress: number) => {
  return Math.floor(progress * numSteps) / numSteps;
};

// -----------------------------------------------------------------------------
// Transitions
// -----------------------------------------------------------------------------

/**
 * A "stepped" transition that forces jerky, frame-by-frame movement
 * typical of 8-bit/16-bit games.
 */
export const retroTransition: Transition = {
  duration: 0.3,
  type: "tween",
  ease: steps(3)
};

export const pixelTransition: Transition = {
  type: "tween",
  duration: 0.2, // Fast!
  ease: steps(4), // 4 frames of animation
};

export const instantTransition: Transition = {
  type: "tween",
  duration: 0.01, // Effectively instant
};

// -----------------------------------------------------------------------------
// Variants
// -----------------------------------------------------------------------------

/**
 * Standard hover effect for interactive elements:
 * No smoothing, just instant or 2-frame snap.
 */
export const pixelHover: Variants = {
  initial: { y: 0, scale: 1 },
  hover: { 
    y: -2, 
    scale: 1,
    transition: { duration: 0, delay: 0 } // Instant feedback
  },
  tap: { 
    y: 2, 
    transition: { duration: 0 } 
  }
};

/**
 * Pop in effect - scales up in steps.
 */
export const pixelPop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
      ease: steps(3) // 0 -> 0.33 -> 0.66 -> 1
    }
  }
};

/**
 * Fade in effect - opacity changes in steps.
 */
export const pixelFade: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: steps(4) // 0 -> 0.25 -> 0.5 -> 0.75 -> 1
    }
  }
};

/**
 * CRT Turn On Effect
 * 1. Scale X from 0 to 1 (thin horizontal line)
 * 2. Scale Y from 0.02 to 1 (expand vertically)
 */
export const crtTurnOn: Variants = {
  hidden: { 
    scaleX: 0, 
    scaleY: 0.005,
    opacity: 0 
  },
  visible: { 
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      times: [0, 0.4, 1],
      when: "beforeChildren",
    }
  },
  exit: {
    scaleX: 0,
    scaleY: 0.005,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const crtOpenVariant: Variants = {
  hidden: { 
    scaleY: 0.01,
    scaleX: 0,
    opacity: 0,
  },
  visible: {
    scaleY: [0.01, 0.01, 1],
    scaleX: [0, 1, 1],
    opacity: [0, 1, 1],
    transition: {
      duration: 0.6,
      times: [0, 0.3, 1], // 0-0.3: Expand width. 0.3-1: Expand height.
      ease: "linear"
    }
  },
  exit: {
    scaleY: [1, 0.01, 0.01],
    scaleX: [1, 1, 0],
    opacity: [1, 1, 0],
    transition: {
      duration: 0.4,
      times: [0, 0.5, 1]
    }
  }
};


/**
 * Text typewriter effect container.
 */
export const typewriterContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.015, // Fast typing speed
    }
  }
};

/**
 * Individual character for typewriter effect.
 */
export const typewriterChar: Variants = {
  hidden: { opacity: 0, display: "none" },
  visible: { 
    opacity: 1, 
    display: "inline-block",
    transition: { duration: 0 } // Instant appearance
  }
};

/**
 * Blinking cursor.
 */
export const blinkCursor: Variants = {
  animate: {
    opacity: [0, 1, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: steps(2) // On/Off only
    }
  }
};
