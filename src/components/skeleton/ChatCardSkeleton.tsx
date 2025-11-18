import { Skeleton } from "../ui/skeleton";

export default function ChatCardSkeleton() {
  return (
    <div className="flex flex-col p-2">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-3 w-[125px]" />
        </div>
      </div>
    </div>
  );
}
