import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Summary Skeleton Loader
 * Displays placeholder content while summary is being fetched
 * Matches the layout of the actual summary page
 */
export function SummarySkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Back Button */}
      <Button variant="ghost" className="mb-8 gap-2" disabled>
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Summary Header Section Skeleton */}
      <div className="mb-12">
        {/* Badge skeleton */}
        <Skeleton className="h-8 w-48 rounded-full mb-6" />

        {/* Title skeleton */}
        <Skeleton className="h-12 w-full max-w-2xl mb-6" />

        {/* Metadata skeleton */}
        <div className="flex flex-wrap gap-4 sm:gap-6 border-b border-border pb-8">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-36" />
        </div>
      </div>

      {/* Summary Content Skeleton */}
      <div className="relative rounded-xl border border-border bg-card p-8 sm:p-12 shadow-sm">
        <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent"></div>
        <div className="relative space-y-6">
          {/* Content lines skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
          
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
          </div>
          
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
