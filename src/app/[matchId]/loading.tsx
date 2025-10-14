import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MatchLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Scoreboard Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center text-center">
                <div className="flex flex-col items-center gap-3 w-1/3">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-16 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex flex-col items-center gap-3 w-1/3">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 mt-8 lg:mt-0">
          {/* Video Skeleton */}
          <Card>
            <CardHeader><Skeleton className="h-8 w-32" /></CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full rounded-lg" />
            </CardContent>
          </Card>
          
          {/* Prediction Tool Skeleton */}
          <Card>
            <CardHeader><Skeleton className="h-8 w-40" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
