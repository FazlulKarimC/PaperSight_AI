# Design Document: Page Transitions and Loading States

## Overview

This design implements smooth page transitions, comprehensive loading states, and error handling for the PaperSight AI application using Framer Motion and shadcn/ui components. The solution prioritizes performance, accessibility, and consistency with the existing dark theme aesthetic featuring cyan/teal accent colors.

The implementation follows a component-based architecture with reusable animation utilities, ensuring maintainability and consistency across the application. All animations respect user preferences for reduced motion and use GPU-accelerated transforms for optimal performance.

## Architecture

### Component Hierarchy

```
app/
├── layout.tsx (PageTransitionProvider, ErrorBoundary)
├── loading.tsx (Global loading state)
├── error.tsx (Global error page)
├── not-found.tsx (404 page)
├── dashboard/page.tsx (with loading states)
├── upload/page.tsx (enhanced animations)
└── summary/[id]/page.tsx (with loading states)

components/
├── ui/
│   ├── loading/
│   │   ├── page-transition.tsx (Framer Motion wrapper)
│   │   ├── loading-spinner.tsx (shadcn-based spinner)
│   │   └── progress-bar.tsx (Top loading bar)
│   ├── error/
│   │   ├── error-boundary.tsx (Error boundary wrapper)
│   │   └── error-display.tsx (Error UI component)
│   └── skeleton.tsx (shadcn skeleton component)

lib/
└── animations.ts (Reusable animation variants)
```

### Data Flow

1. **Page Navigation**: User clicks link → Next.js router → PageTransition wrapper animates exit → Route changes → PageTransition animates entrance
2. **Data Loading**: Component mounts → Show loading state → Fetch data → Animate content entrance
3. **Error Handling**: Error occurs → Error boundary catches → Display error UI with retry option

## Components and Interfaces

### 1. Animation Utilities (`lib/animations.ts`)

```typescript
// Animation variants for Framer Motion
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Respects prefers-reduced-motion
export const getAnimationConfig = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return {
    duration: prefersReducedMotion ? 0 : 0.3,
    ease: [0.4, 0, 0.2, 1]
  }
}
```

### 2. Page Transition Wrapper (`components/ui/loading/page-transition.tsx`)

```typescript
interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

// Wraps page content with fade transition
// Uses Framer Motion's motion.div
// Applies fadeIn variants with reduced motion support
```

### 3. Loading Spinner (`components/ui/loading/loading-spinner.tsx`)

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Uses shadcn/ui styling
// Animated with CSS or Framer Motion
// Uses accent color from theme
```

### 4. Progress Bar (`components/ui/loading/progress-bar.tsx`)

```typescript
interface ProgressBarProps {
  progress?: number // 0-100, undefined for indeterminate
  className?: string
}

// Fixed position at top of viewport
// Animated width transitions
// Uses accent color gradient
```

### 5. Error Boundary (`components/ui/error/error-boundary.tsx`)

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
}

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

// React error boundary implementation
// Catches errors in child components
// Provides reset functionality
```

### 6. Skeleton Components

Using shadcn/ui skeleton component with custom variants:
- `SkeletonCard` - For summary cards
- `SkeletonList` - For list items
- `SkeletonText` - For text content

## Data Models

### Animation Configuration

```typescript
interface AnimationConfig {
  duration: number
  ease: number[] | string
  delay?: number
}

interface TransitionVariants {
  initial: Record<string, any>
  animate: Record<string, any>
  exit: Record<string, any>
  transition?: AnimationConfig
}
```

### Loading State

```typescript
interface LoadingState {
  isLoading: boolean
  progress?: number
  stage?: 'uploading' | 'parsing' | 'saving'
  message?: string
}
```

### Error State

