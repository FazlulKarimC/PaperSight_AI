'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { shake } from '@/lib/animations';
import { useRouter } from 'next/navigation';

/**
 * Props for the ErrorDisplay component
 */
interface ErrorDisplayProps {
  error: Error;
  errorInfo?: React.ErrorInfo | null;
  onRetry?: () => void;
  title?: string;
  message?: string;
  showDetails?: boolean;
}

/**
 * Error Display Component
 * Displays error information with retry functionality and shake animation
 * 
 * Requirements: 4.1, 4.3, 4.4, 4.5
 * - Displays error details (4.1)
 * - Provides retry button (4.3)
 * - Shake animation for errors (4.4)
 * - Uses destructive color from theme (4.5)
 */
export function ErrorDisplay({
  error,
  errorInfo,
  onRetry,
  title = 'Something went wrong',
  message,
  showDetails = process.env.NODE_ENV === 'development',
}: ErrorDisplayProps) {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-md"
        variants={shake}
        initial="initial"
        animate="animate"
      >
        <div className="rounded-lg border border-destructive/20 bg-card p-6 shadow-lg">
          {/* Error Icon */}
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>

          {/* Error Title */}
          <h2 className="mb-2 text-center text-xl font-semibold text-foreground">
            {title}
          </h2>

          {/* Error Message */}
          <p className="mb-4 text-center text-sm text-muted-foreground">
            {message || error.message || 'An unexpected error occurred. Please try again.'}
          </p>

          {/* Error Details (Development Only) */}
          {showDetails && (
            <details className="mb-4 rounded-md bg-destructive/5 p-3">
              <summary className="cursor-pointer text-xs font-medium text-destructive">
                Error Details
              </summary>
              <div className="mt-2 space-y-2">
                <div>
                  <p className="text-xs font-semibold text-destructive">Error:</p>
                  <pre className="mt-1 overflow-x-auto text-xs text-muted-foreground">
                    {error.toString()}
                  </pre>
                </div>
                {errorInfo && (
                  <div>
                    <p className="text-xs font-semibold text-destructive">Stack Trace:</p>
                    <pre className="mt-1 overflow-x-auto text-xs text-muted-foreground">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row">
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="destructive"
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Inline Error Display Component
 * Displays inline error messages with shake animation
 * Used for form errors and other inline error states
 * 
 * Requirements: 4.4, 4.5
 * - Shake animation for inline errors (4.4)
 * - Uses destructive color from theme (4.5)
 */
interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function InlineError({ message, onRetry, className = '' }: InlineErrorProps) {
  return (
    <motion.div
      className={`rounded-md border border-destructive/20 bg-destructive/10 p-3 ${className}`}
      variants={shake}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
        <div className="flex-1">
          <p className="text-sm text-destructive">{message}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="ghost"
              size="sm"
              className="mt-2 h-auto p-0 text-xs text-destructive hover:text-destructive/80"
            >
              <RefreshCw className="mr-1 h-3 w-3" />
              Try again
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
