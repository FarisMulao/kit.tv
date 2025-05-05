"use client";

import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { useEffect } from "react";

export const ChatToggle = () => {
  const { collapsed, onExapnd, onCollapse } = useChatSidebar((state) => state);
  const Icon = collapsed ? ArrowLeftFromLine : ArrowRightFromLine;
  const label = collapsed ? "Expand" : "Collapse";

  return (
    <Hint label={label} side="left" asChild>
      <Button
        className="h-auto p-2 hover:bg-white/10 hover:text-primary bg-transparent"
        variant="ghost"
        onClick={collapsed ? onExapnd : onCollapse}
      >
        <Icon className="h-4 w-4" />
      </Button>
    </Hint>
  );
};