```typescript
interface ErrorState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After reviewing all testable properties from the prework, several can be consolidated:

- Properties 1.5, 3.5, 6.3, 6.4, and 6.5 all relate to theme consistency and can be combined into a single comprehensive property about maintaining design system values
- Properties 3.1 and 3.3 both test stagger timing and can be combined into one property about stagger animations
- Properties 1.1 and 1.2 both test page transition animations and can be combined

### Correctness Properties

Property 1: Page transition animations
*For any* page navigation, entering pages should fade in with 300ms duration and exiting pages should fade out with 200ms duration
**Validates: Requirements 1.1, 1.2**

Property 2: GPU-accelerated animations
*For any* animation in the application, only transform and opacity CSS properties should be animated (not layout properties like width, height, top, left)
**Validates: Requirements 1.3**

Property 3: Reduced motion accessibility
*For any* user with prefers-reduced-motion enabled, all animation durations should be set to 0ms or animations should be disabled
**Validates: Requirements 1.4**

Property 4: Loading state visibility
*For any* page in a loading state, a progress bar should be visible at the top of the viewport
**Validates: Requirements 2.4**

Property 5: Loading area interaction prevention
*For any* component in a loading state, user interactions (clicks, form submissions) should be prevented or disabled
**Validates: Requirements 2.5**

Property 6: Stagger animation timing
*For any* list of elements with stagger animations, each subsequent element should begin animating with the specified delay (50ms for lists, 100ms for cards) after the previous element
**Validates: Requirements 3.1, 3.3**

Property 7: Animation direction consistency
*For any* stat card animation, the initial y-position should be positive (below final position) and animate to 0, creating a bottom-to-top effect
**Validates: Requirements 3.2**

Property 8: Alert animation direction
*For any* alert or notification, the initial y-position should be negative (above final position) and animate to 0, creating a top-to-bottom slide effect
**Validates: Requirements 3.4**

Property 9: Error boundary catching
*For any* JavaScript error thrown in a component tree, the error boundary should catch it and display the error UI instead of crashing the application
**Validates: Requirements 4.1**

Property 10: Error boundary retry functionality
*For any* error boundary display, clicking the retry button should reset the error state and re-render the child components
**Validates: Requirements 4.3**

Property 11: Inline error animations
*For any* inline error message, a shake animation should be applied when the error appears
**Validates: Requirements 4.4**

Property 12: Upload progress display
*For any* file upload operation, a progress bar should be visible and its value should increase from 0 to 100 as the upload progresses
**Validates: Requirements 5.1, 5.2**

Property 13: Upload stage transitions
*For any* upload operation, transitions between stages (uploading → parsing → saving) should be animated
**Validates: Requirements 5.3**

Property 14: Upload completion animation
*For any* successful upload, a success animation should complete before navigation to the summary page occurs
**Validates: Requirements 5.4**

Property 15: Upload error handling
*For any* failed upload, an animated error state with a retry button should be displayed
**Validates: Requirements 5.5**

Property 16: Theme consistency
*For any* loading state, error state, or animation, the colors used should match the design system tokens (background, foreground, accent, destructive, border values)
**Validates: Requirements 1.5, 3.5, 4.5, 6.3, 6.4, 6.5**

## Error Handling

### Error Categories

1. **JavaScript Runtime Errors**
   - Caught by Error Boundary
   - Display error message with stack trace (dev mode only)
   - Provide retry button
   - Log to error monitoring service

2. **Network Errors**
   - Display inline error messages
   - Animate error appearance
   - Provide retry functionality
   - Show specific error details (timeout, connection failed, etc.)

3. **404 Not Found**
   - Custom not-found page
   - Animated entrance
   - Navigation options to home/dashboard
   - Search functionality (optional)

4. **Upload Errors**
   - Inline error display in upload component
   - Shake animation for error message
   - Clear error state on retry
   - Preserve file selection when possible

### Error Recovery Strategies

```typescript
// Error boundary with retry
const handleRetry = () => {
  resetErrorBoundary()
  // Optionally refetch data or reset state
}

