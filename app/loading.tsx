'use client';

/**
 * Global Loading Page
 * Displays while page content is being loaded
 * 
 * Requirements: 2.4
 * - Progress bar at top of viewport during loading
 */

import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/ui/loading/loading-spinner';
import { fadeIn } from '@/lib/animations';
import { getAnimationConfig } from '@/lib/animations';

export default function Loading() {
  const animConfig = getAnimationConfig();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      {/* Progress Bar at Top */}
      <motion.div
        className="fixed left-0 right-0 top-0 h-1 bg-accent"
        initial={{ scaleX: 0, transformOrigin: 'left' }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 1.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* Loading Content */}
      <motion.div
        className="flex flex-col items-center gap-4"
        variants={fadeIn}
        initial="initial"
        animate="animate"
        transition={{
          duration: animConfig.duration,
          ease: animConfig.ease as any,
        }}
      >
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </motion.div>
    </div>
  );
}
