"use client";

import { useViewerToken } from "@/hooks/use-viewer-token";
import { User, Stream, Button } from "@prisma/client";
import { LiveKitRoom } from "@livekit/components-react";
import { Video } from "./video";
import { useChatSidebar } from "@/hooks/use-chat-sidebar";
import { cn } from "@/lib/utils";
import { Chat, ChatSkeleton } from "./chat";
import { ChatToggle } from "./chat-toggle";
import { Header, HeaderSkeleton } from "./header";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { getButtonsAction } from "@/server-actions/get-buttons";
import { Info } from "./info";
import { About } from "./about";

interface StreamPlayerProps {
  user: User & {
    stream: Stream | null;
    _count: { followedBy: number };
  };
  stream: Stream;
  isFollowing: boolean;
}

export const StreamPlayer = ({
  user,
  stream,
  isFollowing,
}: StreamPlayerProps) => {
  const { token, name, identity } = useViewerToken(user.id);

  const { collapsed } = useChatSidebar((state) => state);

  //silly bypass to allow us to call an async function
  const [buttons, setButtons] = useState<Button[]>([]);

  useEffect(() => {
    const fetchButtons = async () => {
      if (typeof window !== "undefined") {
        const buttons = await getButtonsAction(stream.userId);
        if (buttons.success && buttons.buttons) {
          setButtons(buttons.buttons);
        }
      }
    };
    fetchButtons();
  }, []);

  if (!token || !name || !identity) {
    return <div>Cannot view stream</div>;
  }

  return (
    <>
      {collapsed && (
        <div className="hidden lg:block fixed top-[87px] right-2 z-50">
          <ChatToggle />
        </div>
      )}
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
        className={cn(
          "grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full",
          collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
        )}
      >
        <div className="col-span-1 lg:col-span-2 xl:col-span-3 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar ">
          <Video hostName={user.username} hostIdentity={user.id} />
          <div className="bg-black pb-10">
            <Header
              hostName={user.username}
              hostIdentity={user.id}
              viewerIdentity={identity}
              imageUrl={user.imageUrl}
              isFollowing={isFollowing}
              name={stream.name ?? ""}
            />
            <Info
              hostIdentity={user.id}
              viewerIdentity={identity}
              name={stream.name ?? ""}
              thumbnailUrl={stream.thumbnailUrl ?? ""}
            />
            <About
              hostName={user.username}
              hostIdentity={user.id}
              viewerIdentity={identity}
              bio={user.bio ?? ""}
              followedByCount={user._count.followedBy}
            />
          </div>
        </div>
        <div className={cn("col-span-1", collapsed && "hidden")}>
          <Chat
            buttonList={buttons}
            hostName={user.username}
            hostIdentity={user.id}
            viewerName={name}
            isFollowing={isFollowing}
            isChatEnabled={stream.isChatEnabled}
            isChatFollowersOnly={stream.isChatFollowersOnly}
            isChatDelayed={stream.isChatDelayed}
          />
        </div>
      </LiveKitRoom>
    </>
  );
};

export const StreamPlayerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full">
      <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-3 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
        <Skeleton className="h-[calc(100vh-80px)]" />
        <HeaderSkeleton />
      </div>
      <div className="col-span-1 bg-background">
        <ChatSkeleton />
      </div>
    </div>
  );
};
