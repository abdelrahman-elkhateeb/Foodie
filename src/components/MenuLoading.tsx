import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function MenuLoading({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="space-y-4 rounded-xl border p-4"
        >
          <Skeleton className="aspect-square w-full rounded-lg sm:aspect-[4/3]" />

          <Skeleton className="h-6 w-3/4" />

          <Skeleton className="h-4 w-full" />

          <Skeleton className="h-4 w-2/3" />

          <div className="flex justify-between">
            <Skeleton className="h-8 w-20" />

            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}