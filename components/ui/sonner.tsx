"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

/**
 * Toast notification component with entrance animations
 * Uses Sonner library with custom theme integration
 * 
 * Requirements: 3.4, 3.5
 * - Slide in from top animation (3.4)
 * - Uses theme colors (3.5)
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={true}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success: 'group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border-accent',
          error: 'group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border-destructive',
          warning: 'group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border-yellow-500',
          info: 'group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border-blue-500',
        },
      }}
      style={
        {
          "--normal-bg": "var(--background)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--background)",
          "--success-text": "var(--foreground)",
          "--success-border": "var(--accent)",
          "--error-bg": "var(--background)",
          "--error-text": "var(--foreground)",
          "--error-border": "var(--destructive)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
