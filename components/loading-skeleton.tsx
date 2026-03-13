"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      {/* Hero carb card skeleton */}
      <Card className="border-amber-200/50">
        <CardContent className="flex flex-col items-center py-6">
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-4 w-16 mt-2" />
          <div className="flex gap-4 mt-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </CardContent>
      </Card>

      {/* Supporting macro row skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="flex flex-col items-center py-4">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-3 w-10 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Item breakdown skeleton */}
      <div className="rounded-2xl border border-border p-4 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      <p className="text-center text-sm text-muted-foreground">Analyzing your meal...</p>
    </div>
  );
}
