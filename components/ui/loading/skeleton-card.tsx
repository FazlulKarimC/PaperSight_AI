import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Icon skeleton */}
            <Skeleton className="h-6 w-6 rounded" />
            {/* Title skeleton */}
            <Skeleton className="h-6 flex-1 max-w-md" />
          </div>
          <div className="flex space-x-2">
            {/* Action buttons skeleton */}
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>

        {/* Timestamp skeleton */}
        <Skeleton className="h-4 w-32 mb-3" />

        {/* Content preview skeleton - 3 lines */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Badge skeleton */}
        <Skeleton className="h-6 w-24 rounded-full" />
      </CardContent>
    </Card>
  )
}