// Network error retry with exponential backoff
const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}
```

## Testing Strategy

### Unit Testing

1. **Animation Utilities**
   - Test animation variant objects have correct structure
   - Test getAnimationConfig respects reduced motion
   - Test duration and easing values

2. **Component Rendering**
   - Test LoadingSpinner renders with correct size variants
   - Test ProgressBar displays correct progress value
   - Test ErrorBoundary catches errors
   - Test Skeleton components render with correct dimensions

3. **Error Handling**
   - Test error boundary catches and displays errors
   - Test retry functionality resets state
   - Test error messages display correctly

### Integration Testing

1. **Page Transitions**
   - Test navigation triggers animations
   - Test animations complete before content renders
   - Test reduced motion disables animations

2. **Loading States**
   - Test loading states display during data fetching
   - Test loading states clear when data arrives
   - Test skeleton loaders match content layout

3. **Upload Flow**
   - Test progress updates during upload
   - Test stage transitions animate correctly
   - Test error states display on failure
   - Test success animation plays before redirect

### Property-Based Testing

Property-based tests will use `@fast-check/vitest` library (or similar for the testing framework in use). Each test should run a minimum of 100 iterations.

1. **Animation Timing Property**
   - Generate random animation durations
   - Verify all durations are within acceptable range (0-1000ms)
   - Verify reduced motion sets duration to 0

2. **Stagger Delay Property**
   - Generate random lists of varying lengths
   - Verify each element's animation delay increases by the stagger amount
   - Verify first element has no delay

3. **Color Consistency Property**
   - Generate random component states (loading, error, success)
   - Verify all colors used match theme tokens
   - Verify no hardcoded color values

4. **Error Boundary Property**
   - Generate random errors
   - Verify error boundary catches all errors
   - Verify retry functionality works for all error types

### Manual Testing Checklist

- [ ] Test page transitions on all routes
- [ ] Test loading states during data fetching
- [ ] Test error states by simulating failures
- [ ] Test on different screen sizes

## Implementation Notes

### Performance Considerations

1. **Animation Performance**
   - Use `transform` and `opacity` only (GPU-accelerated)
   - Avoid animating `width`, `height`, `top`, `left` (causes layout recalculation)
   - Use `will-change` sparingly and only during animations
   - Remove `will-change` after animation completes

2. **Loading State Optimization**
   - Implement skeleton loaders that match content dimensions
   - Avoid layout shift when content loads
   - Use React Suspense where appropriate
   - Lazy load heavy components

3. **Bundle Size**
   - Framer Motion is ~30KB gzipped
   - Tree-shake unused animation features
   - Consider using `framer-motion/dist/framer-motion` for smaller bundle

### Accessibility

1. **Reduced Motion**
   - Respect `prefers-reduced-motion` media query
   - Disable animations when reduced motion is enabled

### Theme Integration

The application uses a dark theme with the following key colors:
- Background: `oklch(0.08 0 0)` - Very dark gray/black
- Foreground: `oklch(0.98 0 0)` - Near white
- Accent: `oklch(0.7 0.15 180)` - Cyan/teal
- Destructive: `oklch(0.577 0.245 27.325)` - Red
- Border: `oklch(0.25 0 0)` - Dark gray

All loading spinners, progress bars, and animated elements should use these colors to maintain consistency.

### Dependencies

```json
{
  "dependencies": {
    "framer-motion": "^11.0.0"
  }
}
```

shadcn/ui components to install:
- `skeleton` - For loading placeholders
- Already have: `alert`, `button`, `progress` (if not, install these)

## File Structure

```
.kiro/specs/page-transitions-loading-states/
├── requirements.md
├── design.md (this file)
└── tasks.md (to be created)

app/
├── layout.tsx (modified)
├── loading.tsx (new)
├── error.tsx (new)
├── not-found.tsx (new)
├── dashboard/
│   └── page.tsx (modified)
├── upload/
│   └── page.tsx (modified)
└── summary/[id]/
    └── page.tsx (modified)

components/ui/
├── loading/
│   ├── page-transition.tsx (new)
│   ├── loading-spinner.tsx (new)
│   ├── progress-bar.tsx (new)
│   └── skeleton-card.tsx (new)
├── error/
│   ├── error-boundary.tsx (new)
│   └── error-display.tsx (new)
└── skeleton.tsx (shadcn component)

lib/
└── animations.ts (new)
```

## Migration Strategy

1. Install dependencies (framer-motion, shadcn skeleton)
2. Create animation utilities and base components
3. Add error boundary and error pages
4. Implement loading states page by page
5. Add page transitions to layout
6. Test and refine animations

This phased approach allows for incremental testing and reduces risk of breaking existing functionality.
