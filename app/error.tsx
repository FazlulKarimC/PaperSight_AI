'use client';

/**
 * Global Error Page
 * Catches and displays errors that occur during rendering
 * 
 * Requirements: 4.2
 * - Custom error page with navigation options
 */

import { useEffect } from 'react';
import { ErrorDisplay } from '@/components/ui/error/error-display';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <ErrorDisplay
      error={error}
      onRetry={reset}
      title="Oops! Something went wrong"
      message="We encountered an unexpected error. Please try again or return to the home page."
    />
  );
}
