"use client";

import { useChatSidebar } from "@/store/use-chat-sidebar";
import {
  useChat,
  useConnectionState,
  useRemoteParticipant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ChatHeader, ChatHeaderSkeleton } from "./chat-header";
import { Skeleton } from "../ui/skeleton";
import { Button } from "@prisma/client";
import { pressButtonAction } from "@/actions/get-buttons";
import { Button as ShadcnButton } from "@/components/ui/button";

interface ChatProps {
  buttonList: Button[];
  hostName: string;
  hostIdentity: string;
  viewerName: string;
  isFollowing: boolean;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
}

export const Chat = ({
  buttonList,
  hostName,
  hostIdentity,
  viewerName,
  isFollowing,
  isChatEnabled,
  isChatDelayed,
  isChatFollowersOnly,
}: ChatProps) => {
  const matches = useMediaQuery(`(max-wdidth: 1024px)`);
  const { variant, onExapnd } = useChatSidebar((state) => state);
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);
  const [buttonTimeouts, setButtonTimeouts] = useState<Record<string, boolean>>({});

  const isOnline = participant && connectionState === ConnectionState.Connected;

  const isHidden = !isChatEnabled || !isOnline;

  const [value, setValue] = useState("");
  const { chatMessages: messages, send } = useChat();

  useEffect(() => {
    if (matches) {
      onExapnd();
    }
  }, [matches, onExapnd]);

  const reversedQueue = useMemo(() => {
    return [...messages].sort((a, b) => b.timestamp - a.timestamp);
  }, [messages]);

  const handleButtonClick = async (button: Button) => {
    if (buttonTimeouts[button.id] || typeof window === "undefined") return;
    console.log("sending press button action");
    try {
      await pressButtonAction(button.id);
      console.log("sent button press action");
      // Set timeout for this button
      setButtonTimeouts(prev => ({ ...prev, [button.id]: true }));
      
      // Clear timeout after the button's timeout period
      setTimeout(() => {
        setButtonTimeouts(prev => ({ ...prev, [button.id]: false }));
      }, button.timeout);
    } catch (error) {
      console.error("Failed to press button:", error);
    }
  };

  const onSubmit = () => {
    if (!send) {
      return;
    }

    send(value);
    setValue("");
  };

  const onChange = (value: string) => {
    setValue(value);
  };

  return (
    <div className="flex flex-col bg-secondary border-l border-b pt-0 h-[calc(100vh-80px)]">
      <ChatHeader />
      <div className="flex flex-col gap-y-2 p-4">
        {typeof window !== "undefined" && buttonList.map((button) => (
          <ShadcnButton
            key={button.id}
            onClick={() => handleButtonClick(button)}
            variant="secondary"
            className="w-full"
            disabled={buttonTimeouts[button.id]}
            style={{ 
              backgroundColor: '#' + button.color.toString(16).padStart(6, '0'), 
              color: 'white', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {button.text}
          </ShadcnButton>
        ))}
      </div>
    </div>
  );
};

export const ChatSkeleton = () => {
  return (
    <div className="flex h-full items-center justify-center ">
      <Skeleton className=" pt-0 h-[calc(100vh-80px)]" />
    </div>
  );
};
