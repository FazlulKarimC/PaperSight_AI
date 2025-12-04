'use client';

/**
 * Custom 404 Not Found Page
 * Displays when a page is not found with navigation options
 * 
 * Requirements: 4.2
 * - Custom 404 page with navigation options
 */

import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { fadeIn, slideUp } from '@/lib/animations';
import { getAnimationConfig } from '@/lib/animations';

export default function NotFound() {
  const router = useRouter();
  const animConfig = getAnimationConfig();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-md text-center"
        variants={fadeIn}
        initial="initial"
        animate="animate"
        transition={{
          duration: animConfig.duration,
          ease: animConfig.ease as any,
        }}
      >
        {/* 404 Number */}
        <motion.div
          className="mb-6"
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ 
            duration: animConfig.duration,
            ease: animConfig.ease as any,
            delay: 0.1 
          }}
        >
          <h1 className="text-9xl font-bold text-accent">404</h1>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="mb-3 text-2xl font-semibold text-foreground"
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ 
            duration: animConfig.duration,
            ease: animConfig.ease as any,
            delay: 0.2 
          }}
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          className="mb-8 text-muted-foreground"
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ 
            duration: animConfig.duration,
            ease: animConfig.ease as any,
            delay: 0.3 
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Navigation Options */}
        <motion.div
          className="flex flex-col gap-3 sm:flex-row sm:justify-center"
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ 
            duration: animConfig.duration,
            ease: animConfig.ease as any,
            delay: 0.4 
          }}
        >
          <Button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
          
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Dashboard
          </Button>
        </motion.div>

        {/* Decorative Element */}
        <motion.div
          className="mt-12 text-sm text-muted-foreground"
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ 
            duration: animConfig.duration,
            ease: animConfig.ease as any,
            delay: 0.5 
          }}
        >
          Lost in the papers? Let's get you back on track.
        </motion.div>
      </motion.div>
    </div>
  );
}
