"use client";

import { User } from "@prisma/client";
import { useSidebar } from "@/store/use-sidebar";
import { UserItem, UserItemSkeleton } from "./user-item";

interface RecommendedProps {
  data: (User & { stream: { isLive: boolean } | null })[];
}

export const Recommended = ({ data }: RecommendedProps) => {
  const collapsed = useSidebar((state) => state.collapsed);

  const showLabel = !collapsed && data.length > 0;

  return (
    <div>
      {showLabel && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground">Recommended</p>
        </div>
      )}
      {data.map((user) => (
        <UserItem
          key={user.id}
          username={user.username}
          imageUrl={user.imageUrl}
          isLive={user.stream?.isLive}
        />
      ))}
    </div>
  );
};

export const RecommendedSkeleton = () => {
  return (
    <ul className="px-2">
      {[...Array(3)].map((_, i) => (
        <UserItemSkeleton key={i} />
      ))}
    </ul>
  );
};
