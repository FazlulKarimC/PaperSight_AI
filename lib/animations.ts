/**
 * Animation utilities for Framer Motion
 * Provides reusable animation variants and configuration helpers
 */

import { Variants, Transition } from 'framer-motion';

/**
 * Animation configuration interface
 */
export interface AnimationConfig {
  duration: number;
  ease: number[] | string;
  delay?: number;
}

/**
 * Fade in animation variant
 * Animates opacity from 0 to 1
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Slide up animation variant
 * Animates from below (y: 20) to final position with fade
 */
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * Slide down animation variant
 * Animates from above (y: -20) to final position with fade
 */
export const slideDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

/**
 * Stagger container variant
 * Applies staggered animation to children with 100ms delay
 */
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Stagger container variant for list items
 * Applies staggered animation to children with 50ms delay
 */
export const staggerList: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

/**
 * Get animation configuration with reduced motion support
 * Respects user's prefers-reduced-motion preference
 * 
 * @returns Animation configuration object with duration and easing
 */
export const getAnimationConfig = (): AnimationConfig => {
  // Check if user prefers reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    duration: prefersReducedMotion ? 0 : 0.3,
    ease: [0.4, 0, 0.2, 1], // Cubic bezier easing
  };
};

/**
 * Get transition configuration for page transitions
 * Entry: 300ms, Exit: 200ms
 * 
 * @param type - 'enter' or 'exit'
 * @returns Transition configuration
 */
export const getPageTransition = (type: 'enter' | 'exit'): Transition => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const duration = prefersReducedMotion ? 0 : type === 'enter' ? 0.3 : 0.2;

  return {
    duration,
    ease: [0.4, 0, 0.2, 1],
  };
};

/**
 * Shake animation for error states
 */
export const shake: Variants = {
  initial: { x: 0 },
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

/**
 * Scale animation for interactive elements
 */
export const scale: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};
