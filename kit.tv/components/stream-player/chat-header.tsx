"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ChatToggle } from "./chat-toggle";

export const ChatHeader = () => {
  return (
    <div className="relative p-3 border-b border-white/20">
      <div className="absolute left-2 top-2 lg:block">
        <ChatToggle />
      </div>

      <p className="font-semibold text-white text-center">Chat</p>
    </div>
  );
};

export const ChatHeaderSkeleton = () => {
  return (
    <div className="relative p-3 border-b hidden md:visible">
      <Skeleton className="absolute h-6 w-6 left-3 top-3" />
      <Skeleton className="w-28 h-6 mx-auto" />
    </div>
  );
};
