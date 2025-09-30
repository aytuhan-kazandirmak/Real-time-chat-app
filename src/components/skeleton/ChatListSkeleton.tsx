import { Skeleton } from "../ui/skeleton";

export default function ChatListSkeleton() {
  return (
    <div className="p-2 space-y-1">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="p-3 rounded-lg">
          <div className="flex items-start gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
