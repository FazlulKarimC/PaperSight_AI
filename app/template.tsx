'use client';

import { PageTransition } from '@/components/ui/loading';

/**
 * Root Template Component
 * Wraps all pages with PageTransition for smooth route transitions
 * 
 * Note: template.tsx creates a new instance on each navigation,
 * making it ideal for page transitions (unlike layout.tsx which persists)
 * 
 * Requirements: 1.1, 1.2, 1.4, 1.5
 * - Fade-in animation with 300ms duration (1.1)
 * - Fade-out animation with 200ms duration (1.2)
 * - Respects reduced motion preferences (1.4)
 * - Maintains dark theme color scheme (1.5)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
