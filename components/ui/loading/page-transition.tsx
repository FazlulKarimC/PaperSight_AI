'use client';

/**
 * Page Transition Wrapper Component
 * Provides smooth fade-in/fade-out animations for page transitions
 * Respects user's reduced motion preferences
 */

import { motion } from 'framer-motion';
import { fadeIn, getPageTransition } from '@/lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageTransition component wraps page content with fade animations
 * - Fade-in: 300ms duration when entering
 * - Fade-out: 200ms duration when exiting
 * - Respects prefers-reduced-motion (0ms duration)
 * 
 * @param children - Page content to animate
 * @param className - Optional CSS classes
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
      transition={{
        duration: getPageTransition('enter').duration,
        ease: getPageTransition('enter').ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

