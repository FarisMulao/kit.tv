import { Skeleton } from "@/components/ui/skeleton";
import { ToggleCardSkeleton } from "./_components/toggle-card";

const ChatLoading = () => {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="w-[200px]" />
      <Skeleton className="h-1 w-full">
        <div className="space-y-4">
          <ToggleCardSkeleton />
          <ToggleCardSkeleton />
          <ToggleCardSkeleton />
        </div>
      </Skeleton>
    </div>
  );
};

export default ChatLoading;
